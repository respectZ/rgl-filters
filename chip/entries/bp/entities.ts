import { Category } from "../../categories";
import { RuleEngine } from "../../json/rule";
import { createSegment } from "../../json/walker";
import { ConfigManager } from "../../utils/config";
import { onLootTableMatch } from "../on_loot_table_match";
import { onTradeTableMatch } from "../on_trade_table_match";
import { prefixedMatch } from "../prefixed_match";
import { transformRule } from "../transform_rule";
import type { Entry } from "../types";
import { entityAnimationAliasRules } from "./animation_aliases";

export const entities: Entry = {
	pattern: "BP/entities/**/*.json",
	rule: new RuleEngine([
		...entityAnimationAliasRules,
		{
			category: Category.Animations,
			kind: "value",
			pattern: createSegment("minecraft:entity/description/animations/*"),
			onMatch: (ctx) => prefixedMatch(ctx, ConfigManager.prefix.animation, "value"),
		},
		{
			category: Category.AnimationControllers,
			kind: "value",
			pattern: createSegment("minecraft:entity/description/animations/*"),
			onMatch: (ctx) => prefixedMatch(ctx, ConfigManager.prefix.animationController, "value"),
		},
		{
			category: Category.ComponentGroups,
			kind: "property",
			pattern: createSegment("minecraft:entity/component_groups/*"),
			onMatch: () => {
				return {
					kind: "property",
				};
			},
		},
		{
			category: Category.ComponentGroups,
			kind: "value",
			pattern: createSegment("minecraft:entity/events/**/component_groups/[#]"),
			onMatch: () => {
				return {
					kind: "value",
				};
			},
		},
		...transformRule(
			["minecraft:trade_table/table", "minecraft:economy_trade_table/table"].map((pattern) => ({
				category: Category.TradeTables,
				kind: "value" as const,
				pattern,
				onMatch: onTradeTableMatch,
			})),
			["minecraft:entity/components/", "minecraft:entity/component_groups/*/"],
		),
		...transformRule(
			[
				"minecraft:loot/table",
				"minecraft:equipment/table",
				"minecraft:barter/barter_table",
				"minecraft:behavior.drop_item_for/loot_table",
				"minecraft:behavior.sneeze/loot_table",
				"minecraft:behavior.random_search_and_dig/item_table",
				...[
					"minecraft:interact/",
					"minecraft:interact/[#]/",
					"minecraft:interact/interactions/",
					"minecraft:interact/interactions/[#]/",
				].flatMap((prefix) => [
					prefix + "add_items/table",
					prefix + "spawn_items/table",
					prefix + "spawn_items/[#]/table",
				]),
			].map((pattern) => ({
				category: Category.LootTables,
				kind: "value" as const,
				pattern,
				onMatch: onLootTableMatch,
			})),
			[
				"minecraft:entity/components/",
				"minecraft:entity/component_groups/*/",
			],
		),
	]),
};
