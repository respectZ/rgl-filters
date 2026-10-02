import type { Category } from "../categories";
import { ConfigManager } from "../utils/config";
import { hashStringWithConfig } from "../utils/hash_config";
import type { SegmentPattern, VisitKind, WalkContext } from "./walker";

export type Rule = {
	category: Category;
	pattern: SegmentPattern[];
	kind?: VisitKind;
	onMatch: (
		ctx: WalkContext,
	) => { kind: "value" | "property"; prefix?: string; value?: string } | undefined;
};

export type Operation = {
	ctx: WalkContext;
	kind: "value" | "property";
	prefix?: string;
	value?: string;
};

export interface FilteredRuleEngine {
	filter(ctx: WalkContext, kind: VisitKind): boolean;
}

export class RuleEngine {
	private readonly operations: Operation[] = [];
	private static isFiltered<T extends RuleEngine>(engine: T): engine is T & FilteredRuleEngine {
		return "filter" in engine && typeof engine.filter === "function";
	}
	constructor(private readonly rules: Rule[]) {}
	get hasEnabledRules(): boolean {
		return this.rules.some((rule) => ConfigManager.isCategoryEnabled(rule.category));
	}
	process(ctx: WalkContext) {
		const isFiltered = RuleEngine.isFiltered(this);
		for (const rule of this.rules) {
			if (!ConfigManager.isCategoryEnabled(rule.category)) {
				continue;
			}
			if (rule.kind && rule.kind !== ctx.kind) {
				continue;
			}
			if (!matchSegments(rule.pattern, ctx.segments)) {
				continue;
			}
			const result = rule.onMatch(ctx);
			if (result) {
				if (!isFiltered || this.filter(ctx, result.kind)) {
					this.operations.push({
						ctx,
						kind: result.kind,
						prefix: result.prefix,
						value: result.value,
					});
				}
			}
		}
	}
	applyOperations() {
		const segmentsMap = new Map<string, string>();
		for (const op of this.operations) {
			const segmentsKey = op.ctx.segments.join("/");
			const hashedKey = segmentsMap.get(segmentsKey);
			const parent = op.ctx.parent as Record<string, unknown>;
			switch (op.kind) {
				case "value":
					if (op.ctx.key !== undefined && typeof op.ctx.value === "string") {
						const hashed = op.value ?? this.hash(op);
						if (hashedKey && !(op.ctx.key in parent)) {
							parent[hashedKey] = hashed;
						} else {
							// @ts-expect-error: Type is unknown
							op.ctx.parent[op.ctx.key] = hashed;
						}
					}
					break;
				case "property":
					if (typeof op.ctx.key === "string") {
						const hashed = op.value ?? this.hash(op);
						parent[hashed] = op.ctx.value;
						// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
						delete parent[op.ctx.key];
					}
					break;
			}
			if (!segmentsMap.has(segmentsKey) && typeof op.ctx.key === "string") {
				segmentsMap.set(segmentsKey, hashStringWithConfig(op.ctx.key));
			}
		}
		this.operations.length = 0;
	}
	protected hash(op: Operation) {
		const value = op.kind === "property" ? op.ctx.key : op.ctx.value;
		if (typeof value === "string") {
			const hashed = (op.prefix ?? "") + hashStringWithConfig(value);
			return hashed;
		}
		throw new Error(`Cannot hash non-string ${op.kind}: ${value}`);
	}
}

export function matchSegments(pattern: SegmentPattern[], path: readonly string[]): boolean {
	return match(pattern, 0, path, 0);
}

function match(
	pattern: SegmentPattern[],
	pi: number,
	path: readonly string[],
	si: number,
): boolean {
	if (pi === pattern.length && si === path.length) {
		return true;
	}

	if (pi >= pattern.length) {
		return false;
	}

	const token = pattern[pi]!;

	if (token.type === "deep") {
		for (let i = si; i <= path.length; i++) {
			if (match(pattern, pi + 1, path, i)) {
				return true;
			}
		}

		return false;
	}

	if (si >= path.length) {
		return false;
	}

	if (token.type === "wildcard") {
		return match(pattern, pi + 1, path, si + 1);
	}

	if (token.type === "array-any") {
		if (!/^\[\d+\]$/.test(path[si]!)) {
			return false;
		}

		return match(pattern, pi + 1, path, si + 1);
	}

	return token.value === path[si] && match(pattern, pi + 1, path, si + 1);
}
