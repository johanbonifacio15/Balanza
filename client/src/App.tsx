import {useEffect, useState} from "react";
import {api} from "./lib/api";

type Health = {
    status: string;
    timestamp: string;
};

function App() {
    const [health, setHealth] = useState<Health | null>(null);
    const [error, setError] = useState("");

    // Se asegura de que la Api este viva
    useEffect(() => {
        api<Health>("/api/health")
            .then(setHealth)
            .catch((err: Error) => setError(err.message));
    }, []);

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50">
            <div className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <h1 className="text-2xl font-semibold text-slate-900">Balanza</h1>
                <p className="mt-2 text-sm text-slate-500">
                    {health
                        ? `API conectada: ${health.status}`
                        : error || "Conectando con la API..."}
                </p>
            </div>
        </main>
    );
}

export default App;