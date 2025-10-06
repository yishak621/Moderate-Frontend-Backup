import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    rules: {
      // Disable 'any' type warnings
      "@typescript-eslint/no-explicit-any": "off",

      // Disable unused vars warning
      "@typescript-eslint/no-unused-vars": "off",

      // Optional quality-of-life rules
      "react/react-in-jsx-scope": "off",
      "no-console": "off",
    },
  },
];

export default eslintConfig;
