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

describe("transacciones", () => {
    let ana: TestUser;
    let beto: TestUser;

    // Usuarios nuevos para cada prueba
    beforeEach(async () => {
        ana = await createUser("Ana");
        beto = await createUser("Beto");
    });

    it("crea una transacción con su categoría", async () => {
        const response = await request(app)
            .post("/api/transactions")
            .set(auth(ana))
            .send({
                type: "EXPENSE",
                amount: 500,
                description: "Almuerzo",
                date: "2026-11-15",
                categoryId: await categoryId(ana, "Comida"),
            });

        expect(response.status).toBe(201);
        expect(response.body.amount).toBe("500");
        expect(response.body.currency).toBe("DOP");
        expect(response.body.category.name).toBe("Comida");
    });

    it.each([
        ["un monto en cero", { amount: 0 }],
        ["un monto negativo", { amount: -5 }],
        ["una descripción vacía", { description: "   " }],
        ["un tipo inválido", { type: "OTRO" }],
    ])("rechaza %s", async (_label, changes) => {
        const response = await request(app)
            .post("/api/transactions")
            .set(auth(ana))
            .send({
                type: "EXPENSE",
                amount: 100,
                description: "Prueba",
                ...changes,
            });

        expect(response.status).toBe(400);
    });

    it("no acepta la categoría de otro usuario", async () => {
        const response = await request(app)
            .post("/api/transactions")
            .set(auth(ana))
            .send({
                type: "EXPENSE",
                amount: 100,
                description: "Prueba",
                categoryId: await categoryId(beto, "Comida"),
            });

        expect(response.status).toBe(400);
    });

    it("pide el token", async () => {
        const response = await request(app).get("/api/transactions");

        expect(response.status).toBe(401);
    });

    it("cada usuario solo ve sus transacciones", async () => {
        await addTransaction(ana);

        const response = await request(app)
            .get("/api/transactions")
            .set(auth(beto));

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it("si dos tienen la misma fecha, va primero la creada más tarde", async () => {
        await addTransaction(ana, { description: "primera", date: "2026-11-15" });
        await addTransaction(ana, { description: "segunda", date: "2026-11-15" });

        const response = await request(app)
            .get("/api/transactions")
            .set(auth(ana));

        const descriptions = response.body.map(
            (transaction: { description: string }) => transaction.description,
        );

        expect(descriptions).toEqual(["segunda", "primera"]);
    });

    describe("filtros", () => {
        beforeEach(async () => {
            await addTransaction(ana, {
                description: "A",
                date: "2026-11-10",
                categoryId: await categoryId(ana, "Comida"),
            });
            await addTransaction(ana, { description: "B", date: "2026-11-20" });
            await addTransaction(ana, {
                description: "C",
                type: "INCOME",
                date: "2026-11-25",
                categoryId: await categoryId(ana, "Salario"),
            });
        });

        async function listDescriptions(query: string) {
            const response = await request(app)
                .get(`/api/transactions?${query}`)
                .set(auth(ana));

            expect(response.status).toBe(200);

            return response.body.map(
                (transaction: { description: string }) => transaction.description,
            );
        }

        it("por tipo", async () => {
            expect(await listDescriptions("type=INCOME")).toEqual(["C"]);
            expect(await listDescriptions("type=EXPENSE")).toEqual(["B", "A"]);
        });

        it("por categoría, y las que no tienen categoría", async () => {
            const comida = await categoryId(ana, "Comida");

            expect(await listDescriptions(`categoryId=${comida}`)).toEqual(["A"]);
            expect(await listDescriptions("categoryId=none")).toEqual(["B"]);
        });

        it("por fechas, con los extremos incluidos", async () => {
            expect(await listDescriptions("from=2026-11-15")).toEqual(["C", "B"]);
            expect(await listDescriptions("to=2026-11-20")).toEqual(["B", "A"]);
            expect(
                await listDescriptions("from=2026-11-20&to=2026-11-20"),
            ).toEqual(["B"]);
        });

        it("combinados", async () => {
            expect(
                await listDescriptions("type=EXPENSE&from=2026-11-15"),
            ).toEqual(["B"]);
        });

        it.each([
            "type=OTRO",
            "categoryId=abc",
            "from=15-11-2026",
            "to=hoy",
        ])("rechaza el filtro inválido %s", async (query) => {
            const response = await request(app)
                .get(`/api/transactions?${query}`)
                .set(auth(ana));

            expect(response.status).toBe(400);
        });
    });

    it("edita una transacción propia y no una ajena", async () => {
        const created = await addTransaction(ana);

        const byBeto = await request(app)
            .patch(`/api/transactions/${created.id}`)
            .set(auth(beto))
            .send({ description: "Hackeada" });

        expect(byBeto.status).toBe(404);

        const byAna = await request(app)
            .patch(`/api/transactions/${created.id}`)
            .set(auth(ana))
            .send({ description: "Nueva", amount: 250 });

        expect(byAna.status).toBe(200);
        expect(byAna.body.description).toBe("Nueva");
        expect(byAna.body.amount).toBe("250");
    });

    it("elimina una transacción propia y no una ajena", async () => {
        const created = await addTransaction(ana);

        const byBeto = await request(app)
            .delete(`/api/transactions/${created.id}`)
            .set(auth(beto));

        expect(byBeto.status).toBe(404);

        const byAna = await request(app)
            .delete(`/api/transactions/${created.id}`)
            .set(auth(ana));

        expect(byAna.status).toBe(204);

        const again = await request(app)
            .delete(`/api/transactions/${created.id}`)
            .set(auth(ana));

        expect(again.status).toBe(404);
    });
});