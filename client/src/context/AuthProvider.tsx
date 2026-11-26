import {useEffect, useState} from "react";
import type {ReactNode} from "react";
import {api, clearToken, getToken, saveToken} from "../lib/api";
import type {AuthResponse, User} from "../types";
import {AuthContext} from "./authContext";
import {useQueryClient} from "@tanstack/react-query";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const [loading, setLoading] = useState(() => getToken() !== null);
    
    const queryClient = useQueryClient();
    
    useEffect(() => {
        if (!getToken()) {
            return;
        }

        // Consulta con la api sobre el owner del token y si no sirve es descartado
        api<User>("/api/auth/me")
            .then(setUser)
            .catch(clearToken)
            .finally(() => setLoading(false));
    }, []);

    async function login(email: string, password: string) {
        const data = await api<AuthResponse>("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        saveToken(data.token);
        setUser(data.user);
    }

    async function register(name: string, email: string, password: string) {
        const data = await api<AuthResponse>("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({ name, email, password }),
        });

        saveToken(data.token);
        setUser(data.user);
    }

    function logout() {
        clearToken();
        setUser(null);
        queryClient.clear();
    }

    return (
        <AuthContext.Provider
            value={{ user, loading, login, register, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}