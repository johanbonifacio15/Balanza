import { z } from "zod";

export const createTransactionSchema = z.object({
    type: z.enum(["INCOME", "EXPENSE"]),
    amount: z.number().positive(),
    currency: z.enum(["DOP", "USD"]).optional(),
    description: z.string().trim().min(1).max(120),
    date: z.coerce.date().optional(),
    categoryId: z.number().int().positive().nullable().optional(),
});

export const updateTransactionSchema = createTransactionSchema.partial();