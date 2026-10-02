import type { Rule } from "../json/rule";
import { stores } from "../stores";
import { ConfigManager } from "../utils/config";

export const onTradeTableMatch: Rule["onMatch"] = (ctx) => {
	if (typeof ctx.value === "string" && ctx.value.startsWith("trading" + ConfigManager.infix.path)) {
		return {
			kind: "value",
			value: stores.trading.get(ctx.value).relativePath,
		};
	}
};
