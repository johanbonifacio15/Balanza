import { LogOut, Moon, Scale, Sun } from "lucide-react";
import { useAuth } from "../context/authContext";
import { useTheme } from "../hooks/useTheme";

export function Navbar() {
    const { user, logout } = useAuth();
    const { dark, toggle } = useTheme();

    return (
        <header className="sticky top-0 z-10 border-b border-border bg-surface/80 backdrop-blur">
            <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Scale size={18} />
                    </span>
                    <span className="text-lg font-semibold tracking-tight">
                        Balanza
                    </span>
                </div>

                <div className="flex items-center gap-1">
                    <span className="mr-2 hidden text-sm text-muted sm:block">
                        {user?.name}
                    </span>

                    <button
                        onClick={toggle}
                        aria-label={
                            dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
                        }
                        className="rounded-lg p-2 text-muted hover:bg-background hover:text-foreground"
                    >
                        {dark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    <button
                        onClick={logout}
                        aria-label="Cerrar sesión"
                        className="rounded-lg p-2 text-muted hover:bg-background hover:text-foreground"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
}