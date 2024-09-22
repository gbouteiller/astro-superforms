import { addVirtualImports, createResolver, defineIntegration, hasIntegration } from "astro-integration-kit";
import { readFile } from "node:fs/promises";

export const integration = defineIntegration({
  name: "astro-superforms",
  setup({ name }) {
    const { resolve } = createResolver(import.meta.url);
    return {
      hooks: {
        "astro:config:setup": async (params) => {
          const { logger, updateConfig } = params;
          if (!hasIntegration(params, { name: "@astrojs/svelte" })) {
            logger.error("astro-superforms requires @astrojs/svelte to be installed");
            return;
          }

          updateConfig({
            vite: {
              optimizeDeps: {
                exclude: ["$app/environment", "$app/forms", "$app/navigation", "$app/stores"],
              },
              resolve: {
                alias: {
                  "@sveltejs/kit": resolve("./virtual/kit.js"),
                },
              },
            },
          });

          let [environment, forms, navigation, stores, server] = await Promise.all([
            readFile(resolve("../assets/environment.js"), "utf-8"),
            readFile(resolve("../assets/forms.js"), "utf-8"),
            readFile(resolve("../assets/navigation.js"), "utf-8"),
            readFile(resolve("../assets/stores.js"), "utf-8"),
            readFile(resolve("./virtual/server.js"), "utf-8"),
          ]);

          addVirtualImports(params, {
            name,
            imports: {
              "$app/environment": environment,
              "$app/forms": forms,
              "$app/navigation": navigation,
              "$app/stores": stores,
              "superforms:astro": server,
            },
          });
        },
        "astro:config:done": async ({ injectTypes }) => {
          const inject = (filename: string, module: string) => (content: string) =>
            injectTypes({ filename, content: `declare module "${module}" {\n${content}\n};` });

          await Promise.all([
            readFile(resolve("./virtual/kit.d.ts"), "utf-8").then(inject("env.d.ts", "@sveltejs/kit")),
            readFile(resolve("./virtual/server.d.ts"), "utf-8").then(inject("types.d.ts", "superforms:astro")),
          ]);
        },
      },
    };
  },
});
