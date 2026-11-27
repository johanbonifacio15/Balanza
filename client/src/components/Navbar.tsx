import { LayoutList, LogOut, PiggyBank, Tags } from "lucide-react";
import { NavLink } from "react-router";
import { useAuth } from "../context/authContext";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

function linkClass({ isActive }: { isActive: boolean }) {
    return `flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors ${
        isActive
            ? "bg-primary/10 text-foreground"
            : "text-muted hover:text-foreground"
    }`;
}

export function Navbar() {
    const { user, logout } = useAuth();

    return (
        <header className="sticky top-0 z-10 border-b border-border bg-surface backdrop-blur-xl">
            <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
                <Logo />

                <nav className="flex items-center gap-1">
                    <NavLink
                        to="/"
                        end
                        aria-label="Movimientos"
                        className={linkClass}
                    >
                        <LayoutList size={18} />
                        <span className="hidden sm:inline">Movimientos</span>
                    </NavLink>

                    <NavLink
                        to="/categories"
                        aria-label="Categorías"
                        className={linkClass}
                    >
                        <Tags size={18} />
                        <span className="hidden sm:inline">Categorías</span>
                    </NavLink>

                    <NavLink
                        to="/budgets"
                        aria-label="Presupuestos"
                        className={linkClass}
                    >
                        <PiggyBank size={18} />
                        <span className="hidden sm:inline">Presupuestos</span>
                    </NavLink>
                </nav>

                <div className="flex items-center gap-1">
                    <span className="mr-2 hidden text-sm text-muted md:block">
                        {user?.name}
                    </span>

                    <ThemeToggle />

                    <button
                        onClick={logout}
                        aria-label="Cerrar sesión"
                        className="rounded-lg p-2 text-muted transition-colors hover:bg-border/60 hover:text-foreground"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
}