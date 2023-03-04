import glob from "fast-glob";
import { definePack } from "../define-pack";
import { extractor } from "../extractor";

export const lucidePack = definePack({
  name: "Lucide",
  prefix: "Lu",
  variants: {},
  defaultVariants: {},
  contents: {
    files: glob("node_modules/lucide-static/icons/*.svg"),
    extract: extractor(/^.*\/(?<name>.+?)\.svg/),
  },
  projectUrl: "https://lucide.dev/",
  license: "ISC",
  licenseUrl: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
  coloring: "stroke",
});
