import { Category } from "../../categories";
import { RuleEngine } from "../../json/rule";
import { createSegment } from "../../json/walker";
import { ConfigManager } from "../../utils/config";
import { prefixedMatch } from "../prefixed_match";
import type { Entry } from "../types";

export const geometries: Entry = {
	category: Category.Geometry,
	pattern: "RP/models/**/*.json",
	rule: new RuleEngine([
		{
			category: Category.Geometry,
			kind: "value",
			pattern: createSegment("minecraft:geometry/[#]/description/identifier"),
			onMatch: (ctx) => prefixedMatch(ctx, ConfigManager.prefix.geometry, "value"),
		},
	]),
};
