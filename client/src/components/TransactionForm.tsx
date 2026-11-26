import {useState} from "react";
import type {FormEvent} from "react";
import {useCreateTransaction} from "../hooks/useTransactions";
import type {Currency, TransactionType} from "../types";

const fieldClass =
    "mt-1 w-full rounded-lg border border-border bg-background text-foreground px-3 py-2 text-sm outline-none focus:border-primary";

// Fecha de hoy en formato AAAA-MM-DD segun la hora local
function today() {
    return new Date().toLocaleDateString("en-CA");
}

export function TransactionForm() {
    const createTransaction = useCreateTransaction();

    const [type, setType] = useState<TransactionType>("EXPENSE");
    const [amount, setAmount] = useState("");
    const [currency, setCurrency] = useState<Currency>("DOP");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(today);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        createTransaction.mutate(
            { type, amount: Number(amount), currency, description, date },
            {
                onSuccess: () => {
                    setAmount("");
                    setDescription("");
                },
            },
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-xl bg-surface p-5 shadow-sm ring-1 ring-border"
        >
            <h2 className="text-sm font-semibold text-foreground">
                Nueva transacción
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
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

                <label className="block text-sm font-medium text-foreground sm:col-span-2">
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
            </div>

            {createTransaction.isError && (
                <p className="mt-4 text-sm text-expense">
                    {createTransaction.error.message}
                </p>
            )}

            <button
                type="submit"
                disabled={createTransaction.isPending}
                className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover disabled:opacity-50"
            >
                {createTransaction.isPending ? "Guardando..." : "Guardar"}
            </button>
        </form>
    );
}