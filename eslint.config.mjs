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
    rules: {
      // Wyłączenie reguły prefer-const, jeśli przeszkadza:
      "prefer-const": "off",
      // Dodanie reguły, która zapobiega przypisywaniu do const:
      "no-const-assign": "error",
      // Inne reguły możesz tu dostosować:
      // np. "no-var": "error", jeśli chcesz wymusić używanie let/const zamiast var
    },
  },
];

export default eslintConfig;
