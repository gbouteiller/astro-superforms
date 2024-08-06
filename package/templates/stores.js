import {readable, writable} from "svelte/store"

export const navigating = readable(false)

const baseUrl = "https://test.de"

export const page = writable({
  url: new URL("/", baseUrl),
  params: {},
  route: {
    id: null,
  },
  status: 200,
  error: null,
  data: {},
  state: {},
  form: null,
})
