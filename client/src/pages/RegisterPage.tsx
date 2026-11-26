import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate } from "react-router";
import { AuthLayout } from "../components/AuthLayout";
import { useAuth } from "../context/authContext";
import { fieldClass, primaryButtonClass } from "../lib/styles";

export function RegisterPage() {
    const { user, register } = useAuth();

    const [name, setName] = useState("");
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
            await register(name, email, password);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error inesperado");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <AuthLayout
            title="Crear cuenta"
            subtitle="Empieza a llevar el control de tus gastos."
        >
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <label className="block text-sm font-medium">
                    Nombre
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        maxLength={60}
                        className={fieldClass}
                    />
                </label>

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
                        minLength={8}
                        maxLength={72}
                        className={fieldClass}
                    />
                </label>

                {error && <p className="text-sm text-expense">{error}</p>}

                <button
                    type="submit"
                    disabled={submitting}
                    className={`${primaryButtonClass} w-full`}
                >
                    {submitting ? "Creando cuenta..." : "Crear cuenta"}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted">
                ¿Ya tienes cuenta?{" "}
                <Link
                    to="/login"
                    className="font-medium text-foreground hover:underline"
                >
                    Inicia sesión
                </Link>
            </p>
        </AuthLayout>
    );
}