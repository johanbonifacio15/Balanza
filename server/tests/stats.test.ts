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

describe("estadísticas", () => {
    let ana: TestUser;

    beforeEach(async () => {
        ana = await createUser("Ana");
    });

    it("pide el token", async () => {
        const byCategory = await request(app).get("/api/stats/by-category");
        const monthly = await request(app).get("/api/stats/monthly");

        expect(byCategory.status).toBe(401);
        expect(monthly.status).toBe(401);
    });

    describe("por categoría", () => {
        it("suma los gastos del mes por categoría, de mayor a menor", async () => {
            const comida = await categoryId(ana, "Comida");
            const transporte = await categoryId(ana, "Transporte");

            await addTransaction(ana, { amount: 300, categoryId: comida });
            await addTransaction(ana, { amount: 200, categoryId: comida });
            await addTransaction(ana, { amount: 100, categoryId: transporte });
            await addTransaction(ana, { amount: 5000, type: "INCOME", categoryId: comida });

            const response = await request(app)
                .get("/api/stats/by-category")
                .set(auth(ana));

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject([
                { name: "Comida", total: 500 },
                { name: "Transporte", total: 100 },
            ]);
        });

        it("agrupa los gastos sin categoría", async () => {
            await addTransaction(ana, { amount: 80 });

            const response = await request(app)
                .get("/api/stats/by-category")
                .set(auth(ana));

            expect(response.body).toMatchObject([
                { categoryId: null, name: "Sin categoría", total: 80 },
            ]);
        });

        it("separa las monedas", async () => {
            await addTransaction(ana, { amount: 40, currency: "USD" });

            const dop = await request(app)
                .get("/api/stats/by-category")
                .set(auth(ana));

            const usd = await request(app)
                .get("/api/stats/by-category?currency=USD")
                .set(auth(ana));

            expect(dop.body).toEqual([]);
            expect(usd.body).toMatchObject([{ total: 40 }]);
        });

        it.each(["month=2026-13", "currency=EUR"])(
            "rechaza el parámetro inválido %s",
            async (query) => {
                const response = await request(app)
                    .get(`/api/stats/by-category?${query}`)
                    .set(auth(ana));

                expect(response.status).toBe(400);
            },
        );
    });

    describe("evolución mensual", () => {
        it("devuelve 6 meses terminando en el actual, con ceros donde no hay movimientos", async () => {
            await addTransaction(ana, { type: "INCOME", amount: 1000 });
            await addTransaction(ana, { amount: 400 });

            const response = await request(app)
                .get("/api/stats/monthly")
                .set(auth(ana));

            const currentMonth = new Date().toISOString().slice(0, 7);

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(6);
            expect(response.body.at(-1)).toEqual({
                month: currentMonth,
                income: 1000,
                expense: 400,
            });

            const earlier = response.body.slice(0, -1);

            expect(
                earlier.every(
                    (month: { income: number; expense: number }) =>
                        month.income === 0 && month.expense === 0,
                ),
            ).toBe(true);
        });

        it("respeta la cantidad de meses pedida", async () => {
            const response = await request(app)
                .get("/api/stats/monthly?months=3")
                .set(auth(ana));

            expect(response.body).toHaveLength(3);
        });

        it.each(["months=0", "months=13", "currency=EUR"])(
            "rechaza el parámetro inválido %s",
            async (query) => {
                const response = await request(app)
                    .get(`/api/stats/monthly?${query}`)
                    .set(auth(ana));

                expect(response.status).toBe(400);
            },
        );
    });
});