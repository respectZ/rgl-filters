import { Category } from "../../categories";
import { createAnimationRule } from "../rule/animations";
import type { Entry } from "../types";

export const animations: Entry = {
	category: Category.Animations,
	pattern: "BP/animations/**/*.json",
	rule: createAnimationRule(Category.Animations),
};
