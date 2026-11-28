import "dotenv/config";
import { afterAll } from "vitest";

// Desde aqui todo el codigo usa solo la base de pruebas
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
process.env.JWT_SECRET ??= "secreto-solo-para-las-pruebas";

// Cierra la conexion al terminar cada archivo
afterAll(async () => {
    const { prisma } = await import("../src/lib/prisma");

    await prisma.$disconnect();
});