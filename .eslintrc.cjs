/* eslint-env node */
module.exports = {
  root: true,
  extends: ["next/core-web-vitals"],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  rules: {
    // Ajustements doux ; on peut durcir plus tard
    "@next/next/no-img-element": "off",
  },
};
