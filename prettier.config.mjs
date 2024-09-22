/** @type {import("prettier").Config} */
export default {
  printWidth: 140,
  plugins: ["prettier-plugin-astro", "prettier-plugin-svelte", "prettier-plugin-tailwindcss"],
  overrides: [
    {files: "*.astro", options: {parser: "astro"}},
    {files: "*.svelte", options: {parser: "svelte"}},
  ],
}
