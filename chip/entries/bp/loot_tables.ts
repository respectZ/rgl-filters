import { Category } from "../../categories";
import { RuleEngine } from "../../json/rule";
import { createSegment } from "../../json/walker";
import { stores } from "../../stores";
import { ConfigManager } from "../../utils/config";
import { onLootTableMatch } from "../on_loot_table_match";
import type { Entry } from "../types";

export const lootTables: Entry = {
	category: Category.LootTables,
	pattern: "BP/loot_tables" + ConfigManager.infix.path + "**/*.json",
	store: stores.lootTable,
};

const lootReferencesRule = new RuleEngine([
	{
		category: Category.LootTables,
		kind: "value",
		pattern: createSegment("**/entries/[#]/name"),
		onMatch: (ctx) => {
			if (
				ctx.parent &&
				typeof ctx.parent === "object" &&
				"type" in ctx.parent &&
				ctx.parent.type === "loot_table"
			) {
				return onLootTableMatch(ctx);
			}
		},
	},
	{
		category: Category.LootTables,
		kind: "value",
		pattern: createSegment("**/functions/[#]/loot_table"),
		onMatch: (ctx) => {
			if (
				ctx.parent &&
				typeof ctx.parent === "object" &&
				"function" in ctx.parent &&
				(ctx.parent.function === "fill_container" ||
					ctx.parent.function === "minecraft:fill_container")
			) {
				return onLootTableMatch(ctx);
			}
		},
	},
]);

export const lootTableReferences: Entry = {
	category: Category.LootTables,
	pattern: "BP/loot_tables/**/*.json",
	rule: lootReferencesRule,
};

export const tradeLootReferences: Entry = {
	category: Category.LootTables,
	pattern: "BP/trading/**/*.json",
	rule: lootReferencesRule,
};

export const processorLootReferences: Entry = {
	category: Category.LootTables,
	pattern: "BP/worldgen/processors/**/*.json",
	rule: new RuleEngine([
		{
			category: Category.LootTables,
			kind: "value",
			pattern: createSegment(
				"minecraft:processor_list/processors/[#]/**/rules/[#]/block_entity_modifier/loot_table",
			),
			onMatch: (ctx) => {
				if (
					ctx.parent &&
					typeof ctx.parent === "object" &&
					"type" in ctx.parent &&
					ctx.parent.type === "minecraft:append_loot"
				) {
					return onLootTableMatch(ctx);
				}
			},
		},
	]),
};
