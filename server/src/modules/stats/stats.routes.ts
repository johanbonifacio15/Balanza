import { Router } from "express";
import { getMonthRange } from "../../lib/months";
import { prisma } from "../../lib/prisma";
import { byCategoryQuerySchema, monthlyQuerySchema } from "./stats.schemas";

export const statsRouter = Router();

// Redondea a 2 decimales
function round(value: number) {
    return Math.round(value * 100) / 100;
}

// GET /api/stats/by-category
// Gasto del mes agrupado por categoria de mayor a menor
statsRouter.get("/by-category", async (req, res) => {
    const query = byCategoryQuerySchema.safeParse(req.query);

    if (!query.success) {
        res.status(400).json({ error: "Parámetros inválidos" });
        return;
    }

    const { start, end } = getMonthRange(query.data.month);

    const totals = await prisma.transaction.groupBy({
        by: ["categoryId"],
        where: {
            userId: req.userId,
            type: "EXPENSE",
            currency: query.data.currency,
            date: { gte: start, lt: end },
        },
        _sum: { amount: true },
    });

    const categories = await prisma.category.findMany({
        where: { userId: req.userId },
        select: { id: true, name: true, color: true },
    });

    const result = totals
        .map((row) => {
            const category = categories.find((item) => item.id === row.categoryId);

            return {
                categoryId: row.categoryId,
                name: category?.name ?? "Sin categoría",
                color: category?.color ?? "#94a3b8",
                total: round(Number(row._sum.amount ?? 0)),
            };
        })
        .sort((a, b) => b.total - a.total);

    res.json(result);
});

// GET /api/stats/monthly
// Ingresos y gastos de los ultimos N meses
statsRouter.get("/monthly", async (req, res) => {
    const query = monthlyQuerySchema.safeParse(req.query);

    if (!query.success) {
        res.status(400).json({ error: "Parámetros inválidos" });
        return;
    }

    const { months, currency } = query.data;
    const now = new Date();

    // Desde el primer día del mes más antiguo hasta el final del actual
    const start = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (months - 1), 1),
    );
    const end = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1),
    );

    const transactions = await prisma.transaction.findMany({
        where: { userId: req.userId, currency, date: { gte: start, lt: end } },
        select: { type: true, amount: true, date: true },
    });

    // Uno por mes aunque ese mes no tenga movimientos
    const buckets = new Map<
        string,
        { month: string; income: number; expense: number }
    >();

    for (let i = 0; i < months; i++) {
        const date = new Date(
            Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + i, 1),
        );
        const key = date.toISOString().slice(0, 7);

        buckets.set(key, { month: key, income: 0, expense: 0 });
    }

    for (const transaction of transactions) {
        const bucket = buckets.get(transaction.date.toISOString().slice(0, 7));

        if (!bucket) continue;

        const amount = Number(transaction.amount);

        if (transaction.type === "INCOME") {
            bucket.income += amount;
        } else {
            bucket.expense += amount;
        }
    }

    res.json(
        [...buckets.values()].map((bucket) => ({
            ...bucket,
            income: round(bucket.income),
            expense: round(bucket.expense),
        })),
    );
});