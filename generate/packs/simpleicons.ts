import glob from "fast-glob";
import { definePack } from "../define-pack";
import { extractor } from "../extractor";

const extractRegex = /^.*\/(?<name>.+?)(-(?<variant>fill))?\.svg/;

export const simpleIconsPack = definePack({
  name: "SimpleIcons",
  prefix: "Si",
  variants: {},
  defaultVariants: {},
  contents: {
    files: glob("node_modules/simple-icons/icons/*.svg"),
    extract: extractor(/^.*\/(?<name>.+?)\.svg/),
  },
  projectUrl: "https://simpleicons.org/",
  license: "CC0 1.0",
  licenseUrl:
    "https://github.com/simple-icons/simple-icons/blob/develop/LICENSE.md",
  coloring: "fill",
});
