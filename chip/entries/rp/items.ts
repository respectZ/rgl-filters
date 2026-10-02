import { Category } from "../../categories";
import { RuleEngine } from "../../json/rule";
import { createSegment } from "../../json/walker";
import { ConfigManager } from "../../utils/config";
import { prefixedMatch } from "../prefixed_match";
import type { Entry } from "../types";

export const items: Entry = {
	category: Category.TextureAtlasKeys,
	pattern: "RP/items/**/*.json",
	rule: new RuleEngine(
		["minecraft:icon", "minecraft:icon/texture", "minecraft:icon/textures/*"].map((pattern) => ({
			category: Category.TextureAtlasKeys,
			kind: "value",
			pattern: createSegment("minecraft:item/components/" + pattern),
			onMatch: (ctx) => prefixedMatch(ctx, ConfigManager.prefix.identifier, "value"),
		})),
	),
};
