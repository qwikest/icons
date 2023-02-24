import glob from "fast-glob";
import { IconPackConfig } from "../src/utils/config.interface";

export const configs: IconPackConfig[] = [
  {
    name: "Lucide",
    prefix: "Lu",
    contents: [{ files: glob("node_modules/lucide-static/icons/*.svg") }],
    projectUrl: "https://lucide.dev/",
    license: "ISC",
    licenseUrl: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    coloring: "stroke",
  },
  {
    name: "Github Octicons",
    prefix: "Go",
    contents: [
      { files: glob("node_modules/@primer/octicons/build/svg/*.svg") },
    ],
    projectUrl: "https://octicons.github.com/",
    license: "MIT",
    licenseUrl: "https://github.com/primer/octicons/blob/master/LICENSE",
    coloring: "fill",
  },
  {
    name: "Ionicons",
    prefix: "Io",
    contents: [{ files: glob("node_modules/ionicons/dist/svg/*.svg") }],
    projectUrl: "https://ionicons.com/",
    license: "MIT",
    licenseUrl: "https://github.com/ionic-team/ionicons/blob/master/LICENSE",
    coloring: "fill",
  },
  {
    name: "Heroicons",
    prefix: "Hi",
    contents: [
      {
        files: glob("node_modules/heroicons/24/solid/*.svg"),
        formatter: (name) => `${name}Solid`,
      },
      {
        files: glob("node_modules/heroicons/24/outline/*.svg"),
        formatter: (name) => `${name}Outline`,
      },
      {
        files: glob("node_modules/heroicons/20/solid/*.svg"),
        formatter: (name) => `${name}Mini`,
      },
    ],
    projectUrl: "https://github.com/tailwindlabs/heroicons",
    license: "MIT",
    licenseUrl: "https://opensource.org/licenses/MIT",
    coloring: "keep",
  },
];
