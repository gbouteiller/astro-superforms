import node from "@astrojs/node";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import { createResolver } from "astro-integration-kit";
import { hmrIntegration } from "astro-integration-kit/dev";
import { defineConfig } from "astro/config";
const { default: superforms } = await import("astro-superforms");

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    superforms(),
    hmrIntegration({
      directory: createResolver(import.meta.url).resolve("../package/dist"),
    }),
    svelte(),
  ],
});
