import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        include: ["tests/**/*.test.ts"],
        // Corre una vez antes de todo, revisa la base de pruebas y le aplica las migraciones
        globalSetup: ["tests/global-setup.ts"],
        // Corre antes de cada archivo de pruebas
        setupFiles: ["tests/setup.ts"],
        // Todos los archivos comparten una base de datos, se corren uno tras otro
        fileParallelism: false,
        testTimeout: 20000,
        hookTimeout: 30000,
    },
});