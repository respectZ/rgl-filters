import { Category } from "../../categories";
import { stores } from "../../stores";
import { ConfigManager } from "../../utils/config";
import type { Entry } from "../types";

export const tradeTables: Entry = {
	category: Category.TradeTables,
	pattern: "BP/trading" + ConfigManager.infix.path + "**/*.json",
	store: stores.trading,
};
