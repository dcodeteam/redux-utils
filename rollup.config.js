"use strict";

const babel = require("rollup-plugin-babel");
const nodeResolve = require("rollup-plugin-node-resolve");

const pkg = require("./package");

module.exports = [
  createConfig("es"),
  createConfig("cjs"),
  createConfig("es2015"),
];

function createConfig(target) {
  const externals = [
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.peerDependencies),
  ];

  return {
    input: "./src/index.ts",

    output: {
      file: `./redux-utils.${target}.js`,
      format: target === "cjs" ? "cjs" : "es",
    },

    external: id =>
      externals.includes(id) ||
      id.startsWith("rxjs") ||
      id.startsWith("@babel/runtime"),

    plugins: [
      nodeResolve({ extensions: [".ts"] }),

      babel({
        babelrc: false,
        runtimeHelpers: true,
        extensions: [".ts"],
        presets: [
          [
            "@babel/preset-env",
            {
              modules: false,
              forceAllTransforms: target !== "es2015",
              targets: { esmodules: target === "es2015" },
            },
          ],
          "@babel/preset-typescript",
        ],
        plugins: [
          [
            "@babel/plugin-transform-runtime",
            { useESModules: target !== "cjs" },
          ],

          target === "es" && [
            "module-resolver",
            {
              alias: {
                rxjs: "rxjs/_esm5",
                "rxjs/operators": "rxjs/_esm5/operators",
              },
            },
          ],

          target === "es2015" && [
            "module-resolver",
            {
              alias: {
                rxjs: "rxjs/_esm2015",
                "rxjs/operators": "rxjs/_esm2015/operators",
              },
            },
          ],
        ].filter(Boolean),
      }),
    ],
  };
}
