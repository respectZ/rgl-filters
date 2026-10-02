import { Category } from "../../categories";
import { RuleEngine } from "../../json/rule";
import { createSegment } from "../../json/walker";
import { onTextureMatch } from "../on_texture_match";
import type { Entry } from "../types";

export const particles: Entry = {
	category: Category.Textures,
	pattern: "RP/particles/**/*.json",
	rule: new RuleEngine([
		{
			category: Category.Textures,
			kind: "value",
			pattern: createSegment("particle_effect/description/basic_render_parameters/texture"),
			onMatch: onTextureMatch,
		},
	]),
};
