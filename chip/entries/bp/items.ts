import { Category } from "../../categories";
import { RuleEngine } from "../../json/rule";
import { ConfigManager } from "../../utils/config";
import { prefixedMatch } from "../prefixed_match";
import { transformRule } from "../transform_rule";
import type { Entry } from "../types";

export const items: Entry = {
	category: Category.TextureAtlasKeys,
	pattern: "BP/items/**/*.json",
	rule: new RuleEngine(
		transformRule(
			[
				{
					category: Category.TextureAtlasKeys,
					kind: "value",
					pattern: "minecraft:icon",
					onMatch: (ctx) => prefixedMatch(ctx, ConfigManager.prefix.identifier, "value"),
				},
				{
					category: Category.TextureAtlasKeys,
					kind: "value",
					pattern: "minecraft:icon/texture",
					onMatch: (ctx) => prefixedMatch(ctx, ConfigManager.prefix.identifier, "value"),
				},
				{
					category: Category.TextureAtlasKeys,
					kind: "value",
					pattern: "minecraft:icon/textures/*",
					onMatch: (ctx) => prefixedMatch(ctx, ConfigManager.prefix.identifier, "value"),
				},
			],
			["minecraft:item/components/"],
		),
	),
};
