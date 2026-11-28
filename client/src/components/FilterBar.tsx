import { X } from "lucide-react";
import { useCategories } from "../hooks/useCategories";
import { EMPTY_FILTERS } from "../hooks/useTransactions";
import { fieldClass } from "../lib/styles";
import type { TransactionFilters } from "../types";

type FilterBarProps = {
    filters: TransactionFilters;
    onChange: (filters: TransactionFilters) => void;
};

const labelClass = "block text-xs font-medium text-muted";

export function FilterBar({ filters, onChange }: FilterBarProps) {
    const { data: categories } = useCategories();

    function update(changes: Partial<TransactionFilters>) {
        onChange({ ...filters, ...changes });
    }

    const active = Object.values(filters).some(Boolean);

    return (
        <div className="glass rounded-2xl p-4">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <label className={labelClass}>
                    Tipo
                    <select
                        value={filters.type}
                        onChange={(e) =>
                            update({
                                type: e.target.value as TransactionFilters["type"],
                            })
                        }
                        className={fieldClass}
                    >
                        <option value="">Todos</option>
                        <option value="EXPENSE">Gastos</option>
                        <option value="INCOME">Ingresos</option>
                    </select>
                </label>

                <label className={labelClass}>
                    Categoría
                    <select
                        value={filters.categoryId}
                        onChange={(e) => update({ categoryId: e.target.value })}
                        className={fieldClass}
                    >
                        <option value="">Todas</option>
                        <option value="none">Sin categoría</option>
                        {categories?.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label className={labelClass}>
                    Desde
                    <input
                        type="date"
                        value={filters.from}
                        max={filters.to || undefined}
                        onChange={(e) => update({ from: e.target.value })}
                        className={fieldClass}
                    />
                </label>

                <label className={labelClass}>
                    Hasta
                    <input
                        type="date"
                        value={filters.to}
                        min={filters.from || undefined}
                        onChange={(e) => update({ to: e.target.value })}
                        className={fieldClass}
                    />
                </label>
            </div>

            {active && (
                <button
                    onClick={() => onChange(EMPTY_FILTERS)}
                    className="mt-3 inline-flex items-center gap-1 text-xs text-muted transition-colors hover:text-foreground"
                >
                    <X size={14} />
                    Limpiar filtros
                </button>
            )}
        </div>
    );
}