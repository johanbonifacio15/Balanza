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
            <p className="rounded-xl bg-white p-6 text-center text-sm text-slate-500 ring-1 ring-slate-200">
                Todavía no tienes transacciones. Agrega la primera arriba.
            </p>
        );
    }

    return (
        <ul className="divide-y divide-slate-200 rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
            {transactions.map((transaction) => {
                const isIncome = transaction.type === "INCOME";

                return (
                    <li
                        key={transaction.id}
                        className="flex items-center justify-between gap-4 px-4 py-3"
                    >
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-900">
                                {transaction.description}
                            </p>
                            <p className="text-xs text-slate-500">
                                {formatDate(transaction.date)}
                            </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-4">
                            <span
                                className={`text-sm font-medium ${
                                    isIncome ? "text-emerald-600" : "text-red-600"
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
                                className="text-xs text-slate-400 hover:text-red-600"
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