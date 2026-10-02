import { Category } from "../../categories";
import { RuleEngine } from "../../json/rule";
import { createSegment } from "../../json/walker";
import { ConfigManager } from "../../utils/config";
import { onTextureMatch } from "../on_texture_match";
import { prefixedMatch } from "../prefixed_match";
import type { Entry } from "../types";

const terrainAtlasRule = new RuleEngine([
	{
		category: Category.TextureAtlasKeys,
		kind: "property",
		pattern: createSegment("texture_data/*"),
		onMatch: (ctx) => prefixedMatch(ctx, ConfigManager.prefix.identifier, "property"),
	},
	{
		category: Category.Textures,
		kind: "value",
		pattern: createSegment("texture_data/*/textures/variations/[#]/path"),
		onMatch: onTextureMatch,
	},
	{
		category: Category.Textures,
		kind: "value",
		pattern: createSegment("texture_data/*/textures/variations/[#]/tint_path"),
		onMatch: onTextureMatch,
	},
	{
		category: Category.Textures,
		kind: "value",
		pattern: createSegment("texture_data/*/textures/[#]/path"),
		onMatch: onTextureMatch,
	},
	{
		category: Category.Textures,
		kind: "value",
		pattern: createSegment("texture_data/*/textures/[#]/tint_path"),
		onMatch: onTextureMatch,
	},
	{
		category: Category.Textures,
		kind: "value",
		pattern: createSegment("texture_data/*/textures/path"),
		onMatch: onTextureMatch,
	},
	{
		category: Category.Textures,
		kind: "value",
		pattern: createSegment("texture_data/*/textures/tint_path"),
		onMatch: onTextureMatch,
	},
	{
		category: Category.Textures,
		kind: "value",
		pattern: createSegment("texture_data/*/textures/[#]"),
		onMatch: onTextureMatch,
	},
	{
		category: Category.Textures,
		kind: "value",
		pattern: createSegment("texture_data/*/textures"),
		onMatch: onTextureMatch,
	},
]);

export const itemTexture: Entry = {
	pattern: "RP/textures/item_texture.json",
	rule: terrainAtlasRule,
};

export const terrainTexture: Entry = {
	pattern: "RP/textures/terrain_texture.json",
	rule: terrainAtlasRule,
};
