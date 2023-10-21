import glob from "fast-glob";
import { definePack } from "../define-pack";
import { extractor } from "../extractor";

export const materialIconsPack = definePack({
  name: "MaterialIcons",
  prefix: "Mat",
  variants: {
    variant: ["sharp", "round", "outlined", "filled"],
  },
  defaultVariants: {},
  download: {
    // Unofficial URL, because the official repository is too big
    zip: "https://github.com/marella/material-design-icons/archive/refs/heads/main.zip",
    folder: "material-design-icons-main/svg",
  },
  contents: {
    files: glob("download/MaterialIcons/(filled|outlined|round|sharp)/*.svg"),
    extract: extractor(/^.*\/(?<variant>.+?)\/(?<name>.+?).svg/),
  },
  projectUrl: "https://github.com/google/material-design-icons",
  license: "Apache 2.0",
  licenseUrl:
    "https://github.com/google/material-design-icons/blob/master/LICENSE",
  coloring: "fill",
});
