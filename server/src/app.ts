import express from "express";
import cors from "cors";
import { transactionsRouter } from "./modules/transactions/transactions.routes";
import { authRouter } from "./modules/auth/auth.routes";
import { categoriesRouter } from "./modules/categories/categories.routes";
import { requireAuth } from "./middleware/auth";
import { budgetsRouter } from "./modules/budgets/budgets.routes";

export function createApp() {
    const app = express();

    app.use(cors());
    app.use(express.json());

    // Endpoint para chequear el estado de la API
    app.get("/api/health", (_req, res) => {
        res.json({
            status: "ok",
            timestamp: new Date().toISOString(),
        });
    });

    // Rutas de autenticacion publicas
    app.use("/api/auth", authRouter);

    // Rutas protegidas (requieren token)
    app.use("/api/transactions", requireAuth, transactionsRouter);
    app.use("/api/categories", requireAuth, categoriesRouter);
    app.use("/api/budgets", requireAuth, budgetsRouter);

    return app;
}