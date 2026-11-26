import {useDeleteTransaction} from "../hooks/useTransactions";
import {formatDate, formatMoney} from "../lib/format";
import type {Transaction} from "../types";

export function TransactionList({
    transactions,
}: {
    transactions: Transaction[];
}) {
    const deleteTransaction = useDeleteTransaction();

    function handleDelete(id: number) {
        if (window.confirm("¿Eliminar esta transacción?")) {
            deleteTransaction.mutate(id);
        }
    }

    if (transactions.length === 0) {
        return (
            <p className="rounded-xl bg-surface p-6 text-center text-sm text-muted ring-1 ring-border">
                Todavía no tienes transacciones. Agrega la primera arriba.
            </p>
        );
    }

    return (
        <ul className="divide-y divide-border rounded-xl bg-surface shadow-sm ring-1 ring-border">
            {transactions.map((transaction) => {
                const isIncome = transaction.type === "INCOME";

                return (
                    <li
                        key={transaction.id}
                        className="flex items-center justify-between gap-4 px-4 py-3"
                    >
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">
                                {transaction.description}
                            </p>
                            <p className="text-xs text-muted">
                                {formatDate(transaction.date)}
                            </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-4">
                            <span
                                className={`text-sm font-medium ${
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
                                onClick={() => handleDelete(transaction.id)}
                                className="text-xs text-muted hover:text-expense"
                            >
                                Eliminar
                            </button>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}