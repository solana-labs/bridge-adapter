import { join, dirname } from "path";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}

/** @type { import('@storybook/nextjs').StorybookConfig } */
const config = {
  staticDirs: ["./static"],
  stories: [
    "../src/**/*.mdx",
    "../src/__stories__/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    getAbsolutePath("@storybook/addon-a11y"),
    {
      name: "@storybook/addon-coverage",
      options: { istanbul: { include: ["**/stories/**"] } },
    },
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-interactions"),
    getAbsolutePath("@storybook/addon-links"),
    {
      name: "@storybook/addon-styling",
      options: {
        postCss: {
          implementation: getAbsolutePath("postcss"),
        },
      },
    },
  ],
  framework: {
    name: getAbsolutePath("@storybook/nextjs"),
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  previewHead: (head) => `
    ${head}
    ${`
      <style type="text/css">html{ --font-sans: ui-sans-serif; }</style>
    `}
  `,
};
export default config;
