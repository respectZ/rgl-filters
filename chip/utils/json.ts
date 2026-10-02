import { JSONC } from "bun";
import { parse, stringify } from "lossless-json";

function stripJsonComments(json: string): string {
	const characters = json.split("");
	let inString = false;
	for (let index = 0; index < json.length; index++) {
		const character = json[index];
		if (inString) {
			if (character === "\\") {
				index++;
			} else if (character === '"') {
				inString = false;
			}
			continue;
		}
		if (character === '"') {
			inString = true;
			continue;
		}
		const next = json[index + 1];
		if (character !== "/" || (next !== "/" && next !== "*")) {
			continue;
		}
		let end = index + 2;
		if (next === "/") {
			while (end < json.length && json[end] !== "\r" && json[end] !== "\n") {
				end++;
			}
		} else {
			end = json.indexOf("*/", end);
			if (end === -1) {
				throw new SyntaxError(`Unterminated block comment at position ${index}`);
			}
			end += 2;
		}
		for (; index < end; index++) {
			if (json[index] !== "\r" && json[index] !== "\n") {
				characters[index] = " ";
			}
		}
		index--;
	}
	return characters.join("");
}

export async function loadJson<T>(filepath: string, lossless = false): Promise<T> {
	let text = await Bun.file(filepath).text();
	if (lossless) {
		text = stripJsonComments(text);
		return parse(text) as T;
	}
	return JSONC.parse(text) as T;
}

export async function saveJson<T>(filepath: string, data: T, lossless = false): Promise<void> {
	let text: string | undefined;
	if (lossless) {
		text = stringify(data);
		if (!text) {
			throw new Error("Failed to stringify data");
		}
	} else {
		text = JSON.stringify(data);
	}
	await Bun.write(filepath, text);
}
