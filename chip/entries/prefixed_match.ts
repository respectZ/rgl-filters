import type { VisitKind, WalkContext } from "../json/walker";

export function prefixedMatch(ctx: WalkContext, prefix: string, kind: VisitKind, value?: string) {
	const v = kind === "property" ? ctx.key : ctx.value;
	if (typeof v === "string" && v.startsWith(prefix)) {
		return {
			kind,
			prefix,
			value,
		};
	}
}

export function infixedMatch(ctx: WalkContext, infix: string, kind: VisitKind) {
	const v = kind === "property" ? ctx.key : ctx.value;
	if (typeof v === "string" && v.includes(infix)) {
		return {
			kind,
			prefix: infix,
		};
	}
}
