import { Category } from "../../categories";
import { animationRule } from "../rule/animations";
import type { Entry } from "../types";

export const animations: Entry = {
	category: Category.ClientAnimations,
	pattern: "RP/animations/**/*.json",
	rule: animationRule,
};
