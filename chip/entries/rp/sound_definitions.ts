import { Category } from "../../categories";
import { RuleEngine, type Rule } from "../../json/rule";
import { createSegment } from "../../json/walker";
import { stores } from "../../stores";
import { ConfigManager } from "../../utils/config";
import type { Entry } from "../types";

const onAudioMatch: Rule["onMatch"] = (ctx) => {
	if (typeof ctx.value === "string" && ctx.value.startsWith("sounds" + ConfigManager.infix.path)) {
		return {
			kind: "value",
			value: stores.audio.get(ctx.value.replace(/\.(?:ogg|wav|fsb)$/, "")).relativePath,
		};
	}
};

export const soundDefinitions: Entry = {
	category: Category.AudioPaths,
	pattern: "RP/sounds/sound_definitions.json",
	rule: new RuleEngine([
		{
			category: Category.AudioPaths,
			kind: "value",
			pattern: createSegment("sound_definitions/*/sounds/[#]"),
			onMatch: onAudioMatch,
		},
		{
			category: Category.AudioPaths,
			kind: "value",
			pattern: createSegment("sound_definitions/*/sounds/[#]/name"),
			onMatch: onAudioMatch,
		},
	]),
};
