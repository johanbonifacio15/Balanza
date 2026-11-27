import { z } from "zod";

export const createBudgetSchema = z.object({
    categoryId: z.number().int().positive(),
    amount: z.number().positive(),
    currency: z.enum(["DOP", "USD"]).optional(),
});

// Solo se edita el limite
export const updateBudgetSchema = z.object({
    amount: z.number().positive(),
});

// Mes que se consulta 
// formato AAAA-MM
export const monthQuerySchema = z.object({
    month: z
        .string()
        .regex(/^\d{4}-(0[1-9]|1[0-2])$/)
        .optional(),
});