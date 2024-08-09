const encoder = new TextEncoder()

// FAIL ************************************************************************************************************************************
export class ActionFailure<D extends Record<string, unknown> | undefined = undefined> {
  constructor(
    public status: ErrorStatus,
    public data: D
  ) {}
}

export function fail<D extends Record<string, unknown> | undefined = undefined>(status: ErrorStatus, data: D) {
  return new ActionFailure(status, data)
}

// JSON ************************************************************************************************************************************
export function json(data: any, init: ResponseInit) {
  // TODO deprecate this in favour of `Response.json` when it's
  // more widely supported
  const body = JSON.stringify(data)

  // we can't just do `text(JSON.stringify(data), init)` because
  // it will set a default `content-type` header. duplicated code
  // means less duplicated work
  const headers = new Headers(init?.headers)
  if (!headers.has("content-length")) headers.set("content-length", encoder.encode(body).byteLength.toString())

  if (!headers.has("content-type")) headers.set("content-type", "application/json")

  return new Response(body, {
    ...init,
    headers,
  })
}

// REDIRECT ********************************************************************************************************************************
export class Redirect {
  constructor(
    public status: RedirectStatus,
    public location: string
  ) {}
}

export function redirect(location: string | URL, status?: RedirectStatus) {
  throw new Redirect(status ?? 302, location.toString())
}

// TYPES ***********************************************************************************************************************************
export type ErrorStatus = NumericRange<400, 599>
export type RedirectStatus = NumericRange<300, 308>

export type NumericRange<
  START extends number,
  END extends number,
  ARR extends unknown[] = [],
  ACC extends number = never,
> = ARR["length"] extends END
  ? ACC | START | END
  : NumericRange<START, END, [...ARR, 1], ARR[START] extends undefined ? ACC : ACC | ARR["length"]>
