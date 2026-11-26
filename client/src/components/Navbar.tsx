import { LogOut } from "lucide-react";
import { useAuth } from "../context/authContext";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
    const { user, logout } = useAuth();

    return (
        <header className="sticky top-0 z-10 border-b border-border bg-surface backdrop-blur-xl">
            <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
                <Logo />

                <div className="flex items-center gap-1">
                    <span className="mr-2 hidden text-sm text-muted sm:block">
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