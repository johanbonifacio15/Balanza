import { Tags } from "lucide-react";
import { CategoryForm } from "../components/CategoryForm";
import { CategoryRow } from "../components/CategoryRow";
import { ListSkeleton } from "../components/Skeletons";
import {
    useCategories,
    useRestoreDefaultCategories,
} from "../hooks/useCategories";
import { primaryButtonClass } from "../lib/styles";

export function CategoriesPage() {
    const { data: categories, isPending, error } = useCategories();
    const restoreDefaults = useRestoreDefaultCategories();

    return (
        <div className="space-y-8 motion-safe:animate-fade-up">
            <h1 className="text-2xl font-semibold tracking-tight">Categorías</h1>

            <CategoryForm />

            {error && <p className="text-sm text-expense">{error.message}</p>}

            {isPending && <ListSkeleton />}

            {categories && categories.length === 0 && (
                <div className="glass flex flex-col items-center rounded-2xl px-6 py-12 text-center">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary dark:text-indigo-300">
                        <Tags size={20} />
                    </span>
                    <p className="mt-4 text-sm font-medium">
                        Todavía no tienes categorías
                    </p>
                    <p className="mt-1 text-sm text-muted">
                        Crea la tuya arriba o empieza con unas de ejemplo.
                    </p>
                    <button
                        onClick={() => restoreDefaults.mutate()}
                        disabled={restoreDefaults.isPending}
                        className={`${primaryButtonClass} mt-5`}
                    >
                        {restoreDefaults.isPending
                            ? "Cargando..."
                            : "Cargar categorías de ejemplo"}
                    </button>
                </div>
            )}

            {categories && categories.length > 0 && (
                <ul className="glass divide-y divide-border overflow-hidden rounded-2xl">
                    {categories.map((category) => (
                        <CategoryRow key={category.id} category={category} />
                    ))}
                </ul>
            )}
        </div>
    );
}