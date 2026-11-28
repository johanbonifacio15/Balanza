import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
    addTransaction,
    app,
    auth,
    categoryId,
    cleanTestData,
    createUser,
} from "./helpers";
import type { TestUser } from "./helpers";

beforeAll(async () => {
    await cleanTestData();
});

afterAll(async () => {
    await cleanTestData();
});

describe("presupuestos", () => {
    let ana: TestUser;
    let beto: TestUser;

    beforeEach(async () => {
        ana = await createUser("Ana");
        beto = await createUser("Beto");
    });

    // Crea un presupuesto para una categoria del usuario por nombre
    async function createBudget(
        user: TestUser,
        category: string,
        amount = 2000,
        currency?: string,
    ) {
        return request(app)
            .post("/api/budgets")
            .set(auth(user))
            .send({
                categoryId: await categoryId(user, category),
                amount,
                ...(currency ? { currency } : {}),
            });
    }

    it("crea un presupuesto", async () => {
        const response = await createBudget(ana, "Comida");

        expect(response.status).toBe(201);
        expect(response.body.amount).toBe("2000");
        expect(response.body.currency).toBe("DOP");
        expect(response.body.category.name).toBe("Comida");
    });

    it("no permite dos presupuestos de la misma categoría y moneda", async () => {
        await createBudget(ana, "Comida");

        const duplicated = await createBudget(ana, "Comida");
        const otherCurrency = await createBudget(ana, "Comida", 50, "USD");

        expect(duplicated.status).toBe(409);
        expect(otherCurrency.status).toBe(201);
    });

    it("rechaza la categoría de otro usuario y los montos inválidos", async () => {
        const foreign = await request(app)
            .post("/api/budgets")
            .set(auth(ana))
            .send({ categoryId: await categoryId(beto, "Comida"), amount: 1000 });

        const invalid = await createBudget(ana, "Comida", 0);

        expect(foreign.status).toBe(400);
        expect(invalid.status).toBe(400);
    });

    it("calcula lo gastado este mes solo con gastos de esa categoría y moneda", async () => {
        await createBudget(ana, "Comida", 1000);

        const comida = await categoryId(ana, "Comida");
        const transporte = await categoryId(ana, "Transporte");

        await addTransaction(ana, { amount: 300, categoryId: comida });
        await addTransaction(ana, { amount: 200, categoryId: comida });
        await addTransaction(ana, { amount: 50, currency: "USD", categoryId: comida });
        await addTransaction(ana, { amount: 999, type: "INCOME", categoryId: comida });
        await addTransaction(ana, { amount: 70, categoryId: transporte });

        const response = await request(app).get("/api/budgets").set(auth(ana));

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].spent).toBe("500.00");
    });

    it("consulta otro mes y rechaza un mes inválido", async () => {
        await createBudget(ana, "Comida");
        await addTransaction(ana, { categoryId: await categoryId(ana, "Comida") });

        const oldMonth = await request(app)
            .get("/api/budgets?month=2020-01")
            .set(auth(ana));

        const invalid = await request(app)
            .get("/api/budgets?month=2026-13")
            .set(auth(ana));

        expect(oldMonth.body[0].spent).toBe("0.00");
        expect(invalid.status).toBe(400);
    });

    it("cada usuario solo ve sus presupuestos", async () => {
        await createBudget(ana, "Comida");

        const response = await request(app).get("/api/budgets").set(auth(beto));

        expect(response.body).toEqual([]);
    });

    it("edita y elimina un presupuesto propio, y no uno ajeno", async () => {
        const created = await createBudget(ana, "Comida");
        const id = created.body.id;

        const editedByBeto = await request(app)
            .patch(`/api/budgets/${id}`)
            .set(auth(beto))
            .send({ amount: 1 });

        const deletedByBeto = await request(app)
            .delete(`/api/budgets/${id}`)
            .set(auth(beto));

        expect(editedByBeto.status).toBe(404);
        expect(deletedByBeto.status).toBe(404);

        const edited = await request(app)
            .patch(`/api/budgets/${id}`)
            .set(auth(ana))
            .send({ amount: 3000 });

        expect(edited.status).toBe(200);
        expect(edited.body.amount).toBe("3000");

        const deleted = await request(app)
            .delete(`/api/budgets/${id}`)
            .set(auth(ana));

        expect(deleted.status).toBe(204);
    });

    it("se borra junto con su categoría", async () => {
        const created = await createBudget(ana, "Comida");
        const id = created.body.id;

        await request(app)
            .delete(`/api/categories/${await categoryId(ana, "Comida")}`)
            .set(auth(ana));

        const response = await request(app).get("/api/budgets").set(auth(ana));

        expect(response.body.some((budget: { id: number }) => budget.id === id)).toBe(false);
    });
});