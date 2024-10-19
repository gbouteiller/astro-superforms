---
title: Astro Superforms Action
description: Astro Superfroms Action
---

Instead of using the default `defineAction` from **Astro**:

```ts
// src/actions/index.ts
import { fail } from "@sveltejs/kit";
import { zNewsletterValues } from "@/lib/utils";
import { defineAction } from "astro:actions";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { subscribe } from "mynewsletterclient";

export const server = {
  //...
  subscribeToNewsletter: defineAction({
    accept: "form",
    handler: async (_, {request}) => {
      const form = await superValidate(request.clone(), zod(zNewsletterValues));
      if (!form.valid) return message(form, "BAD_REQUEST", { status: 400 });
      try {
        const data = await subscribe(form.data.email);
        return message(form, "SUCCESS");
      } catch (err) {
        return message(form, "BAD_REQUEST", { status: 400 });
      }
    },
  }),
  //...
};
```

Use the `defineAsfAction` from **Astro Superforms**:

```ts
// src/actions/index.ts
import { zNewsletterValues } from "@/lib/utils";
import { defineAsfAction } from "superforms:astro";
import { message } from "sveltekit-superforms";
import { subscribe } from "mynewsletterclient";

export const server = {
  //...
  subscribeToNewsletter: defineAsfAction({
    input: zNewsletterValues,
    handler: async ({ email }, { form }) => {
      try {
        const data = await subscribe(email);
        return message(form, "SUCCESS");
      } catch (err) {
        return message(form, "BAD_REQUEST", { status: 400 });
      }
    },
  }),
  //...
};
```

:::tip[What you get]

- `superValidate` is automatically called
- `invalid` form is automatically handled
- `accept: "form"` is automatically set

:::
