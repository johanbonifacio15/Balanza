import { Download } from "lucide-react";
import { downloadCsv, transactionsToCsv } from "../lib/csv";
import type { Transaction } from "../types";

type ExportButtonProps = {
    transactions: Transaction[];
    filtered: boolean;
};

export function ExportButton({ transactions, filtered }: ExportButtonProps) {
    function handleExport() {
        const filename = `balanza-${new Date().toLocaleDateString("en-CA")}.csv`;

        downloadCsv(filename, transactionsToCsv(transactions));
    }

    return (
        <button
            onClick={handleExport}
            disabled={transactions.length === 0}
            title={
                filtered
                    ? "Exporta solo los movimientos filtrados"
                    : "Exporta todos los movimientos"
            }
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-border/60 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-muted"
        >
            <Download size={14} />
            Exportar CSV
        </button>
    );
}