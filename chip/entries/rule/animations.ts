import { Category } from "../../categories";
import { RuleEngine } from "../../json/rule";
import { createSegment } from "../../json/walker";
import { ConfigManager } from "../../utils/config";
import { prefixedMatch } from "../prefixed_match";

export function createAnimationRule(category: Category): RuleEngine {
	return new RuleEngine([
		{
			category,
			kind: "property",
			pattern: createSegment("animations/*"),
			onMatch: (ctx) => prefixedMatch(ctx, ConfigManager.prefix.animation, "property"),
		},
	]);
}

export const animationRule = createAnimationRule(Category.ClientAnimations);
