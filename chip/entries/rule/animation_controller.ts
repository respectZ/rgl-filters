import { Category } from "../../categories";
import { RuleEngine, type Rule } from "../../json/rule";
import { createSegment } from "../../json/walker";
import { ConfigManager } from "../../utils/config";
import { prefixedMatch } from "../prefixed_match";

export function createAnimationControllersRule(
	controllerCategory: Category,
	stateCategory: Category,
	additionalRules: Rule[] = [],
): RuleEngine {
	return new RuleEngine([
		...additionalRules,
		{
			category: stateCategory,
			kind: "value",
			pattern: createSegment("animation_controllers/*/initial_state"),
			onMatch(ctx) {
				if (ctx.value !== "default") {
					return {
						kind: "value",
					};
				}
			},
		},
		{
			category: stateCategory,
			kind: "property",
			pattern: createSegment("animation_controllers/*/states/*/transitions/[#]/*"),
			onMatch(ctx) {
				if (ctx.key !== "default") {
					return {
						kind: "property",
					};
				}
			},
		},
		{
			category: stateCategory,
			kind: "property",
			pattern: createSegment("animation_controllers/*/states/*"),
			onMatch(ctx) {
				if (ctx.key !== "default") {
					return {
						kind: "property",
					};
				}
			},
		},
		{
			category: controllerCategory,
			kind: "property",
			pattern: createSegment("animation_controllers/*"),
			onMatch: (ctx) => prefixedMatch(ctx, ConfigManager.prefix.animationController, "property"),
		},
	]);
}

export const animationControllersRule = createAnimationControllersRule(
	Category.ClientAnimationControllers,
	Category.ClientControllerStates,
);
