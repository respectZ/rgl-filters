import { Category } from "../../categories";
import { createAnimationControllersRule } from "../rule/animation_controller";
import type { Entry } from "../types";
import { controllerAnimationAliasRules } from "./animation_aliases";

export const animationControllers: Entry = {
	pattern: "BP/animation_controllers/**/*.json",
	rule: createAnimationControllersRule(
		Category.AnimationControllers,
		Category.ControllerStates,
		controllerAnimationAliasRules,
	),
};
