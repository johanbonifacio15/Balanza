import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { DEFAULT_CATEGORIES } from "../src/modules/categories/default-categories";
import { app, auth, cleanTestData, createUser, TEST_DOMAIN } from "./helpers";

beforeAll(async () => {
    await cleanTestData();
});

afterAll(async () => {
    await cleanTestData();
});

describe("registro", () => {
    it("crea el usuario, devuelve un token y le da las categorías por defecto", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Ana",
                email: `ana-${Date.now()}${TEST_DOMAIN}`,
                password: "12345678",
            });

        expect(response.status).toBe(201);
        expect(typeof response.body.token).toBe("string");
        expect(response.body.user).not.toHaveProperty("passwordHash");

        const categories = await request(app)
            .get("/api/categories")
            .set({ Authorization: `Bearer ${response.body.token}` });

        expect(categories.body).toHaveLength(DEFAULT_CATEGORIES.length);
    });

    it("rechaza un correo repetido, sin importar las mayúsculas", async () => {
        const email = `repetido-${Date.now()}${TEST_DOMAIN}`;
        const body = { name: "Ana", email, password: "12345678" };

        await request(app).post("/api/auth/register").send(body);

        const response = await request(app)
            .post("/api/auth/register")
            .send({ ...body, email: email.toUpperCase() });

        expect(response.status).toBe(409);
    });

    it.each([
        ["un correo inválido", { name: "Ana", email: "no-es-correo", password: "12345678" }],
        ["una contraseña corta", { name: "Ana", email: `corta${TEST_DOMAIN}`, password: "123" }],
        ["un nombre vacío", { name: "", email: `sinnombre${TEST_DOMAIN}`, password: "12345678" }],
    ])("rechaza el registro con %s", async (_label, body) => {
        const response = await request(app).post("/api/auth/register").send(body);

        expect(response.status).toBe(400);
    });
});

describe("inicio de sesión", () => {
    const email = `login-${Date.now()}${TEST_DOMAIN}`;

    beforeAll(async () => {
        await request(app)
            .post("/api/auth/register")
            .send({ name: "Luis", email, password: "12345678" });
    });

    it("entra con las credenciales correctas", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({ email, password: "12345678" });

        expect(response.status).toBe(200);
        expect(typeof response.body.token).toBe("string");
        expect(response.body.user.email).toBe(email);
    });

    it("rechaza una contraseña incorrecta", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({ email, password: "incorrecta" });

        expect(response.status).toBe(401);
    });

    it("da el mismo error si el correo no existe", async () => {
        const wrongPassword = await request(app)
            .post("/api/auth/login")
            .send({ email, password: "incorrecta" });

        const unknownEmail = await request(app)
            .post("/api/auth/login")
            .send({ email: `nadie${TEST_DOMAIN}`, password: "12345678" });

        expect(unknownEmail.status).toBe(401);
        expect(unknownEmail.body).toEqual(wrongPassword.body);
    });
});

describe("sesión", () => {
    it("devuelve los datos del usuario con un token válido", async () => {
        const user = await createUser("Marta");

        const response = await request(app).get("/api/auth/me").set(auth(user));

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Marta");
    });

    it("rechaza las peticiones sin token o con un token falso", async () => {
        const withoutToken = await request(app).get("/api/auth/me");
        const fakeToken = await request(app)
            .get("/api/auth/me")
            .set({ Authorization: "Bearer token-falso" });

        expect(withoutToken.status).toBe(401);
        expect(fakeToken.status).toBe(401);
    });
});