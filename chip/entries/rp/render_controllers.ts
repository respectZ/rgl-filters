import { Category } from "../../categories";
import { RuleEngine } from "../../json/rule";
import { createSegment } from "../../json/walker";
import { ConfigManager } from "../../utils/config";
import { prefixedMatch } from "../prefixed_match";
import type { Entry } from "../types";

export const renderControllers: Entry = {
	category: Category.RenderControllers,
	pattern: "RP/render_controllers/**/*.json",
	rule: new RuleEngine([
		{
			category: Category.RenderControllers,
			kind: "property",
			pattern: createSegment("render_controllers/*"),
			onMatch: (ctx) => prefixedMatch(ctx, ConfigManager.prefix.renderController, "property"),
		},
	]),
};
