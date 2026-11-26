import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate } from "react-router";
import { useAuth } from "../context/authContext";

export function LoginPage() {
    const { user, login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    if (user) {
        return <Navigate to="/" replace />;
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await login(email, password);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error inesperado");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-background px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm rounded-xl bg-surface p-8 shadow-sm ring-1 ring-border"
            >
                <h1 className="text-2xl font-semibold text-foreground">
                    Iniciar sesión
                </h1>
                <p className="mt-1 text-sm text-muted">
                    Entra a tu cuenta de Balanza.
                </p>

                <label className="mt-6 block text-sm font-medium text-foreground">
                    Correo
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 w-full rounded-lg border border-border bg-background text-foreground px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                </label>

                <label className="mt-4 block text-sm font-medium text-foreground">
                    Contraseña
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 w-full rounded-lg border border-border bg-background text-foreground px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                </label>

                {error && <p className="mt-4 text-sm text-expense">{error}</p>}

                <button
                    type="submit"
                    disabled={submitting}
                    className="mt-6 w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover disabled:opacity-50"
                >
                    {submitting ? "Entrando..." : "Entrar"}
                </button>

                <p className="mt-4 text-center text-sm text-muted">
                    ¿No tienes cuenta?{" "}
                    <Link
                        to="/register"
                        className="font-medium text-foreground hover:underline"
                    >
                        Regístrate
                    </Link>
                </p>
            </form>
        </main>
    );
}