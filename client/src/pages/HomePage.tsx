import { useState } from "react";
import { FilterBar } from "../components/FilterBar";
import { Modal } from "../components/Modal";
import { ListSkeleton, SummarySkeleton } from "../components/Skeletons";
import { Summary } from "../components/Summary";
import { TransactionForm } from "../components/TransactionForm";
import { TransactionList } from "../components/TransactionList";
import { useAuth } from "../context/authContext";
import { EMPTY_FILTERS, useTransactions } from "../hooks/useTransactions";
import { primaryButtonClass } from "../lib/styles";
import type { TransactionFilters } from "../types";
import { ExportButton } from "../components/ExportButton";

export function HomePage() {
    const { user } = useAuth();
    const [filters, setFilters] = useState<TransactionFilters>(EMPTY_FILTERS);
    // Panel de "Nueva transacción", que se usa en pantallas chicas
    const [creating, setCreating] = useState(false);

    // El resumen usa todas; la lista, solo las filtradas
    // (sin filtros es la misma consulta, así que no se pide dos veces)
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

            {/* En pantallas medianas y grandes el formulario va a la vista */}
            <div className="hidden md:block">
                <TransactionForm />
            </div>

            {/* En el movil se esconde detras de un boton que abre el panel */}
            <button
                onClick={() => setCreating(true)}
                className={`${primaryButtonClass} w-full md:hidden`}
            >
                Nueva transacción
            </button>

            {creating && (
                <Modal
                    title="Nueva transacción"
                    onClose={() => setCreating(false)}
                >
                    <TransactionForm bare onDone={() => setCreating(false)} />
                </Modal>
            )}

            <section>
                <div className="mb-3 flex items-center justify-between gap-4">
                    <h2 className="text-sm font-semibold">Movimientos</h2>

                    {filtered.data && (
                        <ExportButton
                            transactions={filtered.data}
                            filtered={hasFilters}
                        />
                    )}
                </div>

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