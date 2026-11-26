import { z } from "zod";

export const createCategorySchema = z.object({
    name: z.string().trim().min(1).max(30),
    color: z
        .string()
        .regex(/^#[0-9a-fA-F]{6}$/)
        .optional(),
});

export const updateCategorySchema = createCategorySchema.partial();