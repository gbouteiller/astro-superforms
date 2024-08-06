# `astro-superforms`

This is an [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) that ease the use of Sveltekit Superforms in your Astro + Svelte projects

## Usage

### Prerequisites

You need to have [@astrojs/svelte](https://docs.astro.build/en/guides/integrations-guide/svelte/) installed in your project.

### Installation

Install the integration **automatically** using the Astro CLI:

```bash
pnpm astro add astro-superforms
```

```bash
npx astro add astro-superforms
```

```bash
yarn astro add astro-superforms
```

Or install it **manually**:

1. Install the required dependencies

```bash
pnpm add astro-superforms
```

```bash
npm install astro-superforms
```

```bash
yarn add astro-superforms
```

2. Add the integration to your astro config

```diff
+import asf from "astro-superforms";

export default defineConfig({
  integrations: [
+    asf(),
  ],
});
```

## Contributing

This package is structured as a monorepo:

- `playground` contains code for testing the package
- `package` contains the actual package

Install dependencies using pnpm:

```bash
pnpm i --frozen-lockfile
```

Start the playground and package watcher:

```bash
pnpm dev
```

You can now edit files in `package`. Please note that making changes to those files may require restarting the playground dev server.

## Licensing

[MIT Licensed](https://github.com/gbouteiller/astro-superforms/blob/main/LICENSE). Made with ❤️ by [Gregory Bouteiller](https://github.com/gbouteiller).

## Acknowledgements

- [`astro-integration-kit`](https://github.com/florian-lefebvre/astro-integration-kit) by Florian Lefebvre
- [`sveltekit-superforms`](https://github.com/ciscoheat/sveltekit-superforms) by Andreas Söderlund
