import { Summary } from "../components/Summary";
import { TransactionForm } from "../components/TransactionForm";
import { TransactionList } from "../components/TransactionList";
import { useAuth } from "../context/authContext";
import { useTransactions } from "../hooks/useTransactions";

export function HomePage() {
    const { user } = useAuth();
    const { data: transactions, isPending, error } = useTransactions();

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-semibold tracking-tight">
                Hola, {user?.name}
            </h1>

            {isPending && <p className="text-sm text-muted">Cargando...</p>}

            {error && <p className="text-sm text-expense">{error.message}</p>}

            {transactions && <Summary transactions={transactions} />}

            <TransactionForm />

            {transactions && (
                <section>
                    <h2 className="mb-3 text-sm font-semibold">Movimientos</h2>
                    <TransactionList transactions={transactions} />
                </section>
            )}
        </div>
    );
}