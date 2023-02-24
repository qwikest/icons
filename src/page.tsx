import { component$, useSignal, useStore } from "@builder.io/qwik";
import * as IconObject from "./generated";
import { configs } from "./generated/configs";
import "./page.css";

const Icons = Object.entries(IconObject).map(([key, icon]) => ({ key, icon }));

export const Page = component$(() => {
  const color = useSignal("#212121");
  const size = useSignal("20");
  const selectedConfig = useStore({ config: configs[2] });
  const icons = Icons.filter(({ key }) =>
    key.startsWith(selectedConfig.config.prefix)
  );

  return (
    <div class="page">
      <div>
        {configs.map((config) => (
          <button
            onClick$={() => (selectedConfig.config = config)}
            key={config.name}
          >
            {config.name}
          </button>
        ))}
        <label>
          <span>Color</span>
          <input
            type="color"
            value={color.value}
            onInput$={(_, { value }) => (color.value = value)}
          />
        </label>
        <label>
          <span>Size</span>
          <input
            type="range"
            min={4}
            max={48}
            value={size.value}
            onInput$={(_, { value }) => (size.value = value)}
          />
        </label>
      </div>
      <div class="icon-container">
        {icons.map((wrapped, i) => (
          <div class="icon-card">
            <span>{wrapped.key}</span>
            <wrapped.icon
              style={{ color: color.value, fontSize: size.value + "px" }}
              key={i}
            ></wrapped.icon>
          </div>
        ))}
      </div>
    </div>
  );
});
