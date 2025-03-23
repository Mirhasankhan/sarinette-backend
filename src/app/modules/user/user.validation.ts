import { z } from "zod";

const userRegisterValidationSchema = z.object({
  userName: z.string().min(2, "User name must be at least 2 characters long"),
  publicName: z
    .string()
    .min(2, "Public name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

const userUpdateValidationSchema = z.object({
  userName: z
    .string()
    .min(2, "First name must be at least 2 characters long")
    .optional(),
  publicName: z
    .string()
    .min(2, "Public name must be at least 2 characters long")
    .regex(/^@/, "Public name must start with '@'")
    .regex(/^\S+$/, "Public name cannot contain spaces")
    .optional(),
  phone: z.string().min(10, "Mobile Number at least 10 Digit long").optional(),
});

export const userValidation = {
  userRegisterValidationSchema,
  userUpdateValidationSchema,
};
