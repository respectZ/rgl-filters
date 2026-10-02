import { Category } from "../../categories";
import { RuleEngine } from "../../json/rule";
import { createSegment } from "../../json/walker";
import { ConfigManager } from "../../utils/config";
import { prefixedMatch } from "../prefixed_match";
import type { Entry } from "../types";

export const blocks: Entry = {
	category: Category.TextureAtlasKeys,
	pattern: "RP/blocks.json",
	rule: new RuleEngine(
		["*/textures", "*/textures/*", "*/carried_textures", "*/carried_textures/*"].map((pattern) => ({
			category: Category.TextureAtlasKeys,
			kind: "value",
			pattern: createSegment(pattern),
			onMatch: (ctx) => prefixedMatch(ctx, ConfigManager.prefix.identifier, "value"),
		})),
	),
};
