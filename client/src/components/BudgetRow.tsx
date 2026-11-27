import { Check, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { useDeleteBudget, useUpdateBudget } from "../hooks/useBudgets";
import { formatMoney } from "../lib/format";
import type { Budget } from "../types";

const inputClass =
    "w-32 rounded-lg border border-border bg-background/60 px-3 py-1.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

const iconButtonClass =
    "shrink-0 rounded-lg p-1.5 text-muted transition-colors hover:bg-border/60 hover:text-foreground";

// Color de la barra segun el limite usado
function getBarColor(percent: number) {
    if (percent > 100) return "bg-expense";
    if (percent >= 80) return "bg-amber-500";
    return "bg-primary";
}

export function BudgetRow({ budget }: { budget: Budget }) {
    const updateBudget = useUpdateBudget();
    const deleteBudget = useDeleteBudget();

    const [editing, setEditing] = useState(false);
    const [amount, setAmount] = useState(budget.amount);

    const limit = Number(budget.amount);
    const spent = Number(budget.spent);
    const percent = (spent / limit) * 100;
    const remaining = limit - spent;

    function handleSave(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        updateBudget.mutate(
            { id: budget.id, data: { amount: Number(amount) } },
            { onSuccess: () => setEditing(false) },
        );
    }

    function handleCancel() {
        setAmount(budget.amount);
        updateBudget.reset();
        setEditing(false);
    }

    function handleDelete() {
        if (window.confirm("¿Eliminar este presupuesto?")) {
            deleteBudget.mutate(budget.id);
        }
    }

    if (editing) {
        return (
            <li className="px-4 py-3">
                <form onSubmit={handleSave} className="flex items-center gap-2">
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">
                        {budget.category.name}
                    </span>

                    <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        aria-label="Límite mensual"
                        className={inputClass}
                    />

                    <button
                        type="submit"
                        disabled={updateBudget.isPending}
                        aria-label="Guardar cambios"
                        className={`${iconButtonClass} hover:text-income`}
                    >
                        <Check size={16} />
                    </button>

                    <button
                        type="button"
                        onClick={handleCancel}
                        aria-label="Cancelar"
                        className={iconButtonClass}
                    >
                        <X size={16} />
                    </button>
                </form>

                {updateBudget.isError && (
                    <p className="mt-2 text-sm text-expense">
                        {updateBudget.error.message}
                    </p>
                )}
            </li>
        );
    }

    return (
        <li className="px-4 py-3 transition-colors hover:bg-background/60">
            <div className="flex items-center gap-3">
                <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: budget.category.color }}
                />

                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {budget.category.name}
                </span>

                <span className="text-xs text-muted">{budget.currency}</span>

                <button
                    onClick={() => setEditing(true)}
                    aria-label="Editar presupuesto"
                    className={iconButtonClass}
                >
                    <Pencil size={16} />
                </button>

                <button
                    onClick={handleDelete}
                    aria-label="Eliminar presupuesto"
                    className="shrink-0 rounded-lg p-1.5 text-muted transition-colors hover:bg-expense/10 hover:text-expense"
                >
                    <Trash2 size={16} />
                </button>
            </div>
            {/* La barra nunca pasa del 100 %, aunque el gasto si */}
            <div
                role="progressbar"
                aria-label={`Gasto en ${budget.category.name}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.min(Math.round(percent), 100)}
                className="mt-2 h-2 overflow-hidden rounded-full bg-border/60"
            >
                <div
                    className={`h-full rounded-full transition-all ${getBarColor(percent)}`}
                    style={{ width: `${Math.min(percent, 100)}%` }}
                />
            </div>

            <div className="mt-1.5 flex flex-wrap justify-between gap-x-3 text-xs text-muted">
                <span>
                    {formatMoney(spent, budget.currency)} de{" "}
                    {formatMoney(limit, budget.currency)}
                </span>

                {remaining >= 0 ? (
                    <span>Quedan {formatMoney(remaining, budget.currency)}</span>
                ) : (
                    <span className="text-expense">
                        Te pasaste por {formatMoney(-remaining, budget.currency)}
                    </span>
                )}
            </div>
        </li>
    );
}