import { Category } from "../../categories";
import { RuleEngine } from "../../json/rule";
import { createSegment } from "../../json/walker";
import { ConfigManager } from "../../utils/config";
import { prefixedMatch } from "../prefixed_match";
import type { Entry } from "../types";

export const blockCulling: Entry = {
	category: Category.BlockCulling,
	pattern: "RP/block_culling/**/*.json",
	rule: new RuleEngine([
		{
			category: Category.BlockCulling,
			kind: "value",
			pattern: createSegment("minecraft:block_culling_rules/description/identifier"),
			onMatch: (ctx) => prefixedMatch(ctx, ConfigManager.prefix.identifier, "value"),
		},
	]),
};
