import z from "zod";

export const RegisterBodySchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(1, {
      message: "Password cannot be empty",
    }),
    confirmPassword: z.string().min(1, {
      message: "Confirm password cannot be empty",
    }),
  })
  .superRefine((data, ctx) => {
    const pwd = data.password;

    if (pwd.length < 8) {
      ctx.addIssue({
        path: ["password"],
        code: z.ZodIssueCode.custom,
        message: "Must be at least 8 characters",
      });
    }

    if (!/[A-Z]/.test(pwd)) {
      ctx.addIssue({
        path: ["password"],
        code: z.ZodIssueCode.custom,
        message: "Must contain at least one uppercase letter",
      });
    }

    if (!/[0-9]/.test(pwd)) {
      ctx.addIssue({
        path: ["password"],
        code: z.ZodIssueCode.custom,
        message: "Must contain at least one number",
      });
    }

    if (!/[^A-Za-z0-9]/.test(pwd)) {
      ctx.addIssue({
        path: ["password"],
        code: z.ZodIssueCode.custom,
        message: "Must contain at least one special character",
      });
    }

    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
      });
    }
  });

export type RegisterBody = z.TypeOf<typeof RegisterBodySchema>;

export const LoginBodySchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(1, {
      message: "Password cannot be empty",
    }),
  })
  .strict();

export type LoginBody = z.TypeOf<typeof LoginBodySchema>;