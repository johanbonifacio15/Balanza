import { useState } from "react";
import { CategoryChart } from "../components/CategoryChart";
import { MonthlyChart } from "../components/MonthlyChart";
import type { Currency } from "../types";

const currencies: Currency[] = ["DOP", "USD"];

export function DashboardPage() {
    const [currency, setCurrency] = useState<Currency>("DOP");

    return (
        <div className="space-y-8 motion-safe:animate-fade-up">
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Dashboard
                </h1>

                <div
                    role="group"
                    aria-label="Moneda"
                    className="inline-flex rounded-lg border border-border p-0.5"
                >
                    {currencies.map((item) => (
                        <button
                            key={item}
                            onClick={() => setCurrency(item)}
                            aria-pressed={currency === item}
                            className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                                currency === item
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted hover:text-foreground"
                            }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <CategoryChart currency={currency} />
                <MonthlyChart currency={currency} />
            </div>
        </div>
    );
}