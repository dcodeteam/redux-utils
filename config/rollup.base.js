"use strict";

const cleaner = require("rollup-plugin-cleaner");
const replace = require("rollup-plugin-replace");
const prettier = require("rollup-plugin-prettier");
const typescript = require("rollup-plugin-typescript2");

module.exports = function createRollupConfig({ target }) {
  return {
    input: "./src/index.ts",
    output: {
      sourcemap: true,
      format: target,
      file: `./${target}/index.js`,
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
      cleaner({ targets: [`./${target}/`] }),

      typescript({
        clean: true,
        useTsconfigDeclarationDir: true,
        tsconfig: `./tsconfig.${target}.json`,
      }),

      target === "es" && replace({ values: { rxjs: "rxjs/_esm5" } }),

      prettier({ parser: "babylon" }),
    ].filter(Boolean),
  };
};
