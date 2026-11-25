import jwt from "jsonwebtoken";

// Lee el secreto de .env
function getSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET no está definido en el .env");
    }

    return secret;
}

// Crea un token firmado que guarda el id del usuario por 7 dias

export function signToken(userId: number) {
    return jwt.sign({sub: String(userId)}, getSecret(), {
        expiresIn: "7d",
    });
}

//Verifica la firma y expiracion y devuelve el userid

export function verifyToken(token: string) {
    const payload = jwt.verify(token, getSecret());

    if (typeof payload === "string" || !payload.sub) {
        throw new Error ("Token inválido");
    }
    
    return Number(payload.sub);
}


