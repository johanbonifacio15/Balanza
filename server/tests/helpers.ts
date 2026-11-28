import request from "supertest";
import { createApp } from "../src/app";
import { prisma } from "../src/lib/prisma";

export const app = createApp();

// Todos los usuarios de prueba usan este dominio:
export const TEST_DOMAIN = "@test.balanza";

export type TestUser = { id: number; token: string };

// Registra un usuario nuevo y devuelve su token
export async function createUser(name = "Tester"): Promise<TestUser> {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const response = await request(app)
        .post("/api/auth/register")
        .send({
            name,
            email: `user-${unique}${TEST_DOMAIN}`,
            password: "12345678",
        });

    return { id: response.body.user.id, token: response.body.token };
}

export function auth(user: TestUser) {
    return { Authorization: `Bearer ${user.token}` };
}

// Id de una categoria del usuario segun su nombre
export async function categoryId(user: TestUser, name: string) {
    const category = await prisma.category.findFirstOrThrow({
        where: { userId: user.id, name },
    });

    return category.id;
}

// Fecha de hoy en UTC, igual que la usa el servidor
export function today() {
    return new Date().toISOString().slice(0, 10);
}

// Crea una transacción por la API
export async function addTransaction(
    user: TestUser,
    data: Record<string, unknown> = {},
) {
    const response = await request(app)
        .post("/api/transactions")
        .set(auth(user))
        .send({
            type: "EXPENSE",
            amount: 100,
            description: "Prueba",
            date: today(),
            ...data,
        });

    return response.body;
}

// Borra todo lo creado por las pruebas en un orden que respeta las relaciones
export async function cleanTestData() {
    const users = await prisma.user.findMany({
        where: { email: { endsWith: TEST_DOMAIN } },
        select: { id: true },
    });

    const where = { userId: { in: users.map((user) => user.id) } };

    await prisma.budget.deleteMany({ where });
    await prisma.transaction.deleteMany({ where });
    await prisma.category.deleteMany({ where });
    await prisma.user.deleteMany({
        where: { id: { in: users.map((user) => user.id) } },
    });
}