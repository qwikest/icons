import { Component, component$ } from "@builder.io/qwik";
import * as IconObject from "./page/all";
import { configs } from "./page/configs";
import { IconProps } from "./utils/icon-props";

const Icons = Object.entries(IconObject).map(([key, component]) => ({
  key,
  component,
}));

export const IconGrid = component$(
  ({
    config,
    color,
    size,
  }: {
    config: (typeof configs)[0];
    color: string;
    size: number;
  }) => {
    const icons = Icons.filter(
      (icon): icon is { key: string; component: Component<IconProps> } =>
        typeof icon.component === "function" &&
        icon.key.startsWith(config.prefix)
    );

    return (
      <>
        <div class="icon-container">
          {icons.map((wrapped, i) => (
            <div class="icon-card">
              <span>{wrapped.key}</span>
              <wrapped.component
                style={{ color, fontSize: size + "px" }}
                key={i}
              ></wrapped.component>
            </div>
          ))}
        </div>
      </>
    );
  }
);
