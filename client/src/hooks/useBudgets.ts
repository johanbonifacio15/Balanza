import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Budget, NewBudget } from "../types";

const BUDGETS_KEY = ["budgets"];

type SavedBudget = Omit<Budget, "spent">;

export function useBudgets() {
    const month = new Date().toLocaleDateString("en-CA").slice(0, 7);

    return useQuery({
        queryKey: [...BUDGETS_KEY, month],
        queryFn: () => api<Budget[]>(`/api/budgets?month=${month}`),
    });
}

export function useCreateBudget() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: NewBudget) =>
            api<SavedBudget>("/api/budgets", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: BUDGETS_KEY }),
    });
}

export function useUpdateBudget() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: { amount: number } }) =>
            api<SavedBudget>(`/api/budgets/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            }),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: BUDGETS_KEY }),
    });
}

export function useDeleteBudget() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) =>
            api<void>(`/api/budgets/${id}`, { method: "DELETE" }),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: BUDGETS_KEY }),
    });
}