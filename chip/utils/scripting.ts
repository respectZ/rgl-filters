import esbuild from "esbuild";
import path from "node:path/posix";
import { hashStringWithConfig } from "./hash_config";
import { loadJson } from "./json";

export type ScriptEntry = {
	filepath: string;
	replacer: (src: string) => string;
};
const cachePath = (s: string) => path.join(".chip", "scripting", s);
export async function writeExternalScript(entries: ScriptEntry[]) {
	const imports: string[] = [];
	for (const entry of entries) {
		const filename = path.basename(entry.filepath);
		let src = await Bun.file(entry.filepath).text();
		src = entry.replacer(src);
		await Bun.write(cachePath(filename), src);
		imports.push(`import "./${filename}";`);
	}

	const indexPath = cachePath("index.ts");
	await Bun.write(indexPath, imports.join("\n") + "\n");

	const bundled = await esbuild.build({
		entryPoints: [indexPath],
		bundle: true,
		write: false,
		minify: true,
		format: "esm",
		external: ["@minecraft/server", "@minecraft/server-ui"],
	});
	const text = bundled.outputFiles[0]!.text;
	const filename = hashStringWithConfig(indexPath) + ".js";
	const dest = path.join("BP", "scripts", filename);
	await Bun.write(dest, text);
	return filename;
}

export async function injectScript(filepaths: string[]) {
	const manifest = await loadJson<Manifest>("BP/manifest.json");
	const entryPoint = manifest.modules.find((module) => module.type === "script")?.entry;
	if (!entryPoint) {
		throw new Error("No script entry point found in manifest.json");
	}
	const scriptPath = path.join("BP", entryPoint);
	let scriptContent = await Bun.file(scriptPath).text();
	scriptContent =
		filepaths.map((filepath) => `import "./${filepath}";`).join("\n") + "\n" + scriptContent;
	await Bun.write(scriptPath, scriptContent);
}

type Manifest = {
	modules: Array<{
		type: "data" | "script";
		entry: string;
	}>;
};
