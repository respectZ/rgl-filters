import fg from "npm:fast-glob";
import json5 from "npm:json5";

function hashFromUint8Array(buffer: Uint8Array): number {
  let hash = 0;
  for (let i = 0; i < buffer.length; i++) {
    hash = (hash << 5) - hash + buffer[i];
    hash |= 0;
  }
  return hash;
}

async function hashFromFile(filepath: string): Promise<number> {
  const buffer = await Deno.readFile(filepath);
  return hashFromUint8Array(buffer);
}

const hashMap: Record<number, string> = {
  [-1106116047]: "textures/particle/particles",
  [-1212790716]: "textures/particle/particles",
  [372568939]: "textures/particle/small_gust",
  [-1164136940]: "textures/particle/shriek",
  [-1388192481]: "textures/particle/infested",
  [1843667267]: "textures/particle/ominous_spawning",
  [1987580038]: "textures/particle/raid_omen",
  [-1561220821]: "textures/particle/cherry_petal_atlas",
  [783190113]: "textures/particle/campfire_smoke",
  [1015128850]: "textures/particle/trial_omen",
  [265708349]: "textures/particle/vault_connection",
  [-732422927]: "textures/particle/sculk_charge_pop",
  [-1784370906]: "textures/particle/sculk_charge",
  [-1928099268]: "textures/particle/gust",
  [-555332902]: "textures/particle/soul",
  [500196351]: "textures/particle/sonic_explosion",
  [1797200626]: "textures/particle/vibration_signal",
  [-1833124029]: "textures/particle/sculk_soul",
};

type Particle = {
  particle_effect: {
    description: {
      basic_render_parameters: {
        texture: string;
      };
    };
  };
};

const particleFiles = await fg.glob("./RP/particles/**/*.json");
const promises = particleFiles.map(async (filepath) => {
  const particle = json5.parse(await Deno.readTextFile(filepath)) as Particle;
  const relativeTexture =
    particle.particle_effect.description.basic_render_parameters.texture;
  const texturePath = `./RP/${relativeTexture}.png`;

  let hash = 0;
  try {
    hash = await hashFromFile(texturePath);
  } catch {
    // Vanilla texture
    return;
  }

  const texture = hashMap[hash];
  if (texture && texture !== relativeTexture) {
    console.log(`Changed ${relativeTexture} => ${texture}`);
    particle.particle_effect.description.basic_render_parameters.texture =
      texture;
    // Remove old file
    try {
      await Deno.remove(texturePath);
    } catch {
      // File does not exist
    }
  } else {
    hashMap[hash] = relativeTexture;
  }
  await Deno.writeTextFile(filepath, JSON.stringify(particle, null, 2));
});

await Promise.all(promises);
