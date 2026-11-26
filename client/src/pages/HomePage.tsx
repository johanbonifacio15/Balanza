import { useAuth } from "../context/authContext";

export function HomePage() {
    const { user, logout } = useAuth();

    return (
        <main className="mx-auto max-w-3xl px-4 py-10">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-slate-900">
                    Hola, {user?.name}
                </h1>
                <button
                    onClick={logout}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
                >
                    Cerrar sesión
                </button>
            </header>

            <p className="mt-6 text-sm text-slate-500">
                Aquí van a aparecer tus transacciones.
            </p>
        </main>
    );
}