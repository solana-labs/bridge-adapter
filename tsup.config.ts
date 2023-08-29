import { defineConfig } from "tsup";

export default defineConfig((options) => {
  return {
    sourcemap: true,
    dts: true,
    splitting: true,
    clean: !options.watch,
    format: options.env?.ESM_ONLY ? ["esm"] : ["cjs", "esm"],
    minify: !options.watch,
    // Internal packages not meant for client consumption should be here
    noExternal: [],
  };
});
