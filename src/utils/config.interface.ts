export interface IconPackContents {
  files: Promise<string[]>;
  formatter?: (name: string) => string;
}

export interface IconPackConfig {
  name: string;
  prefix: string;
  contents: IconPackContents[];
  projectUrl: string;
  license: string;
  licenseUrl: string;
  coloring: "fill" | "stroke" | "keep";
}
