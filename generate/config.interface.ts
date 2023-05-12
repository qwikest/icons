export type AnyIconVariants = { variant?: string };

export interface IconPackDownload {
  zip: string;
  folder: string;
}

export interface IconPackConfig<
  Variants extends AnyIconVariants = AnyIconVariants
> {
  name: string;
  prefix: string;
  variants: {
    [K in keyof Omit<Variants, "name">]: Omit<Variants, "name">[K][];
  };
  defaultVariants: {
    [K in keyof Omit<Variants & {}, "name">]: string;
  };
  download?: IconPackDownload;
  contents: {
    files: Promise<string[]>;
    extract: (path: string) => Variants & { name: string } & {};
  };
  projectUrl: string;
  license: string;
  licenseUrl: string;
  coloring: "fill" | "stroke" | "keep";
  replaceColor?: string;
}
