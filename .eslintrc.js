const path = require("path")
module.exports = {
  extends: ["next/core-web-vitals"],
  settings: {
    next: {
      rootDir: path.join(__dirname, "/"),
    },
  },
  rules: {
    // These pages-directory rules crash on App Router due to eslint-config-next version mismatch
    "@next/next/no-page-custom-font": "off",
    "@next/next/no-typos": "off",
    "@next/next/no-duplicate-head": "off",
    "@next/next/no-before-interactive-script-outside-document": "off",
    "@next/next/no-styled-jsx-in-document": "off",
    "@next/next/no-title-in-document-head": "off",
    "@next/next/no-document-import-in-page": "off",
    "@next/next/no-head-import-in-document": "off",
    "@next/next/no-head-element": "off",
  },
}
