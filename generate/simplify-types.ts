import { readFile, rm, writeFile } from "fs/promises";
import { join } from "path";
import { IconPackConfig } from "./config.interface";
import { configs } from "./configs";

async function simplifyPack(pack: IconPackConfig) {
  const indexPath = join("lib", "lib", pack.prefix, `${pack.prefix}.d.ts`);
  const indexContent = (await readFile(indexPath)).toString();

  const updatedExports = indexContent.replace(
    /^.*{ (.*?) }.*\/icons.*$/gm,
    (_, symbolName: string) =>
      `export declare const ${symbolName}: Component<IconProps & ${pack.prefix}Props>`
  );

  const result = [
    "import { Component } from '@builder.io/qwik'",
    "import { IconProps } from '../../utils/icon-props'",
    `import { ${pack.prefix}Props } from './props'`,
    updatedExports,
  ].join("\n");

  await writeFile(indexPath, result);
  await rm(join("lib", "lib", pack.prefix, "icons"), { recursive: true });
}
async function run() {
  await Promise.all(configs.map(simplifyPack));
}

run();
