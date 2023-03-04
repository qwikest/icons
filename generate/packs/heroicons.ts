import glob from "fast-glob";
import { definePack } from "../define-pack";
import { extractor } from "../extractor";

const extractRegex =
  /heroicons\/(?<res>.[0-9]+)\/(?<style>.[a-z]+)\/(?<name>.+)?\.svg/;

function heroiconsExtract(path: string) {
  const { res, style, name } = extractor(extractRegex)(path);

  if (res === "20") {
    return { variant: "mini", name };
  }

  if (style === "solid") {
    return { variant: style, name };
  }

  if (style === "outline") {
    return { variant: style, name };
  }

  console.log(res, style, path);

  throw new Error("");
}

export const heroiconsPack = definePack({
  name: "Heroicons",
  prefix: "Hi",
  variants: { variant: ["solid", "outline", "mini"] },
  defaultVariants: { variant: "solid" },
  contents: {
    files: glob("node_modules/heroicons/*/*/*.svg"),
    extract: heroiconsExtract,
  },
  projectUrl: "https://github.com/tailwindlabs/heroicons",
  license: "MIT",
  licenseUrl: "https://opensource.org/licenses/MIT",
  coloring: "keep",
});
