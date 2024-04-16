const esbuild = require("esbuild");
const z = require("zod");

const { entryPoint, outfile, minify } = z
  .object({
    entryPoint: z.string().default("./data/scripts/main.ts"),
    outfile: z.string().default("./BP/scripts/main.js"),
    minify: z.boolean().default(true),
  })
  .parse(JSON.parse(process.argv[2] ?? "{}"));

(async () => {
  try {
    await esbuild.build({
      bundle: true,
      entryPoints: [entryPoint],
      external: [
        "@minecraft/server",
        "@minecraft/server-ui",
        "@minecraft/server-gametest",
      ],
      format: "esm",
      outfile,
      minify,
    });
  } catch (e) {
    console.log(e.message);
  } finally {
    esbuild.stop();
  }
})();
