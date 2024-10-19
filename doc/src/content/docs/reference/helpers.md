---
title: Helpers
description: A reference for the helpers.
---

## definedAsfAction

```ts
import { definedAsfAction } from "superforms:astro";

defineAsfAction({ handler, input });
```

The `defineAsfAction` function is a function that allows you to define an **Astro Superforms Action**.

### handler

- **Required**
- **Type:** [AsfActionHandler](/reference/types#asfactionhandler)

The `handler` parameter is a mandatory parameter that specifies the handler function for the **Astro Superforms Action**.

### input

- **Required**
- **Type:** `ZodType`

The `input` parameter is a mandatory parameter that specifies the input schema for the **Astro Superforms Action**.

## getForm

`getForm` is a function that returns the supervalidated `form` from an **Astro Action** safe result of an **Astro Superforms Action** result.

```ts
import { actions } from 'astro:actions';
import { getForm } from "superforms:astro";

const result = Astro.getActionResult(actions.subscribeToNewsletter);
const form = getForm(result);
```

### result

- **Required**
- **Type:** [AsfSafeResult](/reference/types#asfsaferesult)

The `result` parameter is a mandatory parameter that specifies the result of the action.

## getRedirectLocation

`getRedirectLocation` is a function that returns the redirect location from an **Astro Action** safe result of an **Astro Superforms Action**
result.

```ts
import { actions } from 'astro:actions';
import { getRedirectLocation } from "superforms:astro";

const result = Astro.getActionResult(actions.subscribeToNewsletter);
const location = getRedirectLocation(result);
```

### result

- **Required**
- **Type:** [AsfSafeResult](/reference/types#asfsaferesult)

The `result` parameter is a mandatory parameter that specifies the result of the action.
