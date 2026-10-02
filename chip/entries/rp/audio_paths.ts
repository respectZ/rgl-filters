import { Category } from "../../categories";
import { stores } from "../../stores";
import { ConfigManager } from "../../utils/config";
import type { Entry } from "../types";

export const audioFiles: Entry = {
	category: Category.AudioPaths,
	pattern: "RP/sounds" + ConfigManager.infix.path + "**/*.{ogg,wav,fsb}",
	store: stores.audio,
};
