import { mkdir, readFile, rm, writeFile } from "fs/promises";
import { basename, dirname, join } from "path";
import { optimize } from "svgo";
import { AnyIconVariants, IconPackConfig } from "./config.interface";
import { configs } from "./configs";
import { downloadIcons } from "./download-icons";

const iconLimit = process.env["ICON_LIMIT"];
const baseOutputPath = "src/lib";
const pageOutputPath = "src/page";

const getOutputPath = (pack: IconPackConfig, name: string, ext: string) =>
  `${baseOutputPath}/${pack.prefix.toLowerCase()}/${name}${ext}`;

const ext = ".tsx";

function getIndexPath(pack: IconPackConfig) {
  return getOutputPath(pack, pack.prefix.toLowerCase(), ".ts");
}

function getVariantPath(iconDashCase: string, pack: IconPackConfig) {
  return getOutputPath(pack, "variants/" + iconDashCase, ext);
}

function dashCase(input: string) {
  return input
    .replace(/(?<!^)[A-Z]/g, (match) => "-" + match.toLowerCase())
    .replace(/ /g, "-")
    .replace(/--+/g, "-")
    .toLowerCase();
}

export function camelCase(input: string) {
  return input
    .replace(/(?:^|[- ])([a-z0-9])/g, (result) => {
      return result.replace(/^[- ]/, "").toUpperCase();
    })
    .replace(/[0-9][a-z]/g, (match) => match.toUpperCase());
}

function getIconVariantNames(path: string, pack: IconPackConfig) {
  const { name, ...variants } = pack.contents.extract(path);

  if (!name) {
    throw new Error(`Cannot resolve icon name for "${path}".`);
  }

  const variantSuffix = Object.values(variants)
    .map((value) => "-" + value)
    .join("");
  const formatted = "__" + pack.prefix + camelCase(name) + variantSuffix;

  return {
    camelCase: camelCase(formatted),
    dashCase: dashCase(camelCase(formatted)),
  };
}

async function generateIconVariant(file: string, pack: IconPackConfig) {
  const names = getIconVariantNames(file, pack);

  const otherColoring = pack.coloring === "fill" ? "stroke" : "fill";
  const keepColoring = pack.coloring === "keep";

  const colorAttributes = keepColoring
    ? {}
    : { [pack.coloring]: "currentColor", [otherColoring]: "none" };

  const content = (await readFile(file)).toString();
  const replaced = pack.replaceColor
    ? content.replace(new RegExp(pack.replaceColor, "g"), "currentColor")
    : content;

  const optimized = optimize(replaced, {
    plugins: [
      "removeDimensions",
      {
        name: "addAttributesToSVGElement",
        params: {
          attributes: Object.entries({
            ...colorAttributes,
            width: "1em",
            height: "1em",
            "data-qwikest-icon": undefined,
          }).map(([key, value]) => ({ [key]: value })),
        },
      },
    ],
  }).data;

  const svgElement = optimized
    .match(/<svg[\w\W]*<\/svg>/gm)
    ?.toString()
    .replace(">", ` {...props} >`);

  const fileContent = [
    'import { component$ } from "@builder.io/qwik"',
    'import { IconProps } from "../../../utils/icon-props"',
    `export const ${names.camelCase} = component$((props: IconProps) =>`,
    svgElement,
    `);`,
  ].join("\n");

  const path = getVariantPath(names.dashCase, pack);

  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, fileContent);
  return { path, symbolName: names.camelCase, names };
}

interface GenerateIcon {
  name: string;
  variants: {
    symbolName: string;
    path: string;
    variants: AnyIconVariants;
  }[];
}
async function generateIcon(icon: GenerateIcon, pack: IconPackConfig) {
  const symbolName = pack.prefix + camelCase(icon.name);
  const propsTypeName = `${pack.prefix}Props`;
  const variantKeys = Object.keys(pack.variants);
  const hasVariants = icon.variants.length >= 1;

  const iconDefinition = hasVariants
    ? `const icon = useVariantIcon(variants, { ${variantKeys.join()} }, ${
        pack.prefix
      }Context, ${pack.prefix}PropsDefault)`
    : "const icon = variants[0];";

  const variantImports = hasVariants
    ? [
        'import { useVariantIcon } from "../../../utils/use-variant-icon"',
        `import { ${pack.prefix}Context } from "../context";`,
        `import { ${propsTypeName}Default } from "../props"`,
      ]
    : [];

  const fileContent = [
    'import { component$ } from "@builder.io/qwik"',
    'import { IconProps } from "../../../utils/icon-props"',
    `import { ${propsTypeName} } from "../props"`,
    ...variantImports,
    ...icon.variants.map(
      (variant) =>
        `import { ${variant.symbolName} } from "../variants/${basename(
          variant.path,
          ext
        )}"`
    ),
    "const variants = [",
    ...icon.variants.map(
      (icon) => `{
        component: ${icon.symbolName},
        variants: ${JSON.stringify(icon.variants, undefined, " ")}
      },`
    ),
    "]",
    `export const ${symbolName} = component$(({ ${[...variantKeys, "key"]
      .map((key) => key + ",")
      .join(" ")} ...props}: IconProps & ${propsTypeName}) => {`,
    iconDefinition,
    `return <icon.component {...props} />`,
    `});`,
  ].join("\n");

  const path = getOutputPath(pack, "icons/" + dashCase(icon.name), ext);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, fileContent);

  return { symbolName, path };
}

