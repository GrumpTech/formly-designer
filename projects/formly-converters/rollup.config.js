import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript"; // Compiles TypeScript files
import terser from "@rollup/plugin-terser"; // Handles minification to make the bundle smaller
import dts from "rollup-plugin-dts";

export default [
  {
    input: "./index.ts",
    output: [
      {
        format: "cjs",
        file: "./../../dist/formly-converters/index.cjs",
      },
      {
        format: "es",
        file: "./../../dist/formly-converters/index.js",
      },
    ],
    external(id) {
      return !id.startsWith(".") && !id.startsWith("/");
    },
    plugins: [
      terser(),
      typescript({
        tsconfig: "./tsconfig.json",
      }),
      nodeResolve(),
    ],
  },
  {
    input: "./../../dist/formly-converters/index.d.ts",
    output: [
      { file: "./../../dist/formly-converters/index.d.ts", format: "es" },
    ],
    external: (id) => {
      return !id.startsWith(".") && !id.startsWith("/");
    },
    plugins: [dts()],
  },
];
