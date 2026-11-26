import {Summary} from "../components/Summary";
import {TransactionForm} from "../components/TransactionForm";
import {TransactionList} from "../components/TransactionList";
import {useAuth} from "../context/authContext";
import {useTransactions} from "../hooks/useTransactions";

export function HomePage() {
    const { user, logout } = useAuth();
    const { data: transactions, isPending, error } = useTransactions();

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

            <div className="mt-8 space-y-8">
                {isPending && (
                    <p className="text-sm text-slate-500">Cargando...</p>
                )}

                {error && <p className="text-sm text-red-600">{error.message}</p>}

                {transactions && <Summary transactions={transactions} />}

                <TransactionForm />

                {transactions && (
                    <section>
                        <h2 className="mb-3 text-sm font-semibold text-slate-900">
                            Movimientos
                        </h2>
                        <TransactionList transactions={transactions} />
                    </section>
                )}
            </div>
        </main>
    );
}