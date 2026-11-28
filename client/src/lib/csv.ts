import type { Transaction } from "../types";

const HEADERS = ["Fecha", "Tipo", "Descripción", "Categoría", "Moneda", "Monto"];

// Prepara un campo para el CSV
function escapeField(value: string) {
    const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;

    if (/[",\r\n]/.test(safe)) {
        return `"${safe.replace(/"/g, '""')}"`;
    }

    return safe;
}

export function transactionsToCsv(transactions: Transaction[]) {
    const rows = transactions.map((transaction) => [
        transaction.date.slice(0, 10),
        transaction.type === "INCOME" ? "Ingreso" : "Gasto",
        transaction.description,
        transaction.category?.name ?? "Sin categoría",
        transaction.currency,
        Number(transaction.amount).toFixed(2),
    ]);

    return [HEADERS, ...rows]
        .map((row) => row.map(escapeField).join(","))
        .join("\r\n");
}

// Descarga el texto como archivo sin pasar por el servidor
export function downloadCsv(filename: string, content: string) {
    const blob = new Blob(["\uFEFF" + content], {
        type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}