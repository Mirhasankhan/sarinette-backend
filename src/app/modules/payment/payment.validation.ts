import { z } from "zod";

const cardZodSchema = z.object({
  cardNumber: z
    .string()
    .min(13, "Card number must be at least 13 digits")
    .max(19, "Card number must be at most 19 digits")
    .regex(/^\d+$/, "Card number must contain only digits"),
  holderName: z
    .string()
    .min(3, "Holder name must be at least 3 characters")
    .max(50, "Holder name must be at most 50 characters"),
  endMonth: z
    .number()
    .min(1, "Month must be between 1 and 12")
    .max(12, "Month must be between 1 and 12"),
  endYear: z
    .number()
    .min(new Date().getFullYear(), "Year must not be in the past")
    .max(new Date().getFullYear() + 15, "Year is too far in the future"),
  cvc: z.string().regex(/^\d{3,4}$/, "CVC must be 3 or 4 digits"),
});

export const subscriptionValidation = {
  cardZodSchema,
};
