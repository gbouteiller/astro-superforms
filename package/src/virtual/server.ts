import {ActionFailure, redirect, Redirect, type RedirectStatus} from "@sveltejs/kit"
import type {ActionAPIContext, MaybePromise} from "astro/actions/runtime/utils.js"
import {defineAction, type ActionHandler} from "astro:actions"
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
  const formHandler = (async (input: z.infer<I>, context: ActionAPIContext) => {
    const form = await superValidate(context.request, zod(p.input))
    try {
      const result = await p.handler(input, {...context, form, redirect})
      if (result instanceof ActionFailure) return {type: "failure", status: result.status, data: {form, payload: result.data}}
      return {type: "success", status: result ? 200 : 204, data: {form, payload: result}}
    } catch (err) {
      if (err instanceof Redirect) return {type: "redirect", ...err}
      return {type: "error", status: 500, data: {error: err}}
    }
  }) as ActionHandler<I, AsfActionResult<R, I, M>>
  return defineAction<AsfActionResult<R, I, M>, "form", I>({accept: "form", handler: formHandler})
}

// UTILS ***********************************************************************************************************************************
export function getAstroActionRedirectLocation<R, I extends z.ZodType, M = any>(actionResult: AstroActionResult<R, I, M> | undefined) {
  return isAstroActionRedirect(actionResult) ? actionResult?.data?.location : undefined
}

export function getAstroActionResultForm<R, I extends z.ZodType, M = any>(actionResult: AstroActionResult<R, I, M> | undefined) {
  return isAstroActionError(actionResult) || isAstroActionRedirect(actionResult) ? undefined : actionResult?.data.data.form
}

export function isAstroActionError(actionResult: AstroActionResult | undefined): actionResult is AstroActionError {
  return actionResult?.data.type === "error"
}

export function isAstroActionFailure(actionResult: AstroActionResult | undefined): actionResult is AstroActionFailure {
  return actionResult?.data.type === "failure"
}

export function isAstroActionRedirect(actionResult: AstroActionResult | undefined): actionResult is AstroActionRedirect {
  return actionResult?.data.type === "redirect"
}

export function isAstroActionSuccess(actionResult: AstroActionResult | undefined): actionResult is AstroActionSuccess {
  return actionResult?.data.type === "success"
}

// VALIDATE ********************************************************************************************************************************
export async function asfValidate<R, I extends z.ZodType, M = any>(
  request: Request,
  actionResult: AstroActionResult<R, I, M> | undefined,
  input: I
): Promise<AsfSuperValidated<I, M>> {
  const form = await superValidate(request, zod(input))
  return {...form, ...(getAstroActionResultForm(actionResult) ?? {})}
}

// TYPES ***********************************************************************************************************************************
export type AsfSuperValidated<I extends z.ZodType = z.ZodType, M = any> = SuperValidated<Infer<I>, M, InferIn<I>>

export type AsfActionResultError = {type: "error"; status: ErrorStatus}
export type AsfActionResultFailure<I extends z.ZodType = z.ZodType, M = any> = {
  type: "failure"
  status: ErrorStatus
  data: {form: AsfSuperValidated<I, M>}
}
export type AsfActionResultRedirect = {type: "redirect"; status: RedirectStatus; location: string}
export type AsfActionResultSuccess<R = unknown, I extends z.ZodType = z.ZodType, M = any> = {
  type: "success"
  status: 200
  data: {form: AsfSuperValidated<I, M>; result: R}
}
export type AsfActionResult<R = unknown, I extends z.ZodType = z.ZodType, M = any> =
  | AsfActionResultError
  | AsfActionResultFailure<I, M>
  | AsfActionResultRedirect
  | AsfActionResultSuccess<R, I, M>

export type AsfActionHandler<
  R = unknown,
  I extends z.ZodType = z.ZodType,
  M = any,
  F extends Record<string, unknown> | undefined = undefined,
> = (
  input: z.infer<I>,
  context: Omit<ActionAPIContext, "redirect"> & {form: AsfSuperValidated<I, M>; redirect: typeof redirect}
) => MaybePromise<R | ActionFailure<F> | Redirect>

export type AstroActionError = {data: AsfActionResultError; error: undefined}
export type AstroActionFailure<I extends z.ZodType = z.ZodType> = {data: AsfActionResultFailure<I>; error: undefined}
export type AstroActionRedirect = {data: AsfActionResultRedirect; error: undefined}
export type AstroActionSuccess<R = unknown, I extends z.ZodType = z.ZodType, M = any> = {
  data: AsfActionResultSuccess<R, I, M>
  error: undefined
}
export type AstroActionResult<R = unknown, I extends z.ZodType = z.ZodType, M = any> =
  | AstroActionError
  | AstroActionFailure<I>
  | AstroActionRedirect
  | AstroActionSuccess<R, I, M>
