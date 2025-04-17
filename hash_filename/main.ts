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
  "./RP/models/blocks/**/*.json",
  "./RP/models/entity/**/*.json",
  "./RP/particles/**/*.json",
  "./RP/render_controllers/**/*.json",
];

const dirs: Set<string> = new Set();

const promises = globs.map(async (glob) => {
  const files = await fg.glob(glob);

  for (const file of files) {
    const parsed = path.parse(file);

    const trimSize = glob.includes("RP/models/") ? 4 : 3;
    const dir = parsed.dir.split("/");
    const root = dir.slice(0, trimSize).join("/");
    if (dir.length > trimSize) {
      const subdir = dir.slice(trimSize)[0];
      if (subdir) {
        dirs.add(path.join(root, subdir));
      }
    }
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
