module.exports = {
  root: true,
  extends: [
    "bridge-adapter-sdk",
    "plugin:@tanstack/eslint-plugin-query/recommended",
  ],
  rules: { "@next/next/no-img-element": "off" },
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
};
