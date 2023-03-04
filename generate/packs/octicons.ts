import glob from "fast-glob";
import { definePack } from "../define-pack";
import { extractor } from "../extractor";

export const octiconPack = definePack({
  name: "Github Octicons",
  prefix: "Go",
  variants: { res: ["12", "16", "24", "48", "96"] },
  defaultVariants: { res: "24" },
  contents: {
    files: glob("node_modules/@primer/octicons/build/svg/*.svg"),
    extract: extractor(/^.*\/(?<name>.+?)-(?<res>[0-9]+)\.svg/, { res: "24" }),
  },
  projectUrl: "https://octicons.github.com/",
  license: "MIT",
  licenseUrl: "https://github.com/primer/octicons/blob/master/LICENSE",
  coloring: "fill",
});
