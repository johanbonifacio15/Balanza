import {formatMoney} from "../lib/format";
import type {Currency, Transaction} from "../types";

const CURRENCIES: Currency[] = ["DOP", "USD"];

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
    negative?: boolean;
};

function SummaryCard({ label, value, negative = false }: SummaryCardProps) {
    return (
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs text-slate-500">{label}</p>
            <p
                className={`mt-1 text-lg font-semibold ${
                    negative ? "text-red-600" : "text-slate-900"
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
                        <h2 className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Resumen en {currency}
                        </h2>

                        <div className="mt-2 grid grid-cols-3 gap-3">
                            <SummaryCard
                                label="Ingresos"
                                value={formatMoney(totals.income, currency)}
                            />
                            <SummaryCard
                                label="Gastos"
                                value={formatMoney(totals.expense, currency)}
                            />
                            <SummaryCard
                                label="Balance"
                                value={formatMoney(totals.balance, currency)}
                                negative={totals.balance < 0}
                            />
                        </div>
                    </div>
                );
            })}
        </section>
    );
}