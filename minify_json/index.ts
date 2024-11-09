import fg from "npm:fast-glob@3.2.0";
import jsonc from "npm:jsonc-parser@3.0.0";

const dirs = ["./BP/**/*.json", "./RP/**/*.json"];
const entries = await fg(dirs);
await Promise.all(
  entries.map(async (entry) => {
    const content = await Deno.readTextFile(entry);
    const json = jsonc.parse(content);
    const minified = JSON.stringify(json);
    await Deno.writeTextFile(entry, minified);
  })
);
