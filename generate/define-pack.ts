import { AnyIconVariants, IconPackConfig } from "./config.interface";

export function definePack<Variants extends AnyIconVariants>(
  pack: IconPackConfig<Variants>
) {
  return pack;
}
