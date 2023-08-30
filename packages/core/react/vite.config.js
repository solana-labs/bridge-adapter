import { defineConfig } from "vite";

export default defineConfig({
  test: {
    useAtomics: true,
    // reporters: ["tap"]
    globals: false,
  },
});
