import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist/", "node_modules/"] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    // clean() implements RFC 4518, so it matches control characters and
    // combining marks inside character classes on purpose.
    files: ["src/core/commutator.ts"],
    rules: {
      "no-control-regex": "off",
      "no-misleading-character-class": "off",
    },
  },
);
