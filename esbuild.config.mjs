import esbuild from "esbuild";
import process from "process";
import fs from "fs";

const prod = process.argv[2] === "production";

const context = await esbuild.context({
  entryPoints: ["src/main.ts"],
  bundle: true,
  external: [
    "obsidian",
    "electron",
    "@codemirror/autocomplete",
    "@codemirror/collab",
    "@codemirror/commands",
    "@codemirror/language",
    "@codemirror/lint",
    "@codemirror/search",
    "@codemirror/state",
    "@codemirror/view",
    "@lezer/common",
    "@lezer/highlight",
    "@lezer/lr",
  ],
  format: "cjs",
  target: "es2020",
  logLevel: "info",
  sourcemap: prod ? false : "inline",
  treeShaking: true,
  outfile: "main.js",
  jsx: "automatic",
  jsxImportSource: "preact",
});

// Copy CSS
function copyCss() {
  if (fs.existsSync("src/styles/main.css")) {
    fs.copyFileSync("src/styles/main.css", "styles.css");
  }
}

if (prod) {
  await context.rebuild();
  copyCss();
  process.exit(0);
} else {
  copyCss();
  await context.watch();
}
