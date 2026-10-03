import { Category } from "../../categories";
import { RuleEngine } from "../../json/rule";
import { createSegment } from "../../json/walker";
import { ConfigManager } from "../../utils/config";
import { onTextureMatch } from "../on_texture_match";
import { prefixedMatch } from "../prefixed_match";
import type { Entry } from "../types";

export const water: Entry = {
	pattern: "RP/water/**/*.json",
	rule: new RuleEngine([
		{
			category: Category.Water,
			kind: "value",
			pattern: createSegment("minecraft:water_settings/description/identifier"),
			onMatch: (ctx) => prefixedMatch(ctx, ConfigManager.prefix.identifier, "value"),
		},
		{
			category: Category.Textures,
			kind: "value",
			pattern: createSegment("minecraft:water_settings/caustics/texture"),
			onMatch: onTextureMatch,
		},
	]),
};
