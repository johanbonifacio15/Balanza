import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { api } from "../lib/api";
import type {
    NewTransaction,
    Transaction,
    TransactionFilters,
} from "../types";

const QUERY_KEY = ["transactions"];

export const EMPTY_FILTERS: TransactionFilters = {
    type: "",
    categoryId: "",
    from: "",
    to: "",
};

export function useTransactions(filters: TransactionFilters = EMPTY_FILTERS) {
    const params = new URLSearchParams();

    if (filters.type) params.set("type", filters.type);
    if (filters.categoryId) params.set("categoryId", filters.categoryId);
    if (filters.from) params.set("from", filters.from);
    if (filters.to) params.set("to", filters.to);

    const query = params.toString();

    return useQuery({
        queryKey: [...QUERY_KEY, filters],
        queryFn: () =>
            api<Transaction[]>(`/api/transactions${query ? `?${query}` : ""}`),
        placeholderData: keepPreviousData,
    });
}

export function useCreateTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: NewTransaction) =>
            api<Transaction>("/api/transactions", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
    });
}

export function useDeleteTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) =>
            api<void>(`/api/transactions/${id}`, { method: "DELETE" }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
    });
}

export function useUpdateTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: NewTransaction }) =>
            api<Transaction>(`/api/transactions/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
    });
}