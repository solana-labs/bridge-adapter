/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "turbo",
    "prettier",
    "next",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        prefer: "type-imports",
        fixStyle: "separate-type-imports",
      },
    ],
    "@typescript-eslint/consistent-type-exports": "error",
  },
  parser: "@typescript-eslint/parser",
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};
