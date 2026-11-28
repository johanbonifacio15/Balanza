import { useState } from "react";
import { FilterBar } from "../components/FilterBar";
import { ListSkeleton, SummarySkeleton } from "../components/Skeletons";
import { Summary } from "../components/Summary";
import { TransactionForm } from "../components/TransactionForm";
import { TransactionList } from "../components/TransactionList";
import { useAuth } from "../context/authContext";
import { EMPTY_FILTERS, useTransactions } from "../hooks/useTransactions";
import type { TransactionFilters } from "../types";

export function HomePage() {
    const { user } = useAuth();
    const [filters, setFilters] = useState<TransactionFilters>(EMPTY_FILTERS);

    const all = useTransactions();
    const filtered = useTransactions(filters);

    const hasFilters = Object.values(filters).some(Boolean);
    const error = all.error ?? filtered.error;

    return (
        <div className="space-y-8 motion-safe:animate-fade-up">
            <h1 className="text-2xl font-semibold tracking-tight">
                Hola, {user?.name}
            </h1>

            {error && <p className="text-sm text-expense">{error.message}</p>}

            {all.isPending && <SummarySkeleton />}
            {all.data && <Summary transactions={all.data} />}

            <TransactionForm />

            <section>
                <h2 className="mb-3 text-sm font-semibold">Movimientos</h2>

                <div className="space-y-3">
                    <FilterBar filters={filters} onChange={setFilters} />

                    {filtered.isPending && <ListSkeleton />}
                    {filtered.data && (
                        <TransactionList
                            transactions={filtered.data}
                            filtered={hasFilters}
                        />
                    )}
                </div>
            </section>
        </div>
    );
}