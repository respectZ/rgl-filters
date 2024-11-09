import fg from "npm:fast-glob";
import path from "node:path";

function simpleHash(s: string) {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i);
    hash |= 0;
  }
  return hash;
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
    const filepath = path.join(root, `${simpleHash(file)}.json`);
    await Deno.copyFile(file, filepath);
    await Deno.remove(file);
  }
});

await Promise.all(promises);

await Promise.all(
  Array.from(dirs).map(async (dir) => {
    await Deno.remove(dir, { recursive: true });
  })
);
