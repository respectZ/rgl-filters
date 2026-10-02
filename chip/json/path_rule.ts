import type { PathStore } from "../path_store";
import { RuleEngine, type FilteredRuleEngine, type Operation, type Rule } from "./rule";
import type { VisitKind, WalkContext } from "./walker";

export class PathRuleEngine extends RuleEngine implements FilteredRuleEngine {
	constructor(
		rule: Rule[],
		protected store: PathStore,
		protected infix: string,
	) {
		super(rule);
	}
	filter(ctx: WalkContext, kind: VisitKind): boolean {
		const v = kind === "value" ? ctx.value : ctx.key;
		return typeof v === "string" && v.includes(this.infix);
	}
	protected override hash(op: Operation): string {
		if (typeof op.ctx.value !== "string") {
			throw new Error(`Cannot hash non-string value: ${op.ctx.value}`);
		}
		const index = op.ctx.value.indexOf(this.infix);
		if (index === -1) {
			throw new Error(`Infix "${this.infix}" not found in value: ${op.ctx.value}`);
		}
		const hashed = this.store.hash(op.ctx.value, this.infix);
		const prefix = op.ctx.value.slice(0, index + this.infix.length);
		return prefix + hashed;
	}
}
