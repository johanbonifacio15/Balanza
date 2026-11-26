import type { Currency } from "../types";

// Da formato de moneda segun el tipo
export function formatMoney(amount: number, currency: Currency) {
    return new Intl.NumberFormat("es-DO", {
        style: "currency",
        currency,
    }).format(amount);
}

// Las fechas se guardan a medianoche UTC
export function formatDate(date: string) {
    return new Date(date).toLocaleDateString("es-DO", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    });
}