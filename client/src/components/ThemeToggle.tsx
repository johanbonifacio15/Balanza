import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

export function ThemeToggle() {
    const { dark, toggle } = useTheme();

    return (
        <button
            onClick={toggle}
            aria-label={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            className="rounded-lg p-2 text-muted transition-colors hover:bg-border/60 hover:text-foreground"
        >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
}