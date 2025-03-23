import { z } from "zod";

const manuscriptCategoryEnum = z.enum([
  "FICTION",
  "NON_FICTION",
  "TECHNOLOGY",
  "POETRY",
  "SCREENPLAY",
  "BUSINESS",
  "NATURE",
  "TRAVEL",
  "ARTICLE",
]);

const manuscriptSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title is too long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(600, "Description is too long"),
  category: manuscriptCategoryEnum,
});

export const manuscriptValidationSchema = {
  manuscriptSchema,
};
