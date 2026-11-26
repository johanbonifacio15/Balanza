import { ListSkeleton, SummarySkeleton } from "../components/Skeletons";
import { Summary } from "../components/Summary";
import { TransactionForm } from "../components/TransactionForm";
import { TransactionList } from "../components/TransactionList";
import { useAuth } from "../context/authContext";
import { useTransactions } from "../hooks/useTransactions";

export function HomePage() {
    const { user } = useAuth();
    const { data: transactions, isPending, error } = useTransactions();

    return (
        <div className="space-y-8 motion-safe:animate-fade-up">
            <h1 className="text-2xl font-semibold tracking-tight">
                Hola, {user?.name}
            </h1>

            {error && <p className="text-sm text-expense">{error.message}</p>}

            {isPending && <SummarySkeleton />}
            {transactions && <Summary transactions={transactions} />}

            <TransactionForm />

            <section>
                <h2 className="mb-3 text-sm font-semibold">Movimientos</h2>

                {isPending && <ListSkeleton />}
                {transactions && <TransactionList transactions={transactions} />}
            </section>
        </div>
    );
}