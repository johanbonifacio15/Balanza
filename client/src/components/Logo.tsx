import { Scale } from "lucide-react";

export function Logo() {
    return (
        <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/40">
                <Scale size={18} />
            </span>
            <span className="text-lg font-semibold tracking-tight">Balanza</span>
        </div>
    );
}