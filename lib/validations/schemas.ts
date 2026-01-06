import { z } from "zod";

// Ask Question Validation
export const askQuestionSchema = z.object({
  question: z.string()
    .min(3, "Question must be at least 3 characters")
    .max(500, "Question must be less than 500 characters")
    .trim(),
  conversationHistory: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).optional(),
});

// Entry Validation
export const createEntrySchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters")
    .trim(),
  content: z.any(), // TipTap JSON - validated separately
  technologyId: z.string().uuid("Invalid technology ID"),
});

export const updateEntrySchema = z.object({
  id: z.string().uuid(),
  title: z.string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters")
    .trim()
    .optional(),
  content: z.any().optional(),
  technologyId: z.string().uuid("Invalid technology ID").optional(),
});

// Technology Validation
export const createTechnologySchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters")
    .trim(),
  icon: z.string()
    .min(1, "Icon is required")
    .max(50, "Icon must be less than 50 characters"),
});

// Search Validation
export const searchSchema = z.object({
  query: z.string()
    .max(200, "Search query too long")
    .trim(),
  limit: z.number()
    .int()
    .min(1)
    .max(50)
    .default(10),
  technologyId: z.string().uuid().optional(),
});
