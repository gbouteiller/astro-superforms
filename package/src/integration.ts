import {addDts, addVirtualImports, createResolver, defineIntegration, hasIntegration} from "astro-integration-kit"
import {promises as fs} from "node:fs"

// TODO: INSTALL DEVALUE ON THE APP
// TODO: ADD TYPE COMMMENTS BACK

export const integration = defineIntegration({
  name: "astro-superforms",
  setup({name}) {
    const {resolve} = createResolver(import.meta.url)
    return {
      hooks: {
        "astro:config:setup": async (params) => {
          if (!hasIntegration(params, {name: "@astrojs/svelte"})) {
            params.logger.error("astro-superforms requires @astrojs/svelte to be installed")
            return
          }

          params.updateConfig({
            vite: {
              optimizeDeps: {
                exclude: ["$app/environment", "$app/forms", "$app/navigation", "$app/stores"],
              },
            },
          })

          let [environment, forms, navigation, stores, server, serverTypes] = await Promise.all([
            fs.readFile(resolve("../templates/environment.js"), "utf-8"),
            fs.readFile(resolve("../templates/forms.js"), "utf-8"),
            fs.readFile(resolve("../templates/navigation.js"), "utf-8"),
            fs.readFile(resolve("../templates/stores.js"), "utf-8"),
            fs.readFile(resolve("./virtual/server.js"), "utf-8"),
            fs.readFile(resolve("./virtual/server.d.ts"), "utf-8"),
          ])

          addVirtualImports(params, {
            name,
            imports: {
              "$app/environment": environment,
              "$app/forms": forms,
              "$app/navigation": navigation,
              "$app/stores": stores,
              "asf:actions": server,
            },
          })

          addDts(params, {name: "@astro/superforms", content: `declare module 'asf:actions' {${serverTypes}}`})
        },
      },
    }
  },
})
