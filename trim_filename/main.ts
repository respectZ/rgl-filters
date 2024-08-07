import fg from "npm:fast-glob";
import path from "node:path";

function* generateAlphabet() {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
  const base = chars.length;

  let length = 1;
  while (true) {
    for (let i = 0; i < Math.pow(26, length); i++) {
      let s = "";
      let n = i;

      for (let j = 0; j < length; j++) {
        s = chars[n % base] + s;
        n = Math.floor(n / base);
      }

      yield s;
    }
    length++;
  }
}

const globs = [
  "./BP/animations/**/*.json",
  "./BP/animation_controllers/**/*.json",
  "./BP/blocks/**/*.json",
  "./BP/entities/**/*.json",
  "./BP/items/**/*.json",
  "./BP/recipes/**/*.json",

  "./RP/animations/**/*.json",
  "./RP/animation_controllers/**/*.json",
  "./RP/attachables/**/*.json",
  "./RP/entity/**/*.json",
  "./RP/models/entity/**/*.json",
  "./RP/particles/**/*.json",
  "./RP/render_controllers/**/*.json",
];

const set: Set<string> = new Set();
const dirs: Set<string> = new Set();

const promises = globs.map(async (glob) => {
  const files = await fg.glob(glob);

  for (const file of files) {
    const parsed = path.parse(file);

    const trimSize = glob.includes("RP/models/entity/") ? 5 : 4;
    const root = parsed.dir
      .split("/")
      .slice(0, trimSize - 1)
      .join("/");
    dirs.add(parsed.dir.split("/").slice(0, trimSize).join("/"));
    for (const alphabet of generateAlphabet()) {
      const filepath = path.join(root, `${alphabet}.json`);
      if (!set.has(filepath)) {
        set.add(filepath);
        await Deno.copyFile(file, filepath);
        await Deno.remove(file);
        break;
      }
    }
  }
});

await Promise.all(promises);

await Promise.all(
  Array.from(dirs).map(async (dir) => {
    await Deno.remove(dir, { recursive: true });
  })
);
