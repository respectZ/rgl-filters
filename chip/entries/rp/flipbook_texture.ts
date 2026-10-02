import { Category } from "../../categories";
import { RuleEngine } from "../../json/rule";
import { createSegment } from "../../json/walker";
import { ConfigManager } from "../../utils/config";
import { onTextureMatch } from "../on_texture_match";
import { prefixedMatch } from "../prefixed_match";
import type { Entry } from "../types";

export const flipbookTexture: Entry = {
	pattern: "RP/textures/flipbook_textures.json",
	rule: new RuleEngine([
		{
			category: Category.TextureAtlasKeys,
			kind: "value",
			pattern: createSegment("[#]/atlas_tile"),
			onMatch: (ctx) => prefixedMatch(ctx, ConfigManager.prefix.identifier, "value"),
		},
		{
			category: Category.Textures,
			pattern: createSegment("[#]/flipbook_texture/"),
			onMatch: onTextureMatch,
		},
	]),
};
