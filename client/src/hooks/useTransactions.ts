import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {api} from "../lib/api";
import type {NewTransaction, Transaction} from "../types";

const QUERY_KEY = ["transactions"];

export function useTransactions() {
    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: () => api<Transaction[]>("/api/transactions"),
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