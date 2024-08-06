import type {ActionAPIContext} from "astro/actions/runtime/utils.js"
import {ActionError, defineAction, type ActionClient, type ActionHandler} from "astro:actions"
import {superValidate, type Infer, type InferIn, type SuperValidated} from "sveltekit-superforms"
import {zod} from "sveltekit-superforms/adapters"
import type {z} from "zod"

// ACTION **********************************************************************************************************************************
export function defineAsfAction<R, I extends z.ZodType>(p: {input: I; handler: ActionHandler<I, R>}) {
  const formHandler = (async (input: z.infer<I>, context: ActionAPIContext) => {
    const form = await superValidate(context.request, zod(p.input))
    //context.locals.superforms = {form, message: () => }
    // context.locals.sv = form
    try {
      const result = await p.handler(input, context)
      if (result instanceof Response && [300, 301, 302, 303, 304, 307, 308].includes(result.status))
        return {type: "redirect", status: result.status, location: result.headers.get("location")}
      return {type: "success", status: 200, data: {form, result}}
    } catch (error_) {
      form.valid = false
      if (error_ instanceof ActionError) {
        const {code, status, message: text} = error_
        form.message = {code, text}
        return {type: "failure", status, data: {form}}
      }
      form.message = {code: "UNKNOWN_ERROR", text: (error_ as any).message}
      return {type: "error", status: 500, data: {form}}
    }
  }) as AsfActionHandler<I, R>
  return defineAction<AsfAction<I, R>, "form", I>({accept: "form", input: p.input, handler: formHandler})
}

// UTILS ***********************************************************************************************************************************
export function shouldRedirect<I extends z.ZodType, R>(actionResult: AsfResult<I, R>): actionResult is AsfRedirectResult {
  return actionResult?.data?.type === "redirect"
}

export function getRedirectLocation<I extends z.ZodType, R>(actionResult: AsfResult<I, R>) {
  return shouldRedirect(actionResult) ? actionResult?.data?.location : undefined
}

export function getResultForm<I extends z.ZodType, R>(actionResult: AsfResult<I, R>) {
  return shouldRedirect(actionResult) ? undefined : actionResult?.data?.data?.form
}

// VALIDATE ********************************************************************************************************************************
export async function asfValidate<R, I extends z.ZodType>(
  request: Request,
  result: AsfResult<I, R>,
  input: I
): Promise<AsfSuperValidated<I>> {
  const sv = await superValidate(request, zod(input))
  return {...sv, ...(getResultForm(result) ?? {})}
}

// TYPES ***********************************************************************************************************************************
export type AsfMessage = {code: string; text: string}
export type AsfSuperValidated<I extends z.ZodType> = SuperValidated<Infer<I>, AsfMessage, InferIn<I>>

export type AsfError<I extends z.ZodType> = {type: "error"; status: number; data: {form: AsfSuperValidated<I>}}
export type AsfFailure<I extends z.ZodType> = {type: "failure"; status: number; data: {form: AsfSuperValidated<I>}}
export type AsfRedirect = {type: "redirect"; status: 300 | 301 | 302 | 303 | 304 | 307 | 308; location: string}
export type AsfSuccess<I extends z.ZodType, R> = {type: "success"; status: 200; data: {form: AsfSuperValidated<I>; result: R}}
export type AsfAction<I extends z.ZodType, R> = AsfRedirect | AsfSuccess<I, R> | AsfFailure<I> | AsfError<I>

export type AsfActionHandler<I extends z.ZodType, R> = ActionHandler<I, AsfAction<I, R>>
export type AsfActionClient<I extends z.ZodType, R> = ActionClient<AsfAction<I, R>, "form", I>

export type AsfErrorResult<I extends z.ZodType> = {data: AsfError<I>; error: undefined}
export type AsfFailureResult<I extends z.ZodType> = {data: AsfFailure<I>; error: undefined}
export type AsfRedirectResult = {data: AsfRedirect; error: undefined}
export type AsfSuccessResult<I extends z.ZodType, R> = {data: AsfSuccess<I, R>; error: undefined}
export type AsfResult<I extends z.ZodType, R> =
  | AsfErrorResult<I>
  | AsfFailureResult<I>
  | AsfRedirectResult
  | AsfSuccessResult<I, R>
  | {data: undefined; error: ActionError<I>}
  | undefined
