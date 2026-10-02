import fs from "node:fs/promises";
import { entries } from "./entries";
import { JsonWalker } from "./json/walker";
import { DirectoryCleanup } from "./utils/cleanup";
import { ConfigManager } from "./utils/config";
import { loadJson, saveJson } from "./utils/json";
import { normalizePath } from "./utils/path";
import { writeScripts } from "./utils/script_entries";

export async function processEntries(): Promise<number> {
	const walker = new JsonWalker();
	const cleanup = new DirectoryCleanup();
	let processed = 0;
	for (const entry of entries) {
		if (entry.category && !ConfigManager.isCategoryEnabled(entry.category)) {
			continue;
		}
		if (!entry.store && !entry.rule?.hasEnabledRules) {
			continue;
		}
		for await (let filepath of new Bun.Glob(entry.pattern).scan({
			followSymlinks: true,
		})) {
			filepath = normalizePath(filepath);
			if (ConfigManager.isBlacklisted({ filepath })) {
				continue;
			}
			if (entry.matcher && !entry.matcher(filepath)) {
				continue;
			}
			let dest = filepath;
			if (entry.store) {
				const result = entry.store.hash(filepath, ConfigManager.infix.path);
				dest = result.filepath;
			}
			if (entry.rule) {
				const json = await loadJson(filepath, true);
				walker.walk(
					json,
					(ctx) => {
						if (
							!ConfigManager.isBlacklisted({
								filepath,
								jsonSegments: ctx.segments,
							})
						) {
							entry.rule!.process(ctx);
						}
					},
					filepath,
				);
				entry.rule.applyOperations();
				await saveJson(dest, json, true);
				if (entry.store) {
					await fs.unlink(filepath);
				}
			} else if (entry.store) {
				await entry.store.move(filepath, ConfigManager.infix.path);
			}
			if (entry.store) {
				cleanup.add(filepath, dest);
			}
			processed++;
		}
	}
	await cleanup.run();
	return processed;
}

if (import.meta.main) {
	const processed = await processEntries();
	await writeScripts();
	console.log(`Processed ${processed} files.`);
}
