import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import { createResolver } from "astro-integration-kit";
import { hmrIntegration } from "astro-integration-kit/dev";
const { default: superforms } = await import("astro-superforms");

// https://astro.build/config
export default defineConfig({
  integrations: [
    svelte(),
    superforms(),
    tailwind({
      applyBaseStyles: false,
    }),
    hmrIntegration({
      directory: createResolver(import.meta.url).resolve("../package/dist"),
    }),
  ],
});
