import glob from "fast-glob";
import { definePack } from "../define-pack";
import { extractor } from "../extractor";

export const ioniconsPack = definePack({
  name: "Ionicons",
  prefix: "Io",
  variants: { variant: ["solid", "sharp", "outline"] },
  defaultVariants: { variant: "solid" },
  contents: {
    files: glob("node_modules/ionicons/dist/svg/*.svg"),
    extract: extractor(/^.*\/(?<name>.+?)(-(?<variant>[a-z]+))?\.svg/, {
      variant: "solid",
    }),
  },
  projectUrl: "https://ionicons.com/",
  license: "MIT",
  licenseUrl: "https://github.com/ionic-team/ionicons/blob/master/LICENSE",
  coloring: "fill",
});
