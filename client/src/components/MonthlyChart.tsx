import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { useMonthlyStats } from "../hooks/useStats";
import { tooltipProps } from "../lib/chartStyles";
import { formatMoney, formatMonthShort } from "../lib/format";
import type { Currency } from "../types";
import { ListSkeleton } from "./Skeletons";

export function MonthlyChart({ currency }: { currency: Currency }) {
    const { data, isPending, error } = useMonthlyStats(currency);

    const isEmpty = data?.every(
        (month) => month.income === 0 && month.expense === 0,
    );

    return (
        <section className="glass rounded-2xl p-5">
            <h2 className="text-sm font-semibold">Ingresos y gastos</h2>
            <p className="text-xs text-muted">Últimos 6 meses</p>

            {error && (
                <p className="mt-4 text-sm text-expense">{error.message}</p>
            )}

            {isPending && (
                <div className="mt-4">
                    <ListSkeleton />
                </div>
            )}

            {data && isEmpty && (
                <p className="mt-6 py-10 text-center text-sm text-muted">
                    Todavía no hay movimientos en {currency}.
                </p>
            )}

            {data && !isEmpty && (
                <div className="mt-4">
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart
                            data={data.map((item) => ({
                                ...item,
                                label: formatMonthShort(item.month),
                            }))}
                        >
                            <CartesianGrid
                                vertical={false}
                                stroke="var(--color-border)"
                            />
                            <XAxis
                                dataKey="label"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: "var(--color-muted)", fontSize: 12 }}
                            />
                            <YAxis hide />
                            <Tooltip
                                {...tooltipProps}
                                cursor={{ fill: "var(--color-border)", opacity: 0.3 }}
                                formatter={(value) =>
                                    formatMoney(Number(value), currency)
                                }
                            />
                            <Legend
                                iconType="circle"
                                formatter={(value) => (
                                    <span style={{ color: "var(--color-muted)" }}>
                                        {value}
                                    </span>
                                )}
                            />
                            <Bar
                                dataKey="income"
                                name="Ingresos"
                                fill="var(--color-income)"
                                radius={[4, 4, 0, 0]}
                            />
                            <Bar
                                dataKey="expense"
                                name="Gastos"
                                fill="var(--color-expense)"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </section>
    );
}