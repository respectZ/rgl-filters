import { ConfigManager } from "./config";
import { hashString } from "./hash";

export function hashStringWithConfig(str: string): string {
	return hashString(str, ConfigManager.seed);
}
