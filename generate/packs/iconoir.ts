import glob from "fast-glob";
import { definePack } from "../define-pack";
import { extractor } from "../extractor";

export const iconoirPack = definePack({
  name: "Iconoir",
  prefix: "In",
  variants: {},
  defaultVariants: {},
  download: {
    zip: "https://github.com/iconoir-icons/iconoir/archive/refs/heads/main.zip",
    folder: "iconoir-main/icons",
  },
  contents: {
    files: glob("download/Iconoir/*.svg"),
    extract: extractor(/^.*\/(?<name>.+?)\.svg/),
  },
  projectUrl: "https://iconoir.com/",
  license: "MIT",
  licenseUrl: "https://github.com/iconoir-icons/iconoir/blob/main/LICENSE",
  coloring: "keep",
});
