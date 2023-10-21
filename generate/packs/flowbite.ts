import glob from "fast-glob";
import { definePack } from "../define-pack";
import { extractor } from "../extractor";

export const flowbiteIconsPack = definePack({
  name: "Flowbite",
  prefix: "Fl",
  variants: {
    variant: ["solid", "outline"],
  },
  defaultVariants: {},
  download: {
    zip: "https://github.com/themesberg/flowbite-icons/archive/refs/heads/main.zip",
    folder: "flowbite-icons-main/src",
  },
  contents: {
    files: glob("download/Flowbite/(solid|outline)/*/*.svg"),
    extract: extractor(/^.*\/(?<variant>.+?)\/.*?\/(?<name>.+?).svg/),
  },
  projectUrl: "https://github.com/themesberg/flowbite-icons/",
  license: "MIT",
  licenseUrl: "https://github.com/themesberg/flowbite-icons/blob/main/LICENSE",
  coloring: "keep",
  replaceColor: "#2F2F38",
});
