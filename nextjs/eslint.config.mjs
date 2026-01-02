import nextConfig from "eslint-config-next";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  ...nextConfig,
  {
    rules: {
      "import/no-anonymous-default-export": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
];
