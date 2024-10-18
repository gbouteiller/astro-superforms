// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Astro Superforms",
      social: {
        github: "https://github.com/gbouteiller/astro-superforms",
      },
      sidebar: [
        {
          label: "Start here",
          items: [
            { label: "Getting Started", slug: "start-here/getting-started" },
            { label: "Manual Setup", slug: "start-here/manual-setup" },
            { label: "Usage", slug: "start-here/usage" },
          ],
        },
        {
          label: "Guides",
          autogenerate: { directory: "guides" },
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
    }),
  ],
});
