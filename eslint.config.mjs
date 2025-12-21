// eslint.config.mjs
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: new URL('.', import.meta.url).pathname,
});

export default [
  // Node / TypeScript
  ...compat.extends([
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
  ]),

  // Parser options
  {
    files: ["*.ts", "*.mts", "*.cts"],
    languageOptions: {
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        project: "./tsconfig.json",
      },
    },
    rules: {
      // TypeScript rules
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "off",

      // Import rules
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
        },
      ],

      // Node / best practices
      "no-console": "warn",
      "prefer-const": "warn",
    },
  },

  // Jest / test files
  {
    files: ["*.spec.ts", "*.test.ts"],
    rules: {
      "@typescript-eslint/no-empty-function": "off",
    },
  },
];
