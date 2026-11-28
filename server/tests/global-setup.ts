import "dotenv/config";
import { execSync } from "node:child_process";

export default function setup() {
    const testUrl = process.env.TEST_DATABASE_URL;

    if (!testUrl) {
        throw new Error(
            "Falta TEST_DATABASE_URL en el .env: las pruebas necesitan su propia base de datos",
        );
    }

    if (testUrl === process.env.DATABASE_URL) {
        throw new Error(
            "TEST_DATABASE_URL no puede ser igual a DATABASE_URL: las pruebas borran datos",
        );
    }

    // Aplica las migraciones a la base de pruebas
    execSync("npx prisma migrate deploy", {
        stdio: "inherit",
        env: { ...process.env, DATABASE_URL: testUrl },
    });
}