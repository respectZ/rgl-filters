import { Category } from "../../categories";
import { RuleEngine } from "../../json/rule";
import { createSegment } from "../../json/walker";
import { ConfigManager } from "../../utils/config";
import { onTextureMatch } from "../on_texture_match";
import { prefixedMatch } from "../prefixed_match";
import type { Entry } from "../types";

export const attachables: Entry = {
	pattern: "RP/attachables/**/*.json",
	rule: new RuleEngine([
		{
			category: Category.ClientAnimations,
			kind: "value",
			pattern: createSegment("minecraft:attachable/description/animations/*"),
			onMatch: (ctx) => prefixedMatch(ctx, ConfigManager.prefix.animation, "value"),
		},
		{
			category: Category.ClientAnimationControllers,
			kind: "value",
			pattern: createSegment("minecraft:attachable/description/animations/*"),
			onMatch: (ctx) => prefixedMatch(ctx, ConfigManager.prefix.animationController, "value"),
		},
		{
			category: Category.Geometry,
			kind: "value",
			pattern: createSegment("minecraft:attachable/description/geometry/*"),
			onMatch: (ctx) => prefixedMatch(ctx, ConfigManager.prefix.geometry, "value"),
		},
		{
			category: Category.Textures,
			kind: "value",
			pattern: createSegment("minecraft:attachable/description/textures/*"),
			onMatch: onTextureMatch,
		},
		{
			category: Category.RenderControllers,
			kind: "value",
			pattern: createSegment("minecraft:attachable/description/render_controllers/[#]"),
			onMatch: (ctx) => prefixedMatch(ctx, ConfigManager.prefix.renderController, "value"),
		},
		{
			category: Category.RenderControllers,
			kind: "property",
			pattern: createSegment("minecraft:attachable/description/render_controllers/[#]/*"),
			onMatch: (ctx) => prefixedMatch(ctx, ConfigManager.prefix.renderController, "property"),
		},
	]),
};
