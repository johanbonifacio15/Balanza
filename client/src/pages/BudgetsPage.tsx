import { PiggyBank } from "lucide-react";
import { BudgetForm } from "../components/BudgetForm";
import { BudgetRow } from "../components/BudgetRow";
import { ListSkeleton } from "../components/Skeletons";
import { useBudgets } from "../hooks/useBudgets";

export function BudgetsPage() {
    const { data: budgets, isPending, error } = useBudgets();

    // Por ejemplo: "noviembre de 2026"
    const monthName = new Date().toLocaleDateString("es-DO", {
        month: "long",
        year: "numeric",
    });

    return (
        <div className="space-y-8 motion-safe:animate-fade-up">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                    Presupuestos
                </h1>
                <p className="mt-1 text-sm text-muted first-letter:uppercase">
                    {monthName}
                </p>
            </div>

            <BudgetForm />

            {error && <p className="text-sm text-expense">{error.message}</p>}

            {isPending && <ListSkeleton />}

            {budgets && budgets.length === 0 && (
                <div className="glass flex flex-col items-center rounded-2xl px-6 py-12 text-center">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary dark:text-indigo-300">
                        <PiggyBank size={20} />
                    </span>
                    <p className="mt-4 text-sm font-medium">
                        Todavía no tienes presupuestos
                    </p>
                    <p className="mt-1 text-sm text-muted">
                        Elige una categoría arriba y ponle un límite mensual.
                    </p>
                </div>
            )}

            {budgets && budgets.length > 0 && (
                <ul className="glass divide-y divide-border overflow-hidden rounded-2xl">
                    {budgets.map((budget) => (
                        <BudgetRow key={budget.id} budget={budget} />
                    ))}
                </ul>
            )}
        </div>
    );
}