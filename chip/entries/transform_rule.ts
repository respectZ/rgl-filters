import type { Rule } from "../json/rule";
import { createSegment } from "../json/walker";

type MappedRule = Omit<Rule, "pattern"> & {
	pattern: string;
};

export function transformRule(mappedRules: MappedRule[], prefixes: string[]): Rule[] {
	return mappedRules.flatMap((rule) => {
		return prefixes.map((prefix) => ({
			...rule,
			pattern: createSegment(prefix + rule.pattern),
		}));
	});
}
