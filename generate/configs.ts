import glob from "fast-glob";
import { definePack } from "./define-pack.js";

/**
 * Extracts variants from a path.
 */
export function extractor<Variants extends Record<string, string>>(
  regex: RegExp,
  defaults?: Variants
): (path: string) => Variants & { name: string } {
  return (path) => {
    const result = regex.exec(path)?.groups ?? {};

    // Remove non truthy group values
    Object.entries(result).forEach(([key, value]) => {
      if (!value) {
        delete result[key];
      }
    });

    return { ...defaults, ...result } as Variants & { name: string };
  };
}

export const configs = [
  definePack({
    name: "Lucide",
    prefix: "Lu",
    variants: {},
    defaultVariants: {},
    contents: {
      files: glob("node_modules/lucide-static/icons/*.svg"),
      extract: extractor(/^.*\/(?<name>.+?).svg/),
    },
    projectUrl: "https://lucide.dev/",
    license: "ISC",
    licenseUrl: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    coloring: "stroke",
  }),
  definePack({
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
      extract: extractor(/^.*\/(?<name>.+?).svg/),
    },
    projectUrl: "https://iconoir.com/",
    license: "MIT",
    licenseUrl: "https://github.com/iconoir-icons/iconoir/blob/main/LICENSE",
    coloring: "keep",
  }),
  definePack({
    name: "Github Octicons",
    prefix: "Go",
    variants: { res: ["12", "16", "24", "48", "96"] },
    defaultVariants: { res: "24" },
    contents: {
      files: glob("node_modules/@primer/octicons/build/svg/*.svg"),
      extract: extractor(/^.*\/(?<name>.+?)-(?<res>[0-9]+).svg/, { res: "24" }),
    },
    projectUrl: "https://octicons.github.com/",
    license: "MIT",
    licenseUrl: "https://github.com/primer/octicons/blob/master/LICENSE",
    coloring: "fill",
  }),
  definePack({
    name: "Ionicons",
    prefix: "Io",
    variants: { variant: ["solid", "sharp", "outline"] },
    defaultVariants: { variant: "solid" },
    contents: {
      files: glob("node_modules/ionicons/dist/svg/*.svg"),
      extract: extractor(/^.*\/(?<name>.+?)(-(?<variant>[a-z]+))?.svg/, {
        variant: "solid",
      }),
    },
    projectUrl: "https://ionicons.com/",
    license: "MIT",
    licenseUrl: "https://github.com/ionic-team/ionicons/blob/master/LICENSE",
    coloring: "fill",
  }),
  definePack({
    name: "Heroicons",
    prefix: "Hi",
    variants: { variant: ["solid", "outline", "mini"] },
    defaultVariants: { variant: "solid" },
    contents: {
      files: glob("node_modules/heroicons/*/*/*.svg"),
      extract: (path) => {
        const { res, style, name } = extractor(
          /heroicons\/(?<res>.[0-9]+)\/(?<style>.[a-z]+)\/(?<name>.+)?.svg/
        )(path);

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
      },
    },
    projectUrl: "https://github.com/tailwindlabs/heroicons",
    license: "MIT",
    licenseUrl: "https://opensource.org/licenses/MIT",
    coloring: "keep",
  }),
  definePack({
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
      extract: extractor(/^.*\/(?<name>.+?).svg/),
    },
    projectUrl: "https://icons.mono.company/",
    license: "MIT",
    licenseUrl:
      "https://github.com/mono-company/mono-icons/blob/master/LICENSE.md",
    coloring: "keep",
    replaceColor: "#0D0D0D",
  }),
];
