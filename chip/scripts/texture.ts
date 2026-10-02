import { ActionFormData, CustomForm } from "@minecraft/server-ui";
import { hashString } from "../utils/hash";

// Placeholders.
const infix = "{infix}";
const seed = 778899;

function hashIcon(iconPath: string) {
	if (iconPath.startsWith("textures" + infix)) {
		iconPath = iconPath.replace(/\.(png|jpe?g|tga|gif)$/, "");
		return "textures" + infix + hashString(iconPath, seed);
	}
	return iconPath;
}

const actionButton = ActionFormData.prototype.button;
ActionFormData.prototype.button = function (text, iconPath) {
	if (iconPath) {
		iconPath = hashIcon(iconPath);
	}
	return actionButton.call(this, text, iconPath);
};

// FIXME: CustomForm.image can be ObvservableString
// but we can't add support for that.
const customFormImage = CustomForm.prototype.image;
CustomForm.prototype.image = function (src, pack, options) {
	if (typeof src === "string") {
		src = hashIcon(src);
	}
	return customFormImage.call(this, src, pack, options);
};
