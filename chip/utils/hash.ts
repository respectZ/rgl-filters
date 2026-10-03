function toUtf8(str: string): number[] {
	const bytes: number[] = [];
	for (const character of str) {
		let code = character.codePointAt(0)!;
		if (code >= 0xd800 && code <= 0xdfff) {
			code = 0xfffd;
		}
		if (code <= 0x7f) {
			bytes.push(code);
		} else if (code <= 0x7ff) {
			bytes.push(0xc0 | (code >>> 6), 0x80 | (code & 0x3f));
		} else if (code <= 0xffff) {
			bytes.push(0xe0 | (code >>> 12), 0x80 | ((code >>> 6) & 0x3f), 0x80 | (code & 0x3f));
		} else {
			bytes.push(
				0xf0 | (code >>> 18),
				0x80 | ((code >>> 12) & 0x3f),
				0x80 | ((code >>> 6) & 0x3f),
				0x80 | (code & 0x3f),
			);
		}
	}
	return bytes;
}

function mixBlock(block: number): number {
	block = Math.imul(block, 0xcc9e2d51);
	block = (block << 15) | (block >>> 17);
	return Math.imul(block, 0x1b873593);
}

export function hashString(str: string, seed: number): string {
	const bytes = toUtf8(str);
	let hash = seed >>> 0;
	let index = 0;
	for (; index + 3 < bytes.length; index += 4) {
		const block =
			bytes[index]! |
			(bytes[index + 1]! << 8) |
			(bytes[index + 2]! << 16) |
			(bytes[index + 3]! << 24);
		hash ^= mixBlock(block);
		hash = (hash << 13) | (hash >>> 19);
		hash = (Math.imul(hash, 5) + 0xe6546b64) | 0;
	}
	let tail = 0;
	for (let offset = 0; index + offset < bytes.length; offset++) {
		tail |= bytes[index + offset]! << (offset * 8);
	}
	if (index < bytes.length) {
		hash ^= mixBlock(tail);
	}
	hash ^= bytes.length;
	hash ^= hash >>> 16;
	hash = Math.imul(hash, 0x85ebca6b);
	hash ^= hash >>> 13;
	hash = Math.imul(hash, 0xc2b2ae35);
	hash ^= hash >>> 16;
	return (hash >>> 0).toString(16).padStart(8, "0");
}
