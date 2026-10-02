import type { Rule } from "../json/rule";
import { stores } from "../stores";
import { ConfigManager } from "../utils/config";

export const onLootTableMatch: Rule["onMatch"] = (ctx) => {
	if (
		typeof ctx.value === "string" &&
		ctx.value.startsWith("loot_tables" + ConfigManager.infix.path)
	) {
		return {
			kind: "value",
			value: stores.lootTable.get(ctx.value).relativePath,
		};
	}
};
