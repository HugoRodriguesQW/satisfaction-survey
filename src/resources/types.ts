import { z } from "zod";

export const stringSchema = z.string({ message: "Please fill out this field to continue." }).min(1, {
  message: "Please fill out this field to continue.",
});

export const emailSchema = stringSchema.email("Hmm, that doesn’t look like a valid email address.");

export const secretSchema = stringSchema
  .min(8, "Your password needs to be at least 8 characters long.")
  .refine((val) => (val.match(/[!@#$%^&*(),.?":{}|<>]/g)?.length || 0) >= 1, {
    message: "Include at least one special character to keep things secure.",
  })
  .refine((val) => (val.match(/[0-9]/g) || []).length >= 1, {
    message: "Add at least one number to make your password stronger.",
  });

export const nameSchema = stringSchema
  .min(3, "A username should be at least 3 characters long.")
  .max(20, "Keep it simple — 20 characters or fewer is best.")
  .regex(/^[a-zA-Z0-9_]+$/, "Use only letters, numbers, or underscores.");

export const codeSchema = z.string().length(4, "That code doesn’t look right. It should be 4 digits.");

export const loginSchema = z.object({
  email: stringSchema,
  secret: stringSchema,
});

export const registerSchema = z.object({
  email: emailSchema,
  secret: secretSchema,
  name: nameSchema,
});

export const recoverySchema = z.object({
  email: stringSchema,
});

export const emailCodeSchema = z.object({
  code: codeSchema,
});

export const repasswordSchema = z
  .object({
    secret: secretSchema,
    secret2: stringSchema,
  })
  .refine((data) => data.secret === data.secret2, {
    path: ["secret2"],
    message: "Make sure both passwords match.",
  });

export type schemaErrors = z.inferFlattenedErrors<
  typeof loginSchema & typeof registerSchema & typeof recoverySchema & typeof repasswordSchema & typeof emailCodeSchema
>["fieldErrors"] & { form?: string[] };
