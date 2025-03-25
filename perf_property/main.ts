import type {
  AnimationController,
  AnimationControllers,
  ClientAnimations,
  ClientEntity,
  Entity,
  RenderControllers,
} from "npm:bedrock-ts";
import fg from "npm:fast-glob";
import { parse, stringify } from "npm:lossless-json";

function captureProperties(data: string) {
  const regex = /(q|query)\.property\('([^']+)'\)/gi;
  const groups = data.matchAll(regex);
  const properties = new Set<string>();
  for (const group of groups) {
    properties.add(group[2]);
  }
  return Array.from(properties);
}

function getProperties(entity: Entity) {
  const properties = entity["minecraft:entity"].description.properties;
  if (!properties) return;
  return properties;
}

async function loadJSON<T>(filepath: string): Promise<T> {
  const content = await Deno.readTextFile(filepath);
  // Strip comments
  const json = content.replace(/\s\/\/.*$/gm, "");
  return parse(json) as T;
}

async function writeJSON(filepath: string, data: unknown) {
  const json = stringify(data, null, 2) + "\n";
  await Deno.writeTextFile(filepath, json);
}

async function preloadClientEntities() {
  const capturedEntities = new Map<string, string[]>();
  const entities = new Map<string, ClientEntity>();
  const files = await fg.glob("./packs/RP/entity/**/*.json");
  for (const file of files) {
    const entity = await loadJSON<ClientEntity>(file);
    const identifier = entity["minecraft:client_entity"].description.identifier;
    entities.set(identifier, entity);
    const text = stringify(entity);
    if (!text) {
      throw new Error(`Failed to stringify entity ${file}`);
    }
    const properties = captureProperties(text);
    capturedEntities.set(identifier, properties);
  }
  return { capturedEntities, entities };
}

async function captureClientAnimations() {
  const animations = new Map<string, string[]>();
  const files = await fg.glob("./packs/RP/animations/**/*.json");
  for (const file of files) {
    const animation = await loadJSON<ClientAnimations>(file);
    for (const [key, value] of Object.entries(animation.animations)) {
      const text = stringify(value);
      if (!text) {
        throw new Error(`Failed to stringify animation ${file}`);
      }
      const properties = captureProperties(text);
      animations.set(key, properties);
    }
  }
  return animations;
}

async function preloadAnimationControllers() {
  const capturedAnimationControllers = new Map<string, string[]>();
  const animationControllers = new Map<string, AnimationController>();
  const files = await fg.glob("./packs/RP/animation_controllers/**/*.json");
  for (const file of files) {
    const animationController = await loadJSON<AnimationControllers>(file);
    if (!animationController.animation_controllers) continue;
    for (const [key, value] of Object.entries(
      animationController.animation_controllers
    )) {
      animationControllers.set(key, value);
      const text = stringify(value);
      if (!text) {
        throw new Error(`Failed to stringify animation controller ${file}`);
      }
      const properties = captureProperties(text);
      capturedAnimationControllers.set(key, properties);
    }
  }
  return {
    capturedAnimationControllers,
    animationControllers,
  };
}

async function captureRenderControllers() {
  const renderControllers = new Map<string, string[]>();
  const files = await fg.glob("./packs/RP/render_controllers/**/*.json");
  for (const file of files) {
    const renderController = await loadJSON<RenderControllers>(file);
    if (!renderController.render_controllers) continue;
    for (const [key, value] of Object.entries(
      renderController.render_controllers
    )) {
      const text = stringify(value);
      if (!text) {
        throw new Error(`Failed to stringify render controller ${file}`);
      }
      const properties = captureProperties(text);
      renderControllers.set(key, properties);
    }
  }
  return renderControllers;
}

function getAnimationsFromController(controller: AnimationController) {
  const animations = new Set<string>();
  for (const value of Object.values(controller.states)) {
    if (!value.animations) continue;
    for (const animation of Object.values(value.animations)) {
      if (typeof animation === "string") {
        animations.add(animation);
      } else {
        animations.add(Object.keys(animation)[0]);
      }
    }
  }
  return animations;
}

async function main() {
  const [
    { capturedEntities, entities: clientEntities },
    capturedAnimations,
    { animationControllers, capturedAnimationControllers },
    capturedRenderControllers,
  ] = await Promise.all([
    preloadClientEntities(),
    captureClientAnimations(),
    preloadAnimationControllers(),
    captureRenderControllers(),
  ]);

  const getPropertiesInClient = (identifier: string) => {
    const properties = new Set<string>();
    const clientEntity = clientEntities.get(identifier);
    if (!clientEntity) {
      return properties;
    }
    for (const key of capturedEntities.get(identifier) ?? []) {
      properties.add(key);
    }
    // Render controllers
    const renderControllers = clientEntity[
      "minecraft:client_entity"
    ].description.render_controllers.reduce((acc, curr) => {
      if (typeof curr === "string") {
        acc.push(curr);
      } else {
        acc.push(...Object.keys(curr));
      }
      return acc;
    }, [] as string[]);
    for (const key of renderControllers) {
      for (const property of capturedRenderControllers.get(key) ?? []) {
        properties.add(property);
      }
    }

    // Animation controllers and animations
    const animations =
      clientEntity["minecraft:client_entity"].description.animations;
    const animate = clientEntity[
      "minecraft:client_entity"
    ].description.scripts?.animate?.reduce((acc, curr) => {
      if (typeof curr === "string") {
        acc.push(curr);
      } else {
        acc.push(...Object.keys(curr));
      }
      return acc;
    }, [] as string[]);
    if (animate && animations) {
      for (const k of animate) {
        const animationKey = animations[k];
        if (!animationKey) {
          continue;
        }
        if (animationKey.startsWith("controller.animation")) {
          // Animation controller
          for (const property of capturedAnimationControllers.get(
            animationKey
          ) ?? []) {
            properties.add(property);
          }
          // Animation
          const controller = animationControllers.get(animationKey);
          if (controller) {
            for (const k of getAnimationsFromController(controller)) {
              const animationKey = animations[k];
              if (!animationKey) {
                continue;
              }
              for (const property of capturedAnimations.get(animationKey) ??
                []) {
                properties.add(property);
              }
            }
          }
        } else {
          // Animation
          for (const property of capturedAnimations.get(animationKey) ?? []) {
            properties.add(property);
          }
        }
      }
    }
    return properties;
  };

  for (const filepath of await fg.glob("./packs/BP/entities/**/*.json")) {
    let flag = false;
    const entity = await loadJSON<Entity>(filepath);
    const identifier = entity["minecraft:entity"].description.identifier;
    const properties = getProperties(entity);
    if (!properties) {
      continue;
    }
    const propertiesInClient = getPropertiesInClient(identifier);
    for (const key of Object.keys(properties)) {
      const value = properties[key];
      if (!value.client_sync) {
        continue;
      }
      if (!propertiesInClient.has(key)) {
        console.log(`Changing ${key} in ${identifier}`);
        value.client_sync = false;
        flag = true;
      }
    }
    if (flag) {
      await writeJSON(filepath, entity);
    }
  }
}

await main();
