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

const dateSchema = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine((value) => !Number.isNaN(Date.parse(value)));

// Filtros opcionales de la lista
export const listTransactionsQuerySchema = z.object({
    type: z.enum(["INCOME", "EXPENSE"]).optional(),
    categoryId: z
        .union([z.literal("none"), z.coerce.number().int().positive()])
        .optional(),
    from: dateSchema.optional(),
    to: dateSchema.optional(),
});