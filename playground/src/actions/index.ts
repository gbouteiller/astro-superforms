import {zSigninValues} from "@/lib/auth"
import {defineAsfAction} from "asf:actions"

export const server = {
  auth: {
    signin: defineAsfAction({
      input: zSigninValues,
      handler: () => {},
    }),
  },
}
