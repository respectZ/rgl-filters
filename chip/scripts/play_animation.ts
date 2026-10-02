import { Entity } from "@minecraft/server";
import { hashString } from "../utils/hash";

const prefix = "{animationPrefix}";
const seed = 778899;

const playAnimation = Entity.prototype.playAnimation;
Entity.prototype.playAnimation = function (animationName, options) {
	if (animationName.startsWith(prefix)) {
		animationName = prefix + hashString(animationName, seed);
	}
	if (options) {
		const copy = { ...options };
		if (options.nextState?.startsWith(prefix)) {
			copy.nextState = prefix + hashString(options.nextState, seed);
		}
		if (options.controller?.startsWith("controller." + prefix)) {
			copy.controller = "controller." + hashString(options.controller, seed);
		}
		options = copy;
	}
	return playAnimation.call(this, animationName, options);
};
