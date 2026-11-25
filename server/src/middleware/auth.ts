import type {NextFunction, Request, Response} from "express";
import {verifyToken} from "../lib/jwt";

//Revisa el token del encabezado Authorization y deja el id en req.userId
export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")){
        res.status(401).json({error:"Falta el token de autenticación"});
        return;
    }

    const token = header.slice("Bearer ".length);

    try{
        req.userId = verifyToken(token);
        next();
    } catch {
        res.status(401).json({error: "Token inválido o expirado"});
    }
}