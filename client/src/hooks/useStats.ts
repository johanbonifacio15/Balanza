import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { CategoryStat, Currency, MonthlyStat } from "../types";

export function useCategoryStats(currency: Currency) {
    // Mes actual segun la hora local
    const month = new Date().toLocaleDateString("en-CA").slice(0, 7);

    return useQuery({
        queryKey: ["stats", "by-category", month, currency],
        queryFn: () =>
            api<CategoryStat[]>(
                `/api/stats/by-category?month=${month}&currency=${currency}`,
            ),
    });
}

export function useMonthlyStats(currency: Currency) {
    return useQuery({
        queryKey: ["stats", "monthly", currency],
        queryFn: () =>
            api<MonthlyStat[]>(`/api/stats/monthly?months=6&currency=${currency}`),
    });
}