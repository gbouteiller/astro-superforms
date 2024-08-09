import {zSigninValues} from "@/lib/auth"
import {defineAsfAction} from "asf:actions"
import {message} from "sveltekit-superforms"

export const server = {
  auth: {
    signin: defineAsfAction({
      input: zSigninValues,
      handler: ({username, password}, {form, redirect}) => {
        return redirect(302, "/")
        return message(form, {code: "SIGNIN_FAIL", text: "Signed in fail"}, {status: 400})
        return message(form, {code: "SIGNIN_SUCCESS", text: "Signed in successfully"})
      },
    }),
  },
}
