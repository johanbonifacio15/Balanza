import { Router } from "express";
import { parseId } from "../../lib/parseId";
import { prisma } from "../../lib/prisma";
import {
    createBudgetSchema,
    monthQuerySchema,
    updateBudgetSchema,
} from "./budgets.schemas";

export const budgetsRouter = Router();

// Datos de la categoria que viajan junto a cada presupuesto
const withCategory = {
    category: { select: { id: true, name: true, color: true } },
} as const;

function getMonthRange(month?: string) {
    const now = new Date();
    const year = month ? Number(month.slice(0, 4)) : now.getUTCFullYear();
    const monthNumber = month
        ? Number(month.slice(5, 7))
        : now.getUTCMonth() + 1;

    return {
        start: new Date(Date.UTC(year, monthNumber - 1, 1)),
        end: new Date(Date.UTC(year, monthNumber, 1)),
    };
}

// GET /api/budgets
budgetsRouter.get("/", async (req, res) => {
    const query = monthQuerySchema.safeParse(req.query);

    if (!query.success) {
        res.status(400).json({ error: "Mes inválido, usa el formato AAAA-MM" });
        return;
    }

    const { start, end } = getMonthRange(query.data.month);

    const budgets = await prisma.budget.findMany({
        where: { userId: req.userId },
        include: withCategory,
        orderBy: { category: { name: "asc" } },
    });

    const spending = await prisma.transaction.groupBy({
        by: ["categoryId", "currency"],
        where: {
            userId: req.userId,
            type: "EXPENSE",
            date: { gte: start, lt: end },
            categoryId: { not: null },
        },
        _sum: { amount: true },
    });

    const result = budgets.map((budget) => {
        const row = spending.find(
            (item) =>
                item.categoryId === budget.categoryId &&
                item.currency === budget.currency,
        );

        return { ...budget, spent: row?._sum.amount?.toFixed(2) ?? "0.00" };
    });

    res.json(result);
});

// POST /api/budgets
budgetsRouter.post("/", async (req, res) => {
    const result = createBudgetSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            error: "Datos inválidos",
            details: result.error.issues,
        });
        return;
    }

    const category = await prisma.category.findFirst({
        where: { id: result.data.categoryId, userId: req.userId },
    });

    if (!category) {
        res.status(400).json({ error: "Categoría inválida" });
        return;
    }

    const currency = result.data.currency ?? "DOP";

    const duplicated = await prisma.budget.findFirst({
        where: {
            userId: req.userId,
            categoryId: result.data.categoryId,
            currency,
        },
    });

    if (duplicated) {
        res.status(409).json({
            error: "Esa categoría ya tiene un presupuesto en esa moneda",
        });
        return;
    }

    const budget = await prisma.budget.create({
        data: { ...result.data, currency, userId: req.userId },
        include: withCategory,
    });

    res.status(201).json(budget);
});

// PATCH /api/budgets/:id: cambia el limite
budgetsRouter.patch("/:id", async (req, res) => {
    const id = parseId(req.params.id);

    if (!id) {
        res.status(400).json({ error: "ID inválido" });
        return;
    }

    const result = updateBudgetSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            error: "Datos inválidos",
            details: result.error.issues,
        });
        return;
    }

    const existing = await prisma.budget.findFirst({
        where: { id, userId: req.userId },
    });

    if (!existing) {
        res.status(404).json({ error: "Presupuesto no encontrado" });
        return;
    }

    const budget = await prisma.budget.update({
        where: { id },
        data: result.data,
        include: withCategory,
    });

    res.json(budget);
});

// DELETE /api/budgets/:id
budgetsRouter.delete("/:id", async (req, res) => {
    const id = parseId(req.params.id);

    if (!id) {
        res.status(400).json({ error: "ID inválido" });
        return;
    }

    const existing = await prisma.budget.findFirst({
        where: { id, userId: req.userId },
    });

    if (!existing) {
        res.status(404).json({ error: "Presupuesto no encontrado" });
        return;
    }

    await prisma.budget.delete({ where: { id } });

    res.status(204).send();
});