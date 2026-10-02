function hash(str: string, seed = 0) {
	let hash = seed;
	for (let i = 0; i < str.length; i++) {
		hash = (hash << 5) + hash + str.charCodeAt(i);
	}
	return hash;
}

const chars = "_abcdefghijklmnopqrstuvwxyz0123456789";
export function hashString(str: string, seed: number): string {
	const hashValue = Math.abs(hash(str, seed));
	let result = "";
	let value = hashValue;
	do {
		const index = Math.abs(value % chars.length);
		result += chars[index];
		value = Math.floor(value / chars.length);
	} while (value > 0);
	return result;
}
