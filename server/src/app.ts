import express from "express";
import cors from "cors";
import {transactionsRouter} from "./modules/transactions/transactions.routes";

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
    
    // Rutas de transacciones
    app.use("/api/transactions", transactionsRouter);

    return app;
}