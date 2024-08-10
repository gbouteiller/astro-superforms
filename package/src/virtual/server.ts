import {redirect, type FailReturn, type RedirectReturn, type RedirectStatus} from "@sveltejs/kit"
import type {ActionAPIContext, MaybePromise} from "astro/actions/runtime/utils.js"
import {defineAction, type ActionHandler, type SafeResult} from "astro:actions"
import {isObjectLike} from "es-toolkit/compat"
import {superValidate, type ErrorStatus, type Infer, type InferIn, type SuperValidated} from "sveltekit-superforms"
import {zod} from "sveltekit-superforms/adapters"
import type {z} from "zod"

// ACTION **********************************************************************************************************************************
export function defineAsfAction<
  R = unknown,
  I extends z.ZodType = z.ZodType,
  M = any,
  F extends Record<string, unknown> | undefined = undefined,
>(p: {input: I; handler: AsfActionHandler<R, I, M, F>}) {
  const formHandler = (async (_, context) => {
    const form = await superValidate(context.request.clone(), zod(p.input))
    try {
      const result = await p.handler(form.data, {...context, form, redirect})
      if (isObjectLike(result) && result.type === "failure") return {...result, data: {form, payload: result.data}}
      if (isObjectLike(result) && result.type === "redirect") return result
      return {type: "success", status: result ? 200 : 204, data: {form, payload: result}}
    } catch (err) {
      return {type: "error", status: 500, data: {error: err}}
    }
  }) as ActionHandler<I, AsfResult<R, I, M>>
  return defineAction<AsfResult<R, I, M>, "form", I>({accept: "form", handler: formHandler})
}

// UTILS ***********************************************************************************************************************************
export function getForm<R, I extends z.ZodType, M = any>(result: AsfSafeResult<R, I, M> | undefined) {
  return result?.data?.type === "success" || result?.data?.type === "failure" ? result.data.data.form : undefined
}

export function getRedirectLocation<R, I extends z.ZodType, M = any>(result: AsfSafeResult<R, I, M> | undefined) {
  return result?.data?.type === "redirect" ? result.data.location : undefined
}

// TYPES ***********************************************************************************************************************************
export type AsfSuperValidated<I extends z.ZodType = z.ZodType, M = any> = SuperValidated<Infer<I>, M, InferIn<I>>

export type AsfResultError = {type: "error"; status: ErrorStatus}
export type AsfResultFailure<I extends z.ZodType = z.ZodType, M = any> = {
  type: "failure"
  status: ErrorStatus
  data: {form: AsfSuperValidated<I, M>}
}
export type AsfResultRedirect = {type: "redirect"; status: RedirectStatus; location: string}
export type AsfResultSuccess<R = unknown, I extends z.ZodType = z.ZodType, M = any> = {
  type: "success"
  status: 200
  data: {form: AsfSuperValidated<I, M>; result: R}
}
export type AsfResult<R = unknown, I extends z.ZodType = z.ZodType, M = any> =
  | AsfResultError
  | AsfResultFailure<I, M>
  | AsfResultRedirect
  | AsfResultSuccess<R, I, M>

export type AsfActionHandler<
  R = unknown,
  I extends z.ZodType = z.ZodType,
  M = any,
  F extends Record<string, unknown> | undefined = undefined,
> = (
  input: z.infer<I>,
  context: Omit<ActionAPIContext, "redirect"> & {form: AsfSuperValidated<I, M>; redirect: typeof redirect}
) => MaybePromise<R | FailReturn<F> | RedirectReturn>

export type AsfSafeResult<R = unknown, I extends z.ZodType = z.ZodType, M = any> = SafeResult<any, AsfResult<R, I, M>>
