import { z } from "zod";
import { monthQuerySchema } from "../budgets/budgets.schemas";

const currencySchema = z.enum(["DOP", "USD"]).default("DOP");

// Reutiliza la validacion del mes y suma la moneda
export const byCategoryQuerySchema = monthQuerySchema.extend({
    currency: currencySchema,
});

// Cuantos meses mostrar
export const monthlyQuerySchema = z.object({
    months: z.coerce.number().int().min(1).max(12).default(6),
    currency: currencySchema,
});