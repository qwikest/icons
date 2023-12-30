import glob from "fast-glob";
import { definePack } from "../define-pack";
import { extractor } from "../extractor";

export const iconsaxIconsPack = definePack({
  name: "IconSaxIcons",
  prefix: "Is",
  variants: {
    variant: ["bold", "broken", "bulk", "linear", "outline", "twotone"],
  },
  defaultVariants: {},
  download: {
    zip: "https://iconsax.io/Iconsax/Svg.zip",
    folder: "Svg/All",
  },
  contents: {
    files: glob("download/IconSaxIcons/(bold|broken|bulk|linear|outline|twotone)/*.svg"),
    extract: extractor(/^.*\/(?<variant>.+?)\/(?<name>.+?).svg/),
  },
  projectUrl: "https://github.com/lusaxweb/iconsax",
  license: "MIT",
  licenseUrl: "https://github.com/lusaxweb/vuesax/blob/master/LICENSE",
  coloring: "keep",
});