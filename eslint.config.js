import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import react from "eslint-plugin-react";
import jsdoc from "eslint-plugin-jsdoc";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";
import path from "node:path";

export default tseslint.config([
  globalIgnores(["dist"]),

  // Configuration for source files with type checking
  {
    files: ["src/**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],

    plugins: {
      react,
      jsdoc,
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,

      parserOptions: {
        tsconfigRootDir: path.resolve(),
        project: ["./tsconfig.app.json"],
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    rules: {
      // React rules
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off", // TypeScript handles this

      // JSDoc enforcement rules
      "jsdoc/require-jsdoc": [
        "error",
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: true,
            FunctionExpression: true,
          },
          contexts: [
            "TSInterfaceDeclaration",
            "TSTypeAliasDeclaration",
            "VariableDeclaration > VariableDeclarator > ArrowFunctionExpression",
          ],
        },
      ],

      // Require description in JSDoc
      "jsdoc/require-description": [
        "error",
        {
          contexts: [
            "FunctionDeclaration",
            "FunctionExpression",
            "ArrowFunctionExpression",
            "MethodDefinition",
            "TSInterfaceDeclaration",
            "TSTypeAliasDeclaration",
          ],
        },
      ],

      // Require @param for all parameters
      "jsdoc/require-param": "error",

      // Require @returns for functions that return values
      "jsdoc/require-returns": [
        "error",
        {
          forceReturnsWithAsync: false,
        },
      ],

      // Ensure param descriptions
      "jsdoc/require-param-description": "error",

      // Ensure return descriptions
      "jsdoc/require-returns-description": "error",

      // Check param names match function signature
      "jsdoc/check-param-names": "error",

      // Validate JSDoc types (relaxed for TypeScript)
      "jsdoc/check-types": "off", // TypeScript handles this

      // Enforce consistent JSDoc style
      "jsdoc/check-alignment": "error",

      // Require type in param tags
      "jsdoc/require-param-type": "off", // TypeScript handles this

      // Require type in returns tags
      "jsdoc/require-returns-type": "off", // TypeScript handles this

      // Check tag names are valid
      "jsdoc/check-tag-names": "error",

      // Ensure JSDoc comments are not empty
      "jsdoc/no-blank-blocks": "error",

      // Prefer specific tags
      "jsdoc/require-hyphen-before-param-description": ["error", "never"],
    },
  },
]);
