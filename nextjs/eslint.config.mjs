import nextPlugin from "eslint-config-next";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  ...nextPlugin(),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
];
