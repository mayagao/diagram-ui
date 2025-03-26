module.exports = {
  extends: ["next/core-web-vitals"],
  rules: {
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsPattern: "^_",
        destructuredArrayIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/no-explicit-any": "warn",
  },
  ignorePatterns: [
    ".next/",
    "out/",
    "build/",
    "dist/",
    "node_modules/",
    ".vercel",
  ],
  parserOptions: {
    project: "./tsconfig.eslint.json",
  },
};
