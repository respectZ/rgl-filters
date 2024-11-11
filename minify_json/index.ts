import fg from "npm:fast-glob@3.2.0";
import { parse, stringify } from "npm:lossless-json@4.0.2";

const commentRegex = /(\/\*.*\*\/)|(\/\/[^\n]*)/gs;

async function loadJson(filepath: string) {
  const content = await Deno.readTextFile(filepath);
  const data = content.replaceAll(commentRegex, (match) => {
    return " ".repeat(match.length);
  });
  const json = parse(data);
  return json;
}

const dirs = ["./BP/**/*.json", "./RP/**/*.json"];
const entries = await fg(dirs);
await Promise.all(
  entries.map(async (entry) => {
    const json = await loadJson(entry);
    const minified = stringify(json);
    if (!minified) {
      throw new Error(`Failed to minify ${entry}`);
    }
    await Deno.writeTextFile(entry, minified);
  })
);
