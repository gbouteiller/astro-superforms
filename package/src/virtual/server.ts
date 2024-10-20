import { fail, redirect, type AnyData, type FailReturn, type RedirectReturn, type RedirectStatus } from "@sveltejs/kit";
import type { ActionAPIContext, MaybePromise } from "astro/actions/runtime/utils.js";
import { defineAction, type ActionHandler, type SafeResult } from "astro:actions";
import { superValidate, type ErrorStatus, type Infer, type InferIn, type SuperValidated } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { z, ZodType } from "astro/zod";

// ACTION **********************************************************************************************************************************
export function defineAsfAction<R = unknown, I extends ZodType = ZodType, M = any, F extends AnyData = undefined>(p: {
  handler: AsfActionHandler<R, I, M, F>;
  input: I;
}) {
  const formHandler = (async (_, context) => {
    const form = await superValidate(context.request.clone(), zod(p.input));
    if (!form.valid) return fail(400, { form });
    try {
      const data = await p.handler(form.data, { ...context, form, redirect });
      if (isObjectLike(data) && ["failure", "redirect"].includes(data.type)) return data;
      return { type: "success", status: 200, data };
    } catch (err) {
      return { type: "error", status: 500, data: err };
    }
  }) as ActionHandler<I, AsfResult<R, I, M>>;
  return defineAction<AsfResult<R, I, M>, "form", I>({ accept: "form", handler: formHandler });
}

function isObjectLike(value: unknown): value is object {
  return typeof value === "object" && value !== null;
}

// UTILS ***********************************************************************************************************************************
export function getForm<R, I extends ZodType, M = any>(result: AsfSafeResult<R, I, M> | undefined) {
  return result?.data?.type === "success" || result?.data?.type === "failure" ? result.data.data.form : undefined;
}

export function getRedirectLocation<R, I extends ZodType, M = any>(result: AsfSafeResult<R, I, M> | undefined) {
  return result?.data?.type === "redirect" ? result.data.location : undefined;
}

// TYPES ***********************************************************************************************************************************
export type AsfResultError = { type: "error"; status: ErrorStatus };
export type AsfResultFailure<I extends ZodType = ZodType, M = any> = {
  type: "failure";
  status: ErrorStatus;
  data: { form: AsfSuperValidated<I, M> };
};
export type AsfResultRedirect = { type: "redirect"; status: RedirectStatus; location: string };
export type AsfResultSuccess<R = unknown, I extends ZodType = ZodType, M = any> = {
  type: "success";
  status: 200;
  data: { form: AsfSuperValidated<I, M>; result: R };
};
export type AsfResult<R = unknown, I extends ZodType = ZodType, M = any> =
  | AsfResultError
  | AsfResultFailure<I, M>
  | AsfResultRedirect
  | AsfResultSuccess<R, I, M>;

export type AsfActionHandler<R = unknown, I extends ZodType = ZodType, M = any, F extends AnyData = undefined> = (
  input: z.infer<I>,
  context: Omit<ActionAPIContext, "redirect"> & { form: AsfSuperValidated<I, M>; redirect: typeof redirect },
) => MaybePromise<R | FailReturn<F> | RedirectReturn>;

export type AsfSafeResult<R = unknown, I extends ZodType = ZodType, M = any> = SafeResult<any, AsfResult<R, I, M>>;

type AsfSuperValidated<I extends ZodType = ZodType, M = any> = SuperValidated<Infer<I>, M, InferIn<I>>;
