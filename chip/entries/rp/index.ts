import type { Entry } from "../types";
import { animationControllers } from "./animation_controllers";
import { animations } from "./animations";
import { attachables } from "./attachables";
import { audioFiles } from "./audio_paths";
import { blockCulling } from "./block_culling";
import { blocks } from "./blocks";
import { entity } from "./entity";
import { flipbookTexture } from "./flipbook_texture";
import { geometries } from "./geometries";
import { items } from "./items";
import { particles } from "./particles";
import { renderControllers } from "./render_controllers";
import { soundDefinitions } from "./sound_definitions";
import { itemTexture, terrainTexture } from "./texture_atlas";
import { textures, textureSets } from "./textures";

export const RPEntries: Entry[] = [
	textures,
	textureSets,
	audioFiles,
	soundDefinitions,

	animationControllers,
	animations,
	attachables,
	geometries,
	renderControllers,
	blockCulling,
	entity,

	particles,
	blocks,
	items,
	itemTexture,
	terrainTexture,
	flipbookTexture,
];
