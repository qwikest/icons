export type AnyIconVariants = Record<string, string>;

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
  contents: {
    files: Promise<string[]>;
    extract: (path: string) => Variants & { name: string } & {};
  };
  projectUrl: string;
  license: string;
  licenseUrl: string;
  coloring: "fill" | "stroke" | "keep";
}
