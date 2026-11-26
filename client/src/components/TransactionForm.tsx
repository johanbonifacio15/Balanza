import {useState} from "react";
import type {FormEvent} from "react";
import {useCreateTransaction} from "../hooks/useTransactions";
import type {Currency, TransactionType} from "../types";

const fieldClass =
    "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900";

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
            className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
        >
            <h2 className="text-sm font-semibold text-slate-900">
                Nueva transacción
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">
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

                <label className="block text-sm font-medium text-slate-700">
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

                <label className="block text-sm font-medium text-slate-700">
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

                <label className="block text-sm font-medium text-slate-700">
                    Fecha
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className={fieldClass}
                    />
                </label>

                <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
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
                <p className="mt-4 text-sm text-red-600">
                    {createTransaction.error.message}
                </p>
            )}

            <button
                type="submit"
                disabled={createTransaction.isPending}
                className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
                {createTransaction.isPending ? "Guardando..." : "Guardar"}
            </button>
        </form>
    );
}