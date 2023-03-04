import glob from "fast-glob";
import { definePack } from "../define-pack";
import { extractor } from "../extractor";

export const monoIconsPack = definePack({
  name: "MonoIcons",
  prefix: "Mo",
  variants: {},
  defaultVariants: {},
  download: {
    zip: "https://github.com/mono-company/mono-icons/archive/refs/heads/master.zip",
    folder: "mono-icons-master/svg",
  },
  contents: {
    files: glob("download/MonoIcons/*.svg"),
    extract: extractor(/^.*\/(?<name>.+?)\.svg/),
  },
  projectUrl: "https://icons.mono.company/",
  license: "MIT",
  licenseUrl:
    "https://github.com/mono-company/mono-icons/blob/master/LICENSE.md",
  coloring: "keep",
  replaceColor: "#0D0D0D",
});
