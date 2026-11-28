import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useCategoryStats } from "../hooks/useStats";
import { tooltipProps } from "../lib/chartStyles";
import { formatMoney } from "../lib/format";
import type { Currency } from "../types";
import { ListSkeleton } from "./Skeletons";

export function CategoryChart({ currency }: { currency: Currency }) {
    const { data, isPending, error } = useCategoryStats(currency);

    const total = data?.reduce((sum, item) => sum + item.total, 0) ?? 0;

    return (
        <section className="glass rounded-2xl p-5">
            <h2 className="text-sm font-semibold">Gasto por categoría</h2>

            {error && (
                <p className="mt-4 text-sm text-expense">{error.message}</p>
            )}

            {isPending && (
                <div className="mt-4">
                    <ListSkeleton />
                </div>
            )}

            {data && data.length === 0 && (
                <p className="mt-6 py-10 text-center text-sm text-muted">
                    No tienes gastos este mes en {currency}.
                </p>
            )}

            {data && data.length > 0 && (
                <>
                    <p className="mt-3 text-2xl font-semibold tracking-tight">
                        {formatMoney(total, currency)}
                    </p>
                    <p className="text-xs text-muted">Gastado este mes</p>

                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie
                                // El color de cada porción va dentro del dato
                                data={data.map((item) => ({
                                    ...item,
                                    fill: item.color,
                                }))}
                                dataKey="total"
                                nameKey="name"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={2}
                                stroke="none"
                            />
                            <Tooltip
                                {...tooltipProps}
                                formatter={(value) =>
                                    formatMoney(Number(value), currency)
                                }
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    <ul className="mt-2 space-y-2">
                        {data.map((item) => (
                            <li
                                key={item.categoryId ?? "none"}
                                className="flex items-center gap-2 text-sm"
                            >
                                {/* El color viene de la base de datos, por eso va como estilo en línea */}
                                <span
                                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="min-w-0 flex-1 truncate">
                                    {item.name}
                                </span>
                                <span className="text-xs text-muted">
                                    {Math.round((item.total / total) * 100)}%
                                </span>
                                <span className="shrink-0 text-right font-medium">
                                    {formatMoney(item.total, currency)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </section>
    );
}