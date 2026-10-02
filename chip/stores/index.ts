import { createStore } from "../path_store";

export const stores = {
	texture: createStore(true),
	textureSet: createStore(".texture_set.json"),
	lootTable: createStore(),
	trading: createStore(),
	audio: createStore(true),
};