async function generateProps(pack: IconPackConfig) {
  const fileContent = `export interface ${pack.prefix}Props {
${Object.entries(pack.variants).map(
  ([variant, values]) =>
    `  ${variant}?: ${values.map((value) => `"${value}"`).join(" | ")}`
)}
}

export const ${pack.prefix}PropsDefault: ${pack.prefix}Props = ${JSON.stringify(
    pack.defaultVariants
  )};
`;

  const path = getOutputPath(pack, "props", ext);
  await writeFile(path, fileContent);
}

async function generateContext(pack: IconPackConfig) {
  const fileContent = `import { createContextId } from "@builder.io/qwik";
  import { ${pack.prefix}Props } from "./props";
  
  export const ${pack.prefix}Context = createContextId<${pack.prefix}Props>("${pack.prefix}Context");`;

  const path = getOutputPath(pack, "context", ext);
  await writeFile(path, fileContent);
}

async function generateIcons(pack: IconPackConfig) {
  await rm(dirname(getIndexPath(pack)), { force: true, recursive: true });

  if (pack.download) {
    await downloadIcons(pack);
  }

  const fileLimit = iconLimit ? parseInt(iconLimit) : undefined;
  const files = (await pack.contents.files).slice(0, fileLimit);

  const variantsResult = await Promise.all(
    files.map(async (file) => ({
      file,
      ...(await generateIconVariant(file, pack)),
    }))
  );

  const iconMap = new Map<string, GenerateIcon>();
  variantsResult.forEach(({ path, symbolName, file }) => {
    const { name, ...variants } = pack.contents.extract(file);
    const current = iconMap.get(name) ?? { name, variants: [] };
    current.variants.push({ path, symbolName, variants });
    iconMap.set(name, current);
  });

  const result = await Promise.all(
    Array.from(iconMap.values()).map((entry) => generateIcon(entry, pack))
  );

  await generateProps(pack);
  await generateContext(pack);

  const icons = result.flat();

  const indexContent = [
    ...icons.map(({ path, symbolName }) => {
      const relative = `./icons/${basename(path, ext)}`;
      return `export { ${symbolName} } from '${relative}';`;
    }),
    `export { ${pack.prefix}Context } from './context';`,
    `export type { ${pack.prefix}Props } from './props';`,
  ].join("\n");

  await writeFile(getIndexPath(pack), indexContent);

  console.log(`Generated ${pack.name}: ${icons.length} icons`);
}

async function createConfigs(packs: IconPackConfig[]) {
  const configs = JSON.stringify(
    packs.map(
      ({
        license,
        licenseUrl,
        name,
        prefix,
        projectUrl,
        variants,
        defaultVariants,
      }) => ({
        license,
        licenseUrl,
        name,
        prefix,
        projectUrl,
        variants,
        defaultVariants,
      })
    )
  );
  const content = `export const configs = ${configs};`;

  await writeFile(join(pageOutputPath, "configs.ts"), content);
}

async function createRootIndex(packs: IconPackConfig[]) {
  const content = packs
    .map(
      (pack) =>
        `export * from '../lib/${pack.prefix.toLowerCase()}/${pack.prefix.toLowerCase()}';
`
    )
    .join("\n");

  await writeFile(join(pageOutputPath, "all.ts"), content);
}

async function cleanup() {
  await rm(baseOutputPath, { force: true, recursive: true });
  await rm(pageOutputPath, { force: true, recursive: true });
  await mkdir(baseOutputPath);
  await mkdir(pageOutputPath);
  await writeFile(join(baseOutputPath, ".gitkeep"), "");
  await writeFile(join(pageOutputPath, ".gitkeep"), "");
}

export async function run() {
  await cleanup();
  return Promise.all([
    ...configs.map(generateIcons),
    createRootIndex(configs),
    createConfigs(configs),
  ]);
}

run();
