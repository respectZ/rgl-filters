import { Category, categoryList } from "../categories";
import { matchSegments } from "../json/rule";
import { createSegment } from "../json/walker";

type RawConfig = Partial<{
	seed: string | number;
	namespace: string;
	namespacePath: string;
	blacklist: BlacklistRule[];
	categories: Partial<Record<Category, boolean>>;
}>;

type BlacklistRule = {
	filePattern?: string;
	jsonPatterns?: string | string[];
	value?: string;
};

type Config = {
	seed: number;
	namespace: string;
	namespacePath: string;
	blacklist?: BlacklistRule[];
	categories: Record<Category, boolean>;
};

export function toConfig(raw: RawConfig): Config {
	if (!raw.seed) {
		throw new Error("Seed is required in the configuration.");
	}
	if (!raw.namespace) {
		throw new Error("Namespace is required in the configuration.");
	}
	if (!raw.namespacePath) {
		throw new Error("Namespace path is required in the configuration.");
	}
	let seed = 0;
	if (typeof raw.seed === "string") {
		for (let i = 0; i < raw.seed.length; i++) {
			seed = (seed << 5) - seed + raw.seed.charCodeAt(i);
		}
	} else {
		seed = raw.seed;
	}
	const categories = Object.fromEntries(categoryList.map((category) => [category, true])) as Record<
		Category,
		boolean
	>;
	if (raw.categories !== undefined) {
		if (!raw.categories || typeof raw.categories !== "object" || Array.isArray(raw.categories)) {
			throw new Error("Categories must be an object in the configuration.");
		}
		for (const [name, enabled] of Object.entries(raw.categories)) {
			if (!categoryList.includes(name as Category)) {
				throw new Error(`Unknown category "${name}" in the configuration.`);
			}
			if (typeof enabled !== "boolean") {
				throw new Error(`Category "${name}" must be a boolean in the configuration.`);
			}
			categories[name as Category] = enabled;
		}
	}
	const config: Config = {
		seed,
		namespace: raw.namespace,
		namespacePath: raw.namespacePath,
		blacklist: raw.blacklist,
		categories,
	};
	return config;
}

let config: Config | null = null;
function getConfig(): Config {
	if (!config) {
		const args = Bun.argv[2];
		const parsedArgs: RawConfig = args ? JSON.parse(args) : {};
		config = toConfig(parsedArgs);
	}
	return config;
}

export class ConfigManager {
	static readonly config = getConfig();
	static get seed(): number {
		return getConfig().seed;
	}
	static get namespace(): string {
		return getConfig().namespace;
	}
	static get namespacePath(): string {
		return getConfig().namespacePath;
	}
	static readonly prefix = {
		geometry: `geometry.${this.config.namespace}.`,
		animation: `animation.${this.config.namespace}.`,
		animationController: `controller.animation.${this.config.namespace}.`,
		renderController: `controller.render.${this.config.namespace}.`,
		identifier: this.config.namespace + ":",
	};
	static readonly infix = {
		path: `/${this.config.namespacePath}/`,
	};
	static isCategoryEnabled(category: Category): boolean {
		return this.config.categories[category];
	}
	static isBlacklisted(options: ConfigManagerBlacklistOptions): boolean {
		const { filepath, jsonSegments } = options;
		const whitelist = this.config.blacklist;
		if (!whitelist) {
			return false;
		}
		if (!filepath && !jsonSegments) {
			return false;
		}
		return whitelist.some((rule) => {
			if (rule.filePattern && (!filepath || !new Bun.Glob(rule.filePattern).match(filepath))) {
				return false;
			}
			if (rule.jsonPatterns !== undefined) {
				if (!jsonSegments) {
					return false;
				}
				const patterns =
					typeof rule.jsonPatterns === "string" ? [rule.jsonPatterns] : rule.jsonPatterns;
				for (const pattern of patterns) {
					if (!pattern) {
						continue;
					}
					const segment = createSegment(pattern);
					if (matchSegments(segment, jsonSegments)) {
						return true;
					}
				}
				return false;
			}
			return Boolean(rule.filePattern);
		});
	}
}

type ConfigManagerBlacklistOptions = {
	filepath?: string;
	jsonSegments?: readonly string[];
};
