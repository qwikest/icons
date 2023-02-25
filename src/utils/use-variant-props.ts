import { ContextId, useContext } from "@builder.io/qwik";

export function useVariantProps<Props extends {}>(
  inputProps: Props,
  contextId: ContextId<Props>,
  defaultProps: Props
) {
  const inputPropsExpanded = { ...inputProps };
  Object.entries(inputProps).forEach(([key, value]) => {
    if (!value) {
      delete inputPropsExpanded[key as keyof Props];
    }
  });

  const contextProps = useContext(contextId, defaultProps);
  return { ...contextProps, ...inputPropsExpanded };
}
