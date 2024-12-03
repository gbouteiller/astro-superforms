import { z } from "astro/zod";
import type { ActionError } from "astro:actions";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const zNewsletterValues = z.object({
  email: z.string().email().min(1),
});

export type NewsletterValues = z.infer<typeof zNewsletterValues>;

export type Message = ActionError["code"] | "SUCCESS";
