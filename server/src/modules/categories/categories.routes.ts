import { Router } from "express";
import { parseId } from "../../lib/parseId";
import { prisma } from "../../lib/prisma";
import {
    createCategorySchema,
    updateCategorySchema,
} from "./categories.schemas";
import { DEFAULT_CATEGORIES } from "./default-categories";

export const categoriesRouter = Router();

// GET /api/categories
categoriesRouter.get("/", async (req, res) => {
    const categories = await prisma.category.findMany({
        where: { userId: req.userId },
        orderBy: { name: "asc" },
    });

    res.json(categories);
});

// POST /api/categories
categoriesRouter.post("/", async (req, res) => {
    const result = createCategorySchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            error: "Datos inválidos",
            details: result.error.issues,
        });
        return;
    }

    // Busca un nombre repetido
    const duplicated = await prisma.category.findFirst({
        where: {
            userId: req.userId,
            name: { equals: result.data.name, mode: "insensitive" },
        },
    });

    if (duplicated) {
        res.status(409).json({ error: "Ya tienes una categoría con ese nombre" });
        return;
    }

    const category = await prisma.category.create({
        data: { ...result.data, userId: req.userId },
    });

    res.status(201).json(category);
});

// POST /api/categories/defaults
categoriesRouter.post("/defaults", async (req, res) => {
    const existing = await prisma.category.findMany({
        where: { userId: req.userId },
        select: { name: true },
    });

    const names = new Set(existing.map((category) => category.name.toLowerCase()));
    const missing = DEFAULT_CATEGORIES.filter(
        (category) => !names.has(category.name.toLowerCase()),
    );

    if (missing.length > 0) {
        await prisma.category.createMany({
            data: missing.map((category) => ({
                ...category,
                userId: req.userId,
            })),
        });
    }

    const categories = await prisma.category.findMany({
        where: { userId: req.userId },
        orderBy: { name: "asc" },
    });

    res.status(201).json(categories);
});

// PATCH /api/categories/:id
categoriesRouter.patch("/:id", async (req, res) => {
    const id = parseId(req.params.id);

    if (!id) {
        res.status(400).json({ error: "ID inválido" });
        return;
    }

    const result = updateCategorySchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            error: "Datos inválidos",
            details: result.error.issues,
        });
        return;
    }

    const existing = await prisma.category.findFirst({
        where: { id, userId: req.userId },
    });

    if (!existing) {
        res.status(404).json({ error: "Categoría no encontrada" });
        return;
    }

    if (result.data.name) {
        // Mismo chequeo de nombre repetido
        const duplicated = await prisma.category.findFirst({
            where: {
                userId: req.userId,
                id: { not: id },
                name: { equals: result.data.name, mode: "insensitive" },
            },
        });

        if (duplicated) {
            res.status(409).json({
                error: "Ya tienes una categoría con ese nombre",
            });
            return;
        }
    }

    const category = await prisma.category.update({
        where: { id },
        data: result.data,
    });

    res.json(category);
});

// DELETE /api/categories/:id
categoriesRouter.delete("/:id", async (req, res) => {
    const id = parseId(req.params.id);

    if (!id) {
        res.status(400).json({ error: "ID inválido" });
        return;
    }

    const existing = await prisma.category.findFirst({
        where: { id, userId: req.userId },
    });

    if (!existing) {
        res.status(404).json({ error: "Categoría no encontrada" });
        return;
    }

    // Sus transacciones se quedan sin categoria
    await prisma.category.delete({ where: { id } });

    res.status(204).send();
});