import path from "node:path/posix";
import { Category } from "../categories";
import { ConfigManager } from "./config";
import { normalizePath } from "./path";
import { injectScript, type ScriptEntry, writeExternalScript } from "./scripting";

export function getScriptEntries(): ScriptEntry[] {
	const replacer = (src: string): string =>
		src
			.replace("{infix}", ConfigManager.infix.path)
			.replace("{animationPrefix}", ConfigManager.prefix.animation)
			.replace("778899", ConfigManager.seed.toString())
			.replace("../utils/hash", "./hash");
	return [
		{ category: Category.Textures, filename: "texture.ts" },
		{ category: Category.LootTables, filename: "loot_table.ts" },
		{ category: Category.ClientAnimations, filename: "play_animation.ts" },
	]
		.filter((entry) => ConfigManager.isCategoryEnabled(entry.category))
		.map((entry) => ({
			filepath: path.join(normalizePath(import.meta.dirname), "..", "scripts", entry.filename),
			replacer,
		}));
}

export async function writeScripts(): Promise<void> {
	const scripts = getScriptEntries();
	if (scripts.length === 0) {
		return;
	}
	await Bun.write(
		".chip/scripting/hash.ts",
		Bun.file(path.join(normalizePath(import.meta.dirname), "hash.ts")),
	);
	const filename = await writeExternalScript(scripts);
	await injectScript([filename]);
}
