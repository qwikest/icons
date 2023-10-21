import glob from "fast-glob";
import { definePack } from "../define-pack";
import { extractor } from "../extractor";

const extractRegex = /^.*\/(?<variant>.+?)\/(?<name>.+?).svg/;

function extract(path: string) {
  const { variant, name } = extractor(extractRegex)(path);

  if (variant === "brands") {
    return { name };
  }

  return { variant, name };
}

export const fontAwesomeFreePack = definePack({
  name: "Font Awesome 6 Free",
  prefix: "Fa",
  variants: {
    variant: ["solid", "regular"],
  },
  defaultVariants: {},
  download: {
    zip: "https://github.com/FortAwesome/Font-Awesome/archive/refs/heads/6.x.zip",
    folder: "Font-Awesome-6.x/svgs",
  },
  contents: {
    files: glob("download/Font Awesome 6 Free/*/*.svg"),
    extract: extract,
  },
  projectUrl: "https://fontawesome.com/v6/icons/?o=r&m=free",
  license: "CC 4.0",
  licenseUrl:
    "https://github.com/FortAwesome/Font-Awesome/blob/6.x/LICENSE.txt",
  coloring: "fill",
});
