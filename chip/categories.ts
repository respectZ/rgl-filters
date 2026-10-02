export enum Category {
	LootTables = "lootTables",
	TradeTables = "tradeTables",
	Textures = "textures",
	AudioPaths = "audioPaths",
	TextureAtlasKeys = "textureAtlasKeys",
	Geometry = "geometry",
	Animations = "animations",
	AnimationControllers = "animationControllers",
	AnimationAliases = "animationAliases",
	ControllerStates = "controllerStates",
	ClientAnimations = "clientAnimations",
	ClientAnimationControllers = "clientAnimationControllers",
	ClientControllerStates = "clientControllerStates",
	RenderControllers = "renderControllers",
	BlockCulling = "blockCulling",
	ComponentGroups = "componentGroups",
}

export const categoryList = Object.freeze(Object.values(Category));
