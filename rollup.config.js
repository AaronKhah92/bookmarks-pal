import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";

export default {
  input: "index.js",
  output: {
    file: "bundle.js",
    format: "iife",
  },
  plugins: [resolve(), commonjs()],
};
