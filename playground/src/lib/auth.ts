import { z } from "astro/zod";

export const zSigninValues = z.object({
  username: z.string().email().min(1),
  password: z.string().min(3),
});

export type SigninValues = z.infer<typeof zSigninValues>;
