import type { Category } from "../categories";
import type { RuleEngine } from "../json/rule";
import type { PathStore } from "../path_store";

export type Entry = {
	category?: Category;
	pattern: string;
	store?: PathStore;
	matcher?: (filepath: string) => boolean;
	rule?: RuleEngine;
};
