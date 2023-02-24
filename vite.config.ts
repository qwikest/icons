import { qwikVite } from "@builder.io/qwik/optimizer";
import { defineConfig } from "vite";
import { configs } from "./generate/configs";

export default defineConfig(() => {
  return {
    build: {
      target: "es2020",
      lib: {
        entry: [
          ...configs
            .map((config) => config.prefix.toLowerCase())
            .map((prefix) => `./src/generated/${prefix}/${prefix}.ts`),
          "./src/generated/index.ts",
        ],
        formats: ["es", "cjs"],
        fileName: (format, entry) =>
          `${entry}.${format === "es" ? "mjs" : "cjs"}`,
      },
    },
    plugins: [qwikVite()],
  };
});
