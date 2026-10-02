import { Category } from "../../categories";
import type { Rule } from "../../json/rule";
import { createSegment, type VisitKind } from "../../json/walker";

function aliasRule(pattern: string, kind: VisitKind): Rule {
	return {
		category: Category.AnimationAliases,
		kind,
		pattern: createSegment(pattern),
		onMatch: () => ({ kind }),
	};
}

export const entityAnimationAliasRules: Rule[] = [
	aliasRule("minecraft:entity/description/animations/*", "property"),
	aliasRule("minecraft:entity/description/scripts/animate/[#]", "value"),
	aliasRule("minecraft:entity/description/scripts/animate/[#]/*", "property"),
];

export const controllerAnimationAliasRules: Rule[] = [
	aliasRule("animation_controllers/*/states/*/animations/[#]", "value"),
	aliasRule("animation_controllers/*/states/*/animations/[#]/*", "property"),
];
