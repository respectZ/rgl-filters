import { animationControllersRule } from "../rule/animation_controller";
import type { Entry } from "../types";

export const animationControllers: Entry = {
	pattern: "RP/animation_controllers/**/*.json",
	rule: animationControllersRule,
};
