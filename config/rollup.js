"use strict";

const replace = require("rollup-plugin-replace");
const prettier = require("rollup-plugin-prettier");
const typescript = require("rollup-plugin-typescript2");

module.exports = {
  input: "./src/index.ts",
  output: {
    format: "es",
    sourcemap: true,
    file: "./es/index.js",
  },
  external(id) {
    switch (id) {
      case "tslib":
      case "immupdate":
        return true;
      default:
        return id.startsWith("rxjs");
    }
  },
  plugins: [
    typescript({ clean: true, tsconfig: "./tsconfig.es.json" }),
    replace({ values: { rxjs: "rxjs/_esm5" } }),
    prettier({ parser: "babylon" }),
  ],
};
