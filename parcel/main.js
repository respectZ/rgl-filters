import { Parcel } from "@parcel/core";
import fs from "fs/promises";
import path from "path/posix";

const config = JSON.parse(process.argv[2] ?? "{}");

async function parcel() {
  try {
    const entryPoint = config.entryPoint ?? "./data/scripts/main.ts";
    const outfile = config.outfile ?? `./BP/scripts/main.js`;
    const outDir = path.dirname(outfile);

    const { bundleGraph } = await new Parcel({
      entries: [entryPoint],
      config: "./.parcelrc",
      mode: "production",
      defaultTargetOptions: {
        distDir: outDir,
        outputFormat: "esmodule",
        shouldOptimize: config.minify ?? true,
        sourceMaps: false,
      },
    }).run();
    for (const bundle of bundleGraph.getBundles()) {
      const filepath = bundle.filePath.replace(/\\/g, "/");
      const newFilepath = path.join(outDir, path.basename(outfile));
      await fs.mkdir(outDir, { recursive: true });
      await fs.rename(filepath, newFilepath);
    }
  } catch (e) {
    console.error(e);
    console.log(
      "If you're using Bun runtime, change your runtime to Node.js instead."
    );
  }
}

await parcel();
