import { z } from "zod";

/* ================= SEND EMAIL OTP ================= */
export const emailSendOtp = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    projectKey: z.string().min(1, "Project key is required").optional(),
  })
  .strict();

/* ================= VERIFY EMAIL OTP ================= */
export const emailVerifyOtp = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    otp: z
      .string()
      .min(1, "OTP is required")
      .regex(/^[0-9]{6}$/, "OTP must be a 6-digit number"),
    projectKey: z.string().min(1, "Project key is required"),
  })
  .strict();

/* ================= LOGIN WITH PASSWORD ================= */
export const loginWithPassword = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  })
  .strict();

/* ================= GOOGLE LOGIN ================= */
export const loginWithGoogleAccount = z
  .object({
    token: z.string().min(1, "Google token is required"),
  })
  .strict();

/* ================= EXPORT GROUP ================= */
export const login = {
  emailSendOtp,
  emailVerifyOtp,
  loginWithPassword,
  loginWithGoogleAccount,
};
