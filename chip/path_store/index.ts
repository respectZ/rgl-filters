import fs from "node:fs/promises";
import path from "node:path/posix";
import { hashStringWithConfig } from "../utils/hash_config";

function trimPackPath(filepath: string, removeExt?: boolean | string) {
	const splitted = filepath.split("/");
	const packType = splitted[0];
	if (packType !== "BP" && packType !== "RP") {
		return filepath;
	}
	const relative = splitted.slice(1).join("/");
	if (!removeExt) {
		return relative;
	}
	if (typeof removeExt === "string") {
		const result = relative.endsWith(removeExt) ? relative.slice(0, -removeExt.length) : relative;
		return result;
	}
	const extension = path.extname(relative);
	const withoutExt = relative.slice(0, -extension.length);
	return withoutExt;
}

export type PathStore = ReturnType<typeof createStore>;

export function createStore(removeExt?: boolean | string) {
	const map: Record<string, HashResult> = {};
	const set: Set<string> = new Set();
	return Object.freeze({
		async move(filepath: string, infix: string) {
			const { filepath: dest } = this.hash(filepath, infix);
			await fs.rename(filepath, dest);
		},
		hash(filepath: string, infix: string) {
			const result = map[trimPackPath(filepath, removeExt)];
			if (result) {
				return result;
			}
			const hasPackPrefix = filepath.startsWith("BP/") || filepath.startsWith("RP/");
			const assetStart = hasPackPrefix ? filepath.indexOf("/") + 1 : 0;
			const assetEnd = filepath.indexOf("/", assetStart);
			const infixIndex = assetEnd === -1 ? -1 : filepath.indexOf(infix, assetEnd);
			if (infixIndex !== -1) {
				const extension = typeof removeExt === "string" ? removeExt : path.extname(filepath);
				const key = trimPackPath(filepath, removeExt);
				const hashed = hashStringWithConfig(key);
				if (set.has(hashed)) {
					throw new Error(`Hash collision detected for ${filepath} with hash ${hashed}`);
				}
				const endIndex = infixIndex + infix.length;
				const baseDir = filepath.slice(0, endIndex);
				filepath = path.join(baseDir, `${hashed}${extension}`);
				const relativePath = trimPackPath(filepath, removeExt);
				const result: HashResult = { filepath, relativePath };
				map[key] = result;
				set.add(hashed);
				return result;
			}
			throw new Error(`Filepath ${filepath} does not contain the infix ${infix}`);
		},
		get(relativePath: string) {
			const result = map[relativePath];
			if (!result) {
				throw new Error(`No hashed result found for relative path: ${relativePath}`);
			}
			return result;
		},
	});
}

type HashResult = {
	filepath: string;
	relativePath: string;
};
