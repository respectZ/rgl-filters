import { Category } from "../../categories";
import { RuleEngine } from "../../json/rule";
import { ConfigManager } from "../../utils/config";
import { onLootTableMatch } from "../on_loot_table_match";
import { prefixedMatch } from "../prefixed_match";
import { transformRule } from "../transform_rule";
import type { Entry } from "../types";

export const blocks: Entry = {
	pattern: "BP/blocks/**/*.json",
	rule: new RuleEngine(
		transformRule(
			[
				{
					category: Category.TextureAtlasKeys,
					kind: "value",
					pattern: "minecraft:material_instances/*/texture",
					onMatch: (ctx) => prefixedMatch(ctx, ConfigManager.prefix.identifier, "value"),
				},
				{
					category: Category.TextureAtlasKeys,
					kind: "value",
					pattern: "minecraft:item_visual/material_instances/*/texture",
					onMatch: (ctx) => prefixedMatch(ctx, ConfigManager.prefix.identifier, "value"),
				},
				{
					category: Category.TextureAtlasKeys,
					kind: "value",
					pattern: "minecraft:embedded_visual/material_instances/*/texture",
					onMatch: (ctx) => prefixedMatch(ctx, ConfigManager.prefix.identifier, "value"),
				},
				{
					category: Category.TextureAtlasKeys,
					kind: "value",
					pattern: "minecraft:destruction_particles/texture",
					onMatch: (ctx) => prefixedMatch(ctx, ConfigManager.prefix.identifier, "value"),
				},
				{
					category: Category.Geometry,
					kind: "value",
					pattern: "minecraft:geometry",
					onMatch: (ctx) => prefixedMatch(ctx, ConfigManager.prefix.geometry, "value"),
				},
				{
					category: Category.Geometry,
					kind: "value",
					pattern: "minecraft:geometry/identifier",
					onMatch: (ctx) => prefixedMatch(ctx, ConfigManager.prefix.geometry, "value"),
				},
				{
					category: Category.Geometry,
					kind: "value",
					pattern: "minecraft:item_visual/geometry",
					onMatch: (ctx) => prefixedMatch(ctx, ConfigManager.prefix.geometry, "value"),
				},
				{
					category: Category.Geometry,
					kind: "value",
					pattern: "minecraft:item_visual/geometry/identifier",
					onMatch: (ctx) => prefixedMatch(ctx, ConfigManager.prefix.geometry, "value"),
				},
				{
					category: Category.Geometry,
					kind: "value",
					pattern: "minecraft:embedded_visual/geometry",
					onMatch: (ctx) => prefixedMatch(ctx, ConfigManager.prefix.geometry, "value"),
				},
				{
					category: Category.Geometry,
					kind: "value",
					pattern: "minecraft:embedded_visual/geometry/identifier",
					onMatch: (ctx) => prefixedMatch(ctx, ConfigManager.prefix.geometry, "value"),
				},
				{
					category: Category.BlockCulling,
					kind: "value",
					pattern: "minecraft:geometry/culling",
					onMatch: (ctx) => prefixedMatch(ctx, ConfigManager.prefix.identifier, "value"),
				},
				{
					category: Category.LootTables,
					kind: "value",
					pattern: "minecraft:loot",
					onMatch: onLootTableMatch,
				},
				{
					category: Category.LootTables,
					kind: "value",
					pattern: "minecraft:loot/loot_table",
					onMatch: onLootTableMatch,
				},
			],
			[
				"minecraft:block/components/",
				"minecraft:block/permutations/[#]/components/",
			],
		),
	),
};
