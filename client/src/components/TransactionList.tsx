import {
    ArrowDownLeft,
    ArrowUpRight,
    Inbox,
    Pencil,
    Trash2,
} from "lucide-react";
import { useState } from "react";
import { useDeleteTransaction } from "../hooks/useTransactions";
import { formatDate, formatMoney } from "../lib/format";
import type { Transaction } from "../types";
import { CategoryBadge } from "./CategoryBadge";
import { Modal } from "./Modal";
import { TransactionForm } from "./TransactionForm";

export function TransactionList({
    transactions,
    filtered = false,
}: {
    transactions: Transaction[];
    filtered?: boolean;
}) {
    const deleteTransaction = useDeleteTransaction();

    const [editing, setEditing] = useState<Transaction | null>(null);

    function handleDelete(id: number) {
        if (window.confirm("¿Eliminar esta transacción?")) {
            deleteTransaction.mutate(id);
        }
    }

    if (transactions.length === 0) {
        return (
            <div className="glass flex flex-col items-center rounded-2xl px-6 py-12 text-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary dark:text-indigo-300">
                    <Inbox size={20} />
                </span>
                <p className="mt-4 text-sm font-medium">
                    {filtered
                        ? "Ninguna transacción coincide con los filtros"
                        : "Todavía no tienes transacciones"}
                </p>
                <p className="mt-1 text-sm text-muted">
                    {filtered
                        ? "Prueba con otros filtros o límpialos."
                        : "Agrega la primera con «Nueva transacción»."}
                </p>
            </div>
        );
    }

    return (
        <>
            <ul className="glass divide-y divide-border overflow-hidden rounded-2xl">
                {transactions.map((transaction) => {
                    const isIncome = transaction.type === "INCOME";

                    return (
                        <li
                            key={transaction.id}
                            className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-background/60"
                        >
                            <span
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                                    isIncome
                                        ? "bg-income/10 text-income"
                                        : "bg-expense/10 text-expense"
                                }`}
                            >
                                {isIncome ? (
                                    <ArrowDownLeft size={18} />
                                ) : (
                                    <ArrowUpRight size={18} />
                                )}
                            </span>

                            <div className="min-w-0 flex-1">
                                <p className="break-words text-sm font-medium">
                                    {transaction.description}
                                </p>
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                    <p className="text-xs text-muted">
                                        {formatDate(transaction.date)}
                                    </p>
                                    {transaction.category && (
                                        <CategoryBadge
                                            name={transaction.category.name}
                                            color={transaction.category.color}
                                        />
                                    )}
                                </div>
                            </div>

                            <span
                                className={`shrink-0 text-sm font-medium tabular-nums ${
                                    isIncome ? "text-income" : "text-expense"
                                }`}
                            >
                                {isIncome ? "+" : "-"}
                                {formatMoney(
                                    Number(transaction.amount),
                                    transaction.currency,
                                )}
                            </span>

                            <button
                                onClick={() => setEditing(transaction)}
                                aria-label="Editar transacción"
                                className="shrink-0 rounded-lg p-1.5 text-muted transition-colors hover:bg-border/60 hover:text-foreground"
                            >
                                <Pencil size={16} />
                            </button>

                            <button
                                onClick={() => handleDelete(transaction.id)}
                                aria-label="Eliminar transacción"
                                className="shrink-0 rounded-lg p-1.5 text-muted transition-colors hover:bg-expense/10 hover:text-expense"
                            >
                                <Trash2 size={16} />
                            </button>
                        </li>
                    );
                })}
            </ul>

            {editing && (
                <Modal
                    title="Editar transacción"
                    onClose={() => setEditing(null)}
                >
                    <TransactionForm
                        transaction={editing}
                        bare
                        onDone={() => setEditing(null)}
                    />
                </Modal>
            )}
        </>
    );
}