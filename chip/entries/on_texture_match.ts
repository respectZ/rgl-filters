import type { Rule } from "../json/rule";
import { stores } from "../stores";
import { ConfigManager } from "../utils/config";

export const onTextureMatch: Rule["onMatch"] = (ctx) => {
	if (
		typeof ctx.value === "string" &&
		ctx.value.startsWith("textures" + ConfigManager.infix.path)
	) {
		return {
			kind: "value",
			value: stores.texture.get(ctx.value.replace(/\.(?:png|jpe?g|tga|gif)$/, "")).relativePath,
		};
	}
};
