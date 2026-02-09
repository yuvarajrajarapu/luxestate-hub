export default [
  {
    ignores: ["dist", "node_modules"],
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-require-imports": "off",
      "no-case-declarations": "off",
      "prefer-const": "off",
      "react-hooks/exhaustive-deps": "off",
    },
  },
];
