import type { ReactNode } from "react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

type AuthLayoutProps = {
    title: string;
    subtitle: string;
    children: ReactNode;
};

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
            <div className="absolute right-4 top-4">
                <ThemeToggle />
            </div>

            <Logo />

            <div className="glass mt-6 w-full max-w-sm rounded-2xl p-8 motion-safe:animate-fade-up">
                <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                <p className="mt-1 text-sm text-muted">{subtitle}</p>

                {children}
            </div>
        </div>
    );
}