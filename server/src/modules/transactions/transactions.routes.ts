import {Router} from "express";
import {prisma} from "../../lib/prisma";
import {createTransactionSchema, updateTransactionSchema} from "./transactions.schemas";

export const transactionsRouter = Router();

function parseId(value: string) {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
}

// GET /api/transactions: lista

transactionsRouter.get("/", async (_req, res) => {

    const transactions = await prisma.transaction.findMany({
        orderBy: {date: "desc"},
    });
    res.json(transactions);
});

// GET /api/transactions/:id
transactionsRouter.get("/:id", async (req, res) => {
    const id = parseId(req.params.id);

    if (!id){
        res.status(400).json({ error: "ID inválido"});
        return;
    }

    const transaction = await prisma.transaction.findUnique({
        where: {id},
    });

    if (!transaction) {
        res.status(404).json({error: "Transacción no encontrada"});
        return;
    }

    res.json(transaction);
});

// POST /api/transactions
transactionsRouter.post("/", async(req, res) => {
    const result = createTransactionSchema.safeParse(req.body);

    if(!result.success){
        res.status(400).json({
            error: "Datos inválidos",
            details: result.error.issues,
        });
        return;
    }

    const transaction = await prisma.transaction.create({
        data: result.data,
    });

    res.status(201).json(transaction);
});

// PATCH /api/transactions/:id

transactionsRouter.patch("/:id", async(req, res) => {
    const id = parseId(req.params.id);
    if (!id) {
        res.status(400).json({error: "ID inválido"});
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

    const existing = await prisma.transaction.findUnique({
        where: {id},
    });
    
    if (!existing){
        res.status(404).json({error: "Transacción no encontrada"});
        return;
    }

    const transaction = await prisma.transaction.update({
        where: {id},
        data: result.data,
    });

    res.json(transaction);
});

// DELETE /api/transactions/:id
transactionsRouter.delete("/:id", async (req, res) => {
    const id = parseId(req.params.id);

    if (!id){
        res.status(400).json({ error: "ID inválido" });
        return;
    } 

    const existing = await prisma.transaction.findUnique({
        where: {id},
    });

    if (!existing){
        res.status(404).json({error: "Transacción no encontrada"});
        return;
    }

    await prisma.transaction.delete({where: {id}});
    res.status(204).send();

});
