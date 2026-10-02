import { LootTableManager } from "@minecraft/server";
import { hashString } from "../utils/hash";

// Placeholders.
const infix = "{infix}";
const seed = 778899;

const getLootTable = LootTableManager.prototype.getLootTable;
LootTableManager.prototype.getLootTable = function (path: string) {
	const prefix = infix.slice(1);
	if (path.startsWith(prefix)) {
		path = prefix + hashString("loot_tables/" + path + ".json", seed);
	}
	return getLootTable.call(this, path);
};
