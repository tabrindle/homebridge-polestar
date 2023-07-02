import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";

const extensions = [".ts", ".js"];

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "cjs",
  },
  plugins: [
    resolve({
      jsnext: true,
      extensions,
    }),
    commonjs(),
    babel({
      extensions,
      exclude: "node_modules/**", // only transpile our source code
      babelHelpers: "bundled",
    }),
    json(),
  ],
};
