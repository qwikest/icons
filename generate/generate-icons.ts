import { mkdir, readFile, rm, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { optimize } from "svgo";
import { IconPackConfig } from "./config.interface";
import { configs } from "./configs";
import { downloadIcons } from "./download-icons";

const iconLimit = process.env["ICON_LIMIT"];
const baseOutputPath = "src/icons";
const pageOutputPath = "src/page";

const getOutputPath = (pack: IconPackConfig, name: string, ext: string) =>
  `${baseOutputPath}/${pack.prefix.toLowerCase()}/${name}${ext}`;

const ext = ".jsx";

function getIndexPath(pack: IconPackConfig, ext: string) {
  return getOutputPath(pack, pack.prefix.toLowerCase(), ext);
}

function getVariantPath(iconDashCase: string, pack: IconPackConfig) {
  return getOutputPath(pack, iconDashCase, ext);
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
    .replace(/(?:^|[- _])+([a-z0-9])/g, (result) => {
      return result.replace(/^[- _]+/, "").toUpperCase();
    })
    .replace(/[0-9][a-z]/g, (match) => match.toUpperCase());
}

function getIconVariantNames(path: string, pack: IconPackConfig) {
  const { name, ...variants } = pack.contents.extract(path);

  if (!name) {
    throw new Error(`Cannot resolve icon name for "${path}".`);
  }

  const variantSuffix = Object.values(variants)
    .filter(Boolean)
    .map((value) => "-" + value)
    .join("");
  const formatted = pack.prefix + camelCase(name) + variantSuffix;

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
      "removeComments",
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
    .replace(">", ` {...props} >`)
    .replace(/<!--.*?-->/g, "");

  const fileContent = [
    `export const ${names.camelCase} = (props) =>`,
    svgElement,
    `;`,
  ].join("\n");

  const path = getVariantPath(names.dashCase, pack);

  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, fileContent);
  return { path, symbolName: names.camelCase, names };
}

async function generateIcons(pack: IconPackConfig) {
  await rm(dirname(getIndexPath(pack, ".ts")), {
    force: true,
    recursive: true,
  });

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

  const indexContent = [
    ...variantsResult.map((variant) => {
      const relative = `./${variant.names.dashCase}`;
      return `export { ${variant.symbolName} } from '${relative}';`;
    }),
  ].join("\n");

  const indexDeclarationContent = [
    "import type { JSXNode } from '@builder.io/qwik';",
    "import type { IconProps } from '../../utils';",
    ...variantsResult.map(
      (variant) =>
        `export declare const ${variant.symbolName}: (props: IconProps) => JSXNode;`
    ),
  ].join("\n");

  await writeFile(getIndexPath(pack, ".js"), indexContent);
  await writeFile(getIndexPath(pack, ".ts"), indexDeclarationContent);

  console.log(`Generated ${pack.name}: ${variantsResult.length} icons`);
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
        `export * from './${pack.prefix.toLowerCase()}/${pack.prefix.toLowerCase()}';
`
    )
    .join("\n");

  await writeFile(join(baseOutputPath, "all.ts"), content);
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
