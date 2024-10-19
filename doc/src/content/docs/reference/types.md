---
title: Types Reference
description: A reference for the types.
---

## AsfResultError

```ts
type AsfResultError = { type: "error"; status: ErrorStatus };
```

`AsfResultError` is a type that represents an **Astro Superforms Action** error result.

## AsfResultFailure

```ts
type AsfResultFailure<INPUT extends ZodType = ZodType, MESSAGE = any> = {
  type: "failure";
  status: ErrorStatus;
  data: { form: SuperValidated<Infer<INPUT>, MESSAGE, InferIn<INPUT>> };
};
```

`AsfResultFailure` is a type that represents an **Astro Superforms Action** failure result.

## AsfResultRedirect

```ts
type AsfResultRedirect = { 
  type: "redirect"; 
  status: RedirectStatus; 
  location: string;
};
```

`AsfResultRedirect` is a type that represents an **Astro Superforms Action** redirect result.

## AsfResultSuccess

```ts
type AsfResultSuccess<RESULT = unknown, INPUT extends ZodType = ZodType, MESSAGE = any> = {
  type: "success";
  status: 200;
  data: { form: SuperValidated<Infer<INPUT>, MESSAGE, InferIn<INPUT>>; result: RESULT };
};
```

`AsfResultSuccess` is a type that represents an **Astro Superforms Action** success result.

## AsfResult

```ts
type AsfResult<RESULT = unknown, INPUT extends ZodType = ZodType, MESSAGE = any> =
  | AsfResultError
  | AsfResultFailure<INPUT, MESSAGE>
  | AsfResultRedirect
  | AsfResultSuccess<RESULT, INPUT, MESSAGE>;
```

`AsfResult` is a type that represents an **Astro Superforms Action** result (success, failure, redirect or error).

## AsfSafeResult

```ts
type AsfSafeResult<RESULT = unknown, INPUT extends ZodType = ZodType, MESSAGE = any> = SafeResult<any, AsfResult<RESULT, INPUT, MESSAGE>>;
```

`AsfSafeResult` is a type that represents an Astro Action safe result of an **Astro Superforms Action** result.

## AsfActionHandler

```ts
type AsfActionHandler<RESULT = unknown, INPUT extends ZodType = ZodType, MESSAGE = any, FAILURE extends AnyData = undefined> = (
  input: z.infer<INPUT>,
  context: Omit<ActionAPIContext, "redirect"> & { form: SuperValidated<Infer<INPUT>, MESSAGE, InferIn<INPUT>>; redirect: typeof redirect },
) => MaybePromise<RESULT | FailReturn<FAILURE> | RedirectReturn>;
```
