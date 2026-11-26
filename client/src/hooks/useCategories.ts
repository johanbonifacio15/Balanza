import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Category, NewCategory } from "../types";

const CATEGORIES_KEY = ["categories"];
const TRANSACTIONS_KEY = ["transactions"];

export function useCategories() {
    return useQuery({
        queryKey: CATEGORIES_KEY,
        queryFn: () => api<Category[]>("/api/categories"),
    });
}

export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: NewCategory) =>
            api<Category>("/api/categories", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
    });
}

export function useUpdateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<NewCategory> }) =>
            api<Category>(`/api/categories/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            }),
        onSuccess: () =>
            Promise.all([
                queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
                queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY }),
            ]),
    });
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) =>
            api<void>(`/api/categories/${id}`, { method: "DELETE" }),
        onSuccess: () =>
            Promise.all([
                queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
                queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY }),
            ]),
    });
}

export function useRestoreDefaultCategories() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () =>
            api<Category[]>("/api/categories/defaults", { method: "POST" }),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
    });
}