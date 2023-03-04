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
