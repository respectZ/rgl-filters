import { animationControllers } from "./animation_controllers";
import { animations } from "./animations";
import { blocks } from "./blocks";
import { entities } from "./entities";
import { items } from "./items";
import {
	lootTableReferences,
	lootTables,
	processorLootReferences,
	tradeLootReferences,
} from "./loot_tables";
import { tradeTables } from "./trade_tables";

export const BPEntries = [
	lootTables,
	tradeTables,
	lootTableReferences,
	tradeLootReferences,
	processorLootReferences,

	animations,
	animationControllers,
	blocks,
	entities,
	items,
];
