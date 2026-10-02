export class JsonWalker {
	walk(value: unknown, visitor: (ctx: WalkContext) => void, filepath?: string) {
		this.visit(value, [], undefined, undefined, visitor, filepath);
	}

	private visit(
		value: unknown,
		segments: string[],
		parent: unknown,
		key: string | number | undefined,
		visitor: (ctx: WalkContext) => void,
		filepath?: string,
	) {
		if (segments.length > 0) {
			visitor({
				kind: "property",
				segments,
				parent,
				key,
				value,
				filepath,
			});
		}

		visitor({
			kind: "value",
			segments,
			parent,
			key,
			value,
			filepath,
		});

		if (Array.isArray(value)) {
			value.forEach((item, index) => {
				this.visit(item, [...segments, `[${index}]`], value, index, visitor, filepath);
			});
			return;
		}

		if (value !== null && typeof value === "object") {
			for (const [k, v] of Object.entries(value)) {
				this.visit(v, [...segments, k], value, k, visitor, filepath);
			}
		}
	}
}

export type VisitKind = "property" | "value";

export interface WalkContext {
	kind: VisitKind;
	segments: readonly string[];
	parent: unknown;
	key: string | number | undefined;
	value: unknown;
	filepath?: string;
}

export type SegmentPattern =
	| { type: "literal"; value: string }
	| { type: "wildcard" } // *
	| { type: "deep" } // **
	| { type: "array-any" }; // [#]

export function createSegment(value: string): SegmentPattern[] {
	return value
		.split("/")
		.filter(Boolean)
		.map((segment) => {
			switch (segment) {
				case "*":
					return { type: "wildcard" };
				case "**":
					return { type: "deep" };
				case "[#]":
					return { type: "array-any" };
				default:
					return {
						type: "literal",
						value: segment,
					};
			}
		});
}
