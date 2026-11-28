import { Router } from "express";
import { parseId } from "../../lib/parseId";
import { prisma } from "../../lib/prisma";
import {
    createTransactionSchema,
    listTransactionsQuerySchema,
    updateTransactionSchema,
} from "./transactions.schemas";

export const transactionsRouter = Router();

const withCategory = {
    category: { select: { id: true, name: true, color: true } },
} as const;

async function categoryBelongsToUser(
    categoryId: number | null | undefined,
    userId: number,
) {
    if (categoryId === null || categoryId === undefined) {
        return true;
    }

    const category = await prisma.category.findFirst({
        where: { id: categoryId, userId },
    });

    return category !== null;
}

// GET /api/transactions?type=&categoryId=&from=&to=
// Lista las del usuario, las mas recientes primero, con filtros opcionales
transactionsRouter.get("/", async (req, res) => {
    const query = listTransactionsQuerySchema.safeParse(req.query);

    if (!query.success) {
        res.status(400).json({ error: "Filtros inválidos" });
        return;
    }

    const { type, categoryId, from, to } = query.data;

    const transactions = await prisma.transaction.findMany({
        where: {
            userId: req.userId,
            // Prisma ignora los filtros que llegan como undefined
            type,
            categoryId: categoryId === "none" ? null : categoryId,
            date: {
                gte: from ? new Date(`${from}T00:00:00.000Z`) : undefined,
                lte: to ? new Date(`${to}T00:00:00.000Z`) : undefined,
            },
        },
        include: withCategory,
        orderBy: [{ date: "desc" }, { id: "desc" }],
    });

    res.json(transactions);
});

// GET /api/transactions/:id
transactionsRouter.get("/:id", async (req, res) => {
    const id = parseId(req.params.id);

    if (!id) {
        res.status(400).json({ error: "ID inválido" });
        return;
    }

    const transaction = await prisma.transaction.findFirst({
        where: { id, userId: req.userId },
        include: withCategory,
    });

    if (!transaction) {
        res.status(404).json({ error: "Transacción no encontrada" });
        return;
    }

    res.json(transaction);
});

// POST /api/transactions
transactionsRouter.post("/", async (req, res) => {
    const result = createTransactionSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            error: "Datos inválidos",
            details: result.error.issues,
        });
        return;
    }

    if (!(await categoryBelongsToUser(result.data.categoryId, req.userId))) {
        res.status(400).json({ error: "Categoría inválida" });
        return;
    }

    const transaction = await prisma.transaction.create({
        data: { ...result.data, userId: req.userId },
        include: withCategory,
    });

    res.status(201).json(transaction);
});

// PATCH /api/transactions/:id
transactionsRouter.patch("/:id", async (req, res) => {
    const id = parseId(req.params.id);

    if (!id) {
        res.status(400).json({ error: "ID inválido" });
        return;
    }

    const result = updateTransactionSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            error: "Datos inválidos",
            details: result.error.issues,
        });
        return;
    }

    if (!(await categoryBelongsToUser(result.data.categoryId, req.userId))) {
        res.status(400).json({ error: "Categoría inválida" });
        return;
    }

    const existing = await prisma.transaction.findFirst({
        where: { id, userId: req.userId },
    });

    if (!existing) {
        res.status(404).json({ error: "Transacción no encontrada" });
        return;
    }

    const transaction = await prisma.transaction.update({
        where: { id },
        data: result.data,
        include: withCategory,
    });

    res.json(transaction);
});

// DELETE /api/transactions/:id
transactionsRouter.delete("/:id", async (req, res) => {
    const id = parseId(req.params.id);

    if (!id) {
        res.status(400).json({ error: "ID inválido" });
        return;
    }

    const existing = await prisma.transaction.findFirst({
        where: { id, userId: req.userId },
    });

    if (!existing) {
        res.status(404).json({ error: "Transacción no encontrada" });
        return;
    }

    await prisma.transaction.delete({ where: { id } });

    res.status(204).send();
});
