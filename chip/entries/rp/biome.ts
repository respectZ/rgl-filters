import { Category } from "../../categories";
import { RuleEngine } from "../../json/rule";
import { createSegment } from "../../json/walker";
import { ConfigManager } from "../../utils/config";
import { prefixedMatch } from "../prefixed_match";
import type { Entry } from "../types";

export const clientBiome: Entry = {
	pattern: "RP/biomes/**/*.json",
	rule: new RuleEngine([
		{
			category: Category.Water,
			kind: "value",
			pattern: createSegment(
				"minecraft:client_biome/components/minecraft:water_identifier/water_identifier",
			),
			onMatch: (ctx) => prefixedMatch(ctx, ConfigManager.prefix.identifier, "value"),
		},
	]),
};
