# `astro-superforms`

This is an [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) that ease the use of Sveltekit Superforms in your Astro + Svelte projects

## Usage

### Prerequisites

TODO:

### Installation

Install the integration **automatically** using the Astro CLI:

```bash
pnpm astro add superforms
```

```bash
npx astro add superforms
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
+import integration from "astro-superforms";

export default defineConfig({
  integrations: [
+    integration(),
  ],
});
```

### Configuration

TODO:configuration

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

TODO:
