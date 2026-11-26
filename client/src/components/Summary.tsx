import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import type { ReactNode } from "react";
import { formatMoney } from "../lib/format";
import type { Currency, Transaction } from "../types";

const CURRENCIES: Currency[] = ["DOP", "USD"];

const TONES = {
    income: "bg-income/10 text-income",
    expense: "bg-expense/10 text-expense",
    balance: "bg-primary/10 text-primary dark:text-indigo-300",
};

// Suma en centavos para evitar errores de redondeo con decimales
function getTotals(transactions: Transaction[], currency: Currency) {
    let income = 0;
    let expense = 0;

    for (const transaction of transactions) {
        if (transaction.currency !== currency) {
            continue;
        }

        const cents = Math.round(Number(transaction.amount) * 100);

        if (transaction.type === "INCOME") {
            income += cents;
        } else {
            expense += cents;
        }
    }

    return {
        income: income / 100,
        expense: expense / 100,
        balance: (income - expense) / 100,
    };
}

type SummaryCardProps = {
    label: string;
    value: string;
    icon: ReactNode;
    tone: keyof typeof TONES;
    negative?: boolean;
    wide?: boolean;
};

function SummaryCard({
    label,
    value,
    icon,
    tone,
    negative = false,
    wide = false,
}: SummaryCardProps) {
    return (
        <div
            className={`glass min-w-0 rounded-2xl p-4 transition hover:-translate-y-0.5 ${
                wide ? "col-span-2 sm:col-span-1" : ""
            } ${
                tone === "balance"
                    ? "bg-linear-to-br from-primary/15 to-violet-500/10"
                    : ""
            }`}
        >
            <div className="flex items-center gap-2">
                <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${TONES[tone]}`}
                >
                    {icon}
                </span>
                <p className="text-xs text-muted">{label}</p>
            </div>

            <p
                className={`mt-3 break-words text-base font-semibold tabular-nums sm:text-lg ${
                    negative ? "text-expense" : "text-foreground"
                }`}
            >
                {value}
            </p>
        </div>
    );
}

export function Summary({ transactions }: { transactions: Transaction[] }) {
    // Solo se muestran las monedas usadas
    const used = CURRENCIES.filter((currency) =>
        transactions.some((transaction) => transaction.currency === currency),
    );
    const currencies: Currency[] = used.length > 0 ? used : ["DOP"];

    return (
        <section className="space-y-4">
            {currencies.map((currency) => {
                const totals = getTotals(transactions, currency);

                return (
                    <div key={currency}>
                        <h2 className="text-xs font-medium uppercase tracking-wide text-muted">
                            Resumen en {currency}
                        </h2>

                        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
                            <SummaryCard
                                label="Ingresos"
                                value={formatMoney(totals.income, currency)}
                                icon={<TrendingUp size={16} />}
                                tone="income"
                            />
                            <SummaryCard
                                label="Gastos"
                                value={formatMoney(totals.expense, currency)}
                                icon={<TrendingDown size={16} />}
                                tone="expense"
                            />
                            <SummaryCard
                                label="Balance"
                                value={formatMoney(totals.balance, currency)}
                                icon={<Wallet size={16} />}
                                tone="balance"
                                negative={totals.balance < 0}
                                wide
                            />
                        </div>
                    </div>
                );
            })}
        </section>
    );
}