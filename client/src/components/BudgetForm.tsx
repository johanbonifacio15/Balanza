import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";
import { useBudgets, useCreateBudget } from "../hooks/useBudgets";
import { useCategories } from "../hooks/useCategories";
import { fieldClass, primaryButtonClass } from "../lib/styles";
import type { Currency } from "../types";

export function BudgetForm() {
    const createBudget = useCreateBudget();
    const { data: categories } = useCategories();
    const { data: budgets } = useBudgets();

    // Texto vacio = ninguna elegida hasta el momento
    const [categoryId, setCategoryId] = useState("");
    const [amount, setAmount] = useState("");
    const [currency, setCurrency] = useState<Currency>("DOP");

    const available = categories?.filter(
        (category) =>
            !budgets?.some(
                (budget) =>
                    budget.categoryId === category.id &&
                    budget.currency === currency,
            ),
    );

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        createBudget.mutate(
            { categoryId: Number(categoryId), amount: Number(amount), currency },
            {
                onSuccess: () => {
                    setCategoryId("");
                    setAmount("");
                },
            },
        );
    }

    return (
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-5">
            <h2 className="text-sm font-semibold">Nuevo presupuesto</h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <label className="block text-sm font-medium">
                    Categoría
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                        className={fieldClass}
                    >
                        <option value="">Elige una categoría</option>
                        {available?.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="block text-sm font-medium">
                    Moneda
                    <select
                        value={currency}
                        onChange={(e) => {
                            setCurrency(e.target.value as Currency);
                            setCategoryId("");
                        }}
                        className={fieldClass}
                    >
                        <option value="DOP">Pesos (DOP)</option>
                        <option value="USD">Dólares (USD)</option>
                    </select>
                </label>

                <label className="block text-sm font-medium">
                    Límite mensual
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
            </div>

            {categories && categories.length === 0 && (
                <p className="mt-4 text-sm text-muted">
                    Primero crea tus categorías en{" "}
                    <Link to="/categories" className="text-primary underline">
                        Categorías
                    </Link>
                    .
                </p>
            )}

            {createBudget.isError && (
                <p className="mt-4 text-sm text-expense">
                    {createBudget.error.message}
                </p>
            )}

            <button
                type="submit"
                disabled={createBudget.isPending}
                className={`${primaryButtonClass} mt-5`}
            >
                {createBudget.isPending ? "Guardando..." : "Guardar"}
            </button>
        </form>
    );
}