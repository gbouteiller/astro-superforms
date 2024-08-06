import astro from "eslint-plugin-astro"
import svelte from "eslint-plugin-svelte"

export default [...svelte.configs["flat/recommended"], ...astro.configs["flat/recommended"], ...astro.configs["flat/jsx-a11y-strict"]]
