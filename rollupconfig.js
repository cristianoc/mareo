import resolve from "rollup-plugin-node-resolve";
export default {
  input: "src/Mareo.js",
  output: {
    file: "play/all.js",
    format: "iife",
    name: "main"
  },
  plugins: [
    resolve()
  ]
};
