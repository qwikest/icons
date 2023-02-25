import { component$ } from "@builder.io/qwik";
import * as IconObject from "./generated";
import { configs } from "./generated/configs";

const Icons = Object.entries(IconObject).map(([key, icon]) => ({ key, icon }));

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
      ({ icon, key }) =>
        typeof icon === "function" && key.startsWith(config.prefix)
    );

    return (
      <>
        <div class="icon-container">
          {icons.map((wrapped, i) => (
            <div class="icon-card">
              <span>{wrapped.key}</span>
              <wrapped.icon
                style={{ color, fontSize: size + "px" }}
                key={i}
              ></wrapped.icon>
            </div>
          ))}
        </div>
      </>
    );
  }
);
