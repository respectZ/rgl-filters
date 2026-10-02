import path from "node:path/posix";
import { Category } from "../../categories";
import { RuleEngine, type Rule } from "../../json/rule";
import { createSegment, type WalkContext } from "../../json/walker";
import { stores } from "../../stores";
import { ConfigManager } from "../../utils/config";
import type { Entry } from "../types";

export const textures: Entry = {
	category: Category.Textures,
	pattern: "RP/textures" + ConfigManager.infix.path + "**/*.{tga,png,jpg,jpeg,gif}",
	store: stores.texture,
};

function hashMatch(ctx: WalkContext): ReturnType<Rule["onMatch"]> {
	if (typeof ctx.value === "string" && ctx.value[0] !== "#") {
		const dir = path.dirname(ctx.filepath!);
		const fullPath = path.join(dir, ctx.value);
		const hashedFullPath = stores.textureSet.hash(fullPath, ConfigManager.infix.path).filepath;
		const filename = path.basename(hashedFullPath, ".texture_set.json");
		return {
			kind: "value",
			value: filename,
		};
	}
}

export const textureSets: Entry = {
	category: Category.Textures,
	pattern: "RP/textures" + ConfigManager.infix.path + "**/*.texture_set.json",
	store: stores.textureSet,
	rule: new RuleEngine([
		{
			category: Category.Textures,
			pattern: createSegment("minecraft:texture_set/color"),
			onMatch: hashMatch,
		},
		{
			category: Category.Textures,
			pattern: createSegment("minecraft:texture_set/metalness_emissive_roughness"),
			onMatch: hashMatch,
		},
		{
			category: Category.Textures,
			pattern: createSegment("minecraft:texture_set/metalness_emissive_roughness_subsurface"),
			onMatch: hashMatch,
		},
		{
			category: Category.Textures,
			pattern: createSegment("minecraft:texture_set/heightmap"),
			onMatch: hashMatch,
		},
		{
			category: Category.Textures,
			pattern: createSegment("minecraft:texture_set/normal"),
			onMatch: hashMatch,
		},
	]),
};
