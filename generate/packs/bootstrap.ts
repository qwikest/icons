import glob from "fast-glob";
import { definePack } from "../define-pack";
import { extractor } from "../extractor";

const extractRegex = /^.*\/(?<name>.+?)(-(?<variant>fill))?.svg/;
function bootstrapExtract(path: string) {
  const baseExtractor = extractor(extractRegex, { variant: "outline" });
  const { name, variant } = baseExtractor(path);

  return {
    name,
    variant: variant === "fill" ? "solid" : "outline",
  };
}

export const bootstrapPack = definePack({
  name: "Bootstrap",
  prefix: "Bs",
  variants: {
    variant: ["solid", "outline"],
  },
  defaultVariants: { variant: "outline" },
  contents: {
    files: glob("node_modules/bootstrap-icons/icons/*.svg"),
    extract: bootstrapExtract,
  },
  projectUrl: "https://icons.getbootstrap.com/",
  license: "MIT",
  licenseUrl: "https://github.com/twbs/icons/blob/main/LICENSE.md",
  coloring: "keep",
});
