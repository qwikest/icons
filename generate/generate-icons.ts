import { mkdir, readFile, rm, writeFile } from "fs/promises";
import { basename, dirname, join } from "path";
import { optimize } from "svgo";
import {
  IconPackConfig,
  IconPackContents as IconPackContent,
} from "../src/utils/config.interface";
import { configs } from "./configs.js";

const iconLimit = process.env["ICON_LIMIT"];
const baseOutputPath = "src/generated";
const getOutputPath = (pack: IconPackConfig, name: string, ext: string) =>
  `${baseOutputPath}/${pack.prefix.toLowerCase()}/${name}${ext}`;

const ext = ".tsx";

function getFolder(path: string) {
  const splitted = path.split("/");
  return splitted[splitted.length - 2];
}

function getIndexPath(pack: IconPackConfig) {
  return getOutputPath(pack, pack.prefix.toLowerCase(), ".ts");
}

function dashCase(input: string) {
  return input
    .replace(/(?<!^)[A-Z]/g, (match) => "-" + match.toLowerCase())
    .replace(/ /g, "-")
    .replace(/--+/g, "-")
    .toLowerCase();
}

export function camelCase(input: string) {
  return input.replace(/(?:^|-)([a-z0-9])/g, (result) => {
    return result.replace(/^-/, "").toUpperCase();
  });
}

function getNames(
  baseName: string,
  contents: IconPackContent,
  pack: IconPackConfig
) {
  const withoutExtension = camelCase(baseName.replace(/\..*?$/, ""));
  const formatted =
    pack.prefix + (contents?.formatter?.(withoutExtension) ?? withoutExtension);

  return {
    camelCase: camelCase(formatted),
    dashCase: dashCase(camelCase(formatted)),
  };
}

async function generateIcon(
  file: string,
  contents: IconPackContent,
  pack: IconPackConfig
) {
  const names = getNames(basename(file), contents, pack);

  const otherColoring = pack.coloring === "fill" ? "stroke" : "fill";
  const keepColoring = pack.coloring === "keep";

  const colorAttributes = keepColoring
    ? {}
    : { [pack.coloring]: "currentColor", [otherColoring]: "none" };

  const content = (await readFile(file)).toString();
  const optimized = optimize(content, {
    plugins: [
      "removeDimensions",
      {
        name: "addAttributesToSVGElement",
        params: {
          attributes: Object.entries({
            ...colorAttributes,
            width: "1em",
            height: "1em",
            "data-qwikest-icon": names.dashCase,
          }).map(([key, value]) => ({ [key]: value })),
        },
      },
    ],
  }).data;

  const svgElement = optimized
    .match(/<svg[\w\W]*<\/svg>/gm)
    ?.toString()
    .replace(">", `{...props} >`);

  const fileContent = [
    'import { component$ } from "@builder.io/qwik"',
    'import { IconProps } from "../../types/icon-props"',
    `export const ${names.camelCase} = component$((props: IconProps) =>`,
    svgElement,
    `);`,
  ].join("\n");

  const path = getOutputPath(pack, names.dashCase, ext);

  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, fileContent);
  return { path, symbolName: names.camelCase, names };
}

async function generateIconPackContent(
  content: IconPackContent,
  pack: IconPackConfig
) {
  const fileLimit = iconLimit ? parseInt(iconLimit) : undefined;
  const files = (await content.files).slice(0, fileLimit);
  return Promise.all(files.map((file) => generateIcon(file, content, pack)));
}

async function generateIcons(pack: IconPackConfig) {
  await rm(dirname(getIndexPath(pack)), { force: true, recursive: true });

  const result = await Promise.all(
    pack.contents.flatMap((content) => generateIconPackContent(content, pack))
  );

  const icons = result.flat();

  const indexContent = icons
    .map(({ path, symbolName, names }) => {
      const relative = `./${basename(path, ext)}`;
      return `export { ${symbolName} } from '${relative}';`;
    })
    .join("\n");

  await writeFile(getIndexPath(pack), indexContent);

  console.log(`Generated ${pack.name}: ${icons.length} icons`);
}

async function createConfigs(packs: IconPackConfig[]) {
  const configs = JSON.stringify(
    packs.map(({ license, licenseUrl, name, prefix, projectUrl }) => ({
      license,
      licenseUrl,
      name,
      prefix,
      projectUrl,
    }))
  );
  const content = `export const configs = ${configs};`;

  await writeFile(join(baseOutputPath, "configs.ts"), content);
}

async function createRootIndex(packs: IconPackConfig[]) {
  const content = packs
    .map(
      (pack) =>
        `export * from './${pack.prefix.toLowerCase()}/${pack.prefix.toLowerCase()}';`
    )
    .join("\n");

  await writeFile(join(baseOutputPath, "index.ts"), content);
}

async function cleanup() {
  await rm(baseOutputPath, { force: true, recursive: true });
  await mkdir(baseOutputPath);
  await writeFile(join(baseOutputPath, ".gitkeep"), "");
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
