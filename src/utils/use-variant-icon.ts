import { Component, ContextId } from "@builder.io/qwik";
import { IconProps } from "../types/icon-props";
import { useVariantProps } from "./use-variant-props";

interface Variant {
  component: Component<IconProps>;
  variants: Record<string, string>;
}

export function useVariantIcon<Props extends {}>(
  variants: Variant[],
  inputProps: Props,
  contextId: ContextId<Props>,
  defaultProps: Props
) {
  const props = useVariantProps(inputProps, contextId, defaultProps);
  const icon = variants.find((variant) =>
    Object.entries(props).every(
      ([key, value]) => value === variant.variants[key]
    )
  );

  return icon ?? variants[0];
}
