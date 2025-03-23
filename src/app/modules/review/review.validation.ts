import { z } from "zod";

const reviewValidationSchema = z.object({
  campsiteId: z.string().min(1, "Campsite ID is required"),
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  comment: z.string().optional(),
});

export const reviewValidation = {
  reviewValidationSchema,
};
