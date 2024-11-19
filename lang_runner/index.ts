import { walk } from "https://deno.land/std@0.182.0/fs/mod.ts";
import { Lang } from "./lang.ts";

const directory = "RP/texts/";
const langFiles = walk(directory, { exts: ["lang"] });

const handlers = Object.freeze({
  fixComment: (text: string) =>
    text.replace(/( )+(###)/g, (_match, _p1, p2) => "\t" + p2),
  insertComment: (text: string) => {
    const hasComment = text.includes("###");
    if (hasComment) return text;

    let index = 0;
    const comment = text
      .replace(/§[a-z0-9]/gi, "")
      .replace(/%s/g, () => `{${index++}}`);

    // Check if the text contains color code and not ends with §r
    if (text.includes("§") && !text.endsWith("§r")) {
      text += "§r";
    }
    return text + `\t### ${comment}`;
  },
  [Symbol.iterator]: () => {
    return Object.entries(handlers)[Symbol.iterator]();
  },
}) satisfies Record<string, Handler>;

// Parse args
function parseArgs(args: string[]): Settings {
  try {
    return JSON.parse(args[0]);
  } catch {
    return {
      fixComment: true,
      insertComment: true,
    };
  }
}
const args = parseArgs(Deno.args);

for await (const entry of langFiles) {
  const lang = Lang.parse(await Deno.readTextFile(entry.path));
  for (let [k, v] of lang) {
    if (!v || v?.trim() === "") continue;

    for (const [k, handler] of handlers) {
      if (!args[k as keyof Settings]) continue;
      v = handler(v);
    }

    lang.set(k, v);
  }
  const text = lang.stringify();
  await Deno.writeTextFile(entry.path, text);
}

type Handler = (text: string) => string;
type Settings = Partial<
  Omit<Record<keyof typeof handlers, boolean>, typeof Symbol.iterator>
>;
