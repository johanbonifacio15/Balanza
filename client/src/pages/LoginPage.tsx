import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate } from "react-router";
import { AuthLayout } from "../components/AuthLayout";
import { useAuth } from "../context/authContext";
import { fieldClass, primaryButtonClass } from "../lib/styles";

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
        <AuthLayout
            title="Iniciar sesión"
            subtitle="Entra a tu cuenta de Balanza."
        >
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <label className="block text-sm font-medium">
                    Correo
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={fieldClass}
                    />
                </label>

                <label className="block text-sm font-medium">
                    Contraseña
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={fieldClass}
                    />
                </label>

                {error && <p className="text-sm text-expense">{error}</p>}

                <button
                    type="submit"
                    disabled={submitting}
                    className={`${primaryButtonClass} w-full`}
                >
                    {submitting ? "Entrando..." : "Entrar"}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted">
                ¿No tienes cuenta?{" "}
                <Link
                    to="/register"
                    className="font-medium text-foreground hover:underline"
                >
                    Regístrate
                </Link>
            </p>
        </AuthLayout>
    );
}