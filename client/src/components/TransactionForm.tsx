import { useState } from "react";
import type { FormEvent } from "react";
import { useCategories } from "../hooks/useCategories";
import {
    useCreateTransaction,
    useUpdateTransaction,
} from "../hooks/useTransactions";
import { fieldClass, primaryButtonClass } from "../lib/styles";
import type {
    Currency,
    NewTransaction,
    Transaction,
    TransactionType,
} from "../types";

function today() {
    return new Date().toLocaleDateString("en-CA");
}

type TransactionFormProps = {
    transaction?: Transaction;
    onDone?: () => void;
    bare?: boolean;
};

export function TransactionForm({
    transaction,
    onDone,
    bare = false,
}: TransactionFormProps) {
    const createTransaction = useCreateTransaction();
    const updateTransaction = useUpdateTransaction();
    const { data: categories } = useCategories();

    const [type, setType] = useState<TransactionType>(
        transaction?.type ?? "EXPENSE",
    );
    const [amount, setAmount] = useState(transaction?.amount ?? "");
    const [currency, setCurrency] = useState<Currency>(
        transaction?.currency ?? "DOP",
    );
    const [description, setDescription] = useState(
        transaction?.description ?? "",
    );
    const [date, setDate] = useState(() =>
        transaction ? transaction.date.slice(0, 10) : today(),
    );
    const [categoryId, setCategoryId] = useState(
        transaction?.categoryId ? String(transaction.categoryId) : "",
    );

    const isPending = createTransaction.isPending || updateTransaction.isPending;
    const error = createTransaction.error ?? updateTransaction.error;

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const data: NewTransaction = {
            type,
            amount: Number(amount),
            currency,
            description,
            date,
            categoryId: categoryId ? Number(categoryId) : null,
        };

        if (transaction) {
            updateTransaction.mutate(
                { id: transaction.id, data },
                { onSuccess: onDone },
            );
            return;
        }

        createTransaction.mutate(data, {
            onSuccess: () => {
                setAmount("");
                setDescription("");
                onDone?.();
            },
        });
    }

    return (
        <form
            onSubmit={handleSubmit}
            className={bare ? "" : "glass rounded-2xl p-5"}
        >
            {!bare && (
                <h2 className="text-sm font-semibold text-foreground">
                    {transaction ? "Editar transacción" : "Nueva transacción"}
                </h2>
            )}

            <div
                className={`grid gap-4 sm:grid-cols-2 ${bare ? "" : "mt-4"}`}
            >
                <label className="block text-sm font-medium text-foreground">
                    Tipo
                    <select
                        value={type}
                        onChange={(e) =>
                            setType(e.target.value as TransactionType)
                        }
                        className={fieldClass}
                    >
                        <option value="EXPENSE">Gasto</option>
                        <option value="INCOME">Ingreso</option>
                    </select>
                </label>

                <label className="block text-sm font-medium text-foreground">
                    Moneda
                    <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value as Currency)}
                        className={fieldClass}
                    >
                        <option value="DOP">Pesos (DOP)</option>
                        <option value="USD">Dólares (USD)</option>
                    </select>
                </label>

                <label className="block text-sm font-medium text-foreground">
                    Monto
                    <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        className={fieldClass}
                    />
                </label>

                <label className="block text-sm font-medium text-foreground">
                    Fecha
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className={fieldClass}
                    />
                </label>

                <label className="block text-sm font-medium text-foreground">
                    Descripción
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        maxLength={120}
                        className={fieldClass}
                    />
                </label>

                <label className="block text-sm font-medium text-foreground">
                    Categoría
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className={fieldClass}
                    >
                        <option value="">Sin categoría</option>
                        {categories?.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {error && (
                <p className="mt-4 text-sm text-expense">{error.message}</p>
            )}

            <button
                type="submit"
                disabled={isPending}
                className={`${primaryButtonClass} mt-5`}
            >
                {isPending
                    ? "Guardando..."
                    : transaction
                      ? "Guardar cambios"
                      : "Guardar"}
            </button>
        </form>
    );
}