import { component$, useSignal, useStore } from "@builder.io/qwik";
import { IconGrid } from "./icon-grid";
import "./page.css";

import { configs } from "./page/configs";

export const Page = component$(() => {
  const color = useSignal("#212121");
  const size = useSignal("20");
  const selectedConfig = useStore({ config: configs[2] });

  return (
    <div class="page">
      <div class="controls">
        <div class="control-section">
          {configs.map((config) => (
            <button
              onClick$={() => (selectedConfig.config = config)}
              key={config.name}
            >
              {config.name}
            </button>
          ))}
        </div>
        <div class="control-section">
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
      </div>
      <IconGrid
        config={selectedConfig.config}
        color={color.value}
        size={parseFloat(size.value)}
      />
    </div>
  );
});
