import glob from "fast-glob";
import { definePack } from "../define-pack";
import { extractor } from "../extractor";

const extractRegex = /^.*\/(?<variant>.+?)\/(bxs-|bxl-|bx-)(?<name>.+?)\.svg/;
function boxIconExtract(path: string) {
  const baseExtractor = extractor(extractRegex, { variant: "regular" });
  const { name, variant } = baseExtractor(path);

  return {
    name,
    variant: variant === "solid" ? "solid" : "outline",
  };
}

export const boxIconsPack = definePack({
  name: "BoxIcons",
  prefix: "Bx",
  variants: {
    variant: ["outline", "solid"],
  },
  defaultVariants: {
    variant: "outline",
  },
  download: {
    zip: "https://github.com/atisawd/boxicons/archive/refs/heads/master.zip",
    folder: "boxicons-master/svg",
  },
  contents: {
    files: glob("download/BoxIcons/*/*.svg"),
    extract: boxIconExtract,
  },
  projectUrl: "https://boxicons.com/",
  license: "MIT",
  licenseUrl: "https://github.com/atisawd/boxicons/blob/master/LICENSE",
  coloring: "keep",
  replaceColor: "#0D0D0D",
});
