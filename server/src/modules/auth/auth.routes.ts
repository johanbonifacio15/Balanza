import {Router} from "express";
import bcrypt from "bcryptjs";
import {prisma} from "../../lib/prisma";
import {signToken} from "../../lib/jwt";
import { requireAuth } from "../../middleware/auth";
import { loginSchema, registerSchema } from "./auth.schemas";

export const authRouter = Router();

// POST /api/auth/register
authRouter.post("/register", async(req, res) => {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            error: "Datos inválidos",
            details: result.error.issues,
        });
        return;
    }

    const {name, password} = result.data;
    const email = result.data.email.toLowerCase();

    const existing = await prisma.user.findUnique({
        where: {email},
    });

    if (existing){
        res.status(409).json({error: "Ese correo ya está registrado"});
        return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {name, email, passwordHash},
        select: {id: true, name: true, email: true},
    });

    res.status(201).json({user, token: signToken(user.id)});
});

// POST /api/auth/login

authRouter.post("/login", async(req, res) => {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            error: "Datos inválidos",
            details: result.error.issues,
        });
        return;
    }

    const {password} = result.data;
    const email = result.data.email.toLowerCase();

    const user = await prisma.user.findUnique({
        where: {email},
    });

    const validPassword = user!== null && (await bcrypt.compare(password, user.passwordHash));

    if (!user || !validPassword) {
        res.status(401).json({ error: "Credenciales inválidas"});
        return;
    }

    res.json({
        user: {id: user.id, name: user.name, email: user.email},
        token: signToken(user.id),
    });
});

// GET /api/auth/me: datos del usuario que tiene la sesion

authRouter.get("/me", requireAuth, async(req, res) => {
    const user = await prisma.user.findUnique({
        where: {id: req.userId},
        select: {id: true, name: true, email: true},
    });

    if (!user) {
        res.status(404).json({error: "Usuario no encontrado"});
        return;
    }

    res.json(user);
});
