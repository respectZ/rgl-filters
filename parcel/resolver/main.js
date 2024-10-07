import { Resolver } from "@parcel/plugin";
import path from "path/posix";

const externals = ["@minecraft/server", "@minecraft/server-ui"];
export default new Resolver({
  async resolve({ specifier}) {
    if (externals.includes(specifier)) {
      return {
        isExcluded: true,
      };
    }
    if (specifier === "@minecraft/vanilla-data") {
      return {
        filePath: path.join(
          process.env.ROOT_DIR,
          "node_modules",
          "@minecraft/vanilla-data",
          "lib",
          "index.js",
        ),
      };
    }
    return null;
  },
});
