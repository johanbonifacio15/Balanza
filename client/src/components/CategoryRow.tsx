import { Check, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { useDeleteCategory, useUpdateCategory } from "../hooks/useCategories";
import type { Category } from "../types";

const inputClass =
    "min-w-0 flex-1 rounded-lg border border-border bg-background/60 px-3 py-1.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

const iconButtonClass =
    "shrink-0 rounded-lg p-1.5 text-muted transition-colors hover:bg-border/60 hover:text-foreground";

export function CategoryRow({ category }: { category: Category }) {
    const updateCategory = useUpdateCategory();
    const deleteCategory = useDeleteCategory();

    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(category.name);
    const [color, setColor] = useState(category.color);

    function handleSave(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        updateCategory.mutate(
            { id: category.id, data: { name, color } },
            { onSuccess: () => setEditing(false) },
        );
    }

    function handleCancel() {
        setName(category.name);
        setColor(category.color);
        updateCategory.reset();
        setEditing(false);
    }

    function handleDelete() {
        const message =
            "¿Eliminar esta categoría? Sus transacciones se quedarán sin categoría.";

        if (window.confirm(message)) {
            deleteCategory.mutate(category.id);
        }
    }

    if (editing) {
        return (
            <li className="px-4 py-3">
                <form onSubmit={handleSave} className="flex items-center gap-2">
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        aria-label="Color de la categoría"
                        className="h-8 w-10 shrink-0 cursor-pointer rounded-lg border border-border bg-background/60 p-1"
                    />

                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        maxLength={30}
                        aria-label="Nombre de la categoría"
                        className={inputClass}
                    />

                    <button
                        type="submit"
                        disabled={updateCategory.isPending}
                        aria-label="Guardar cambios"
                        className={`${iconButtonClass} hover:text-income`}
                    >
                        <Check size={16} />
                    </button>

                    <button
                        type="button"
                        onClick={handleCancel}
                        aria-label="Cancelar"
                        className={iconButtonClass}
                    >
                        <X size={16} />
                    </button>
                </form>

                {updateCategory.isError && (
                    <p className="mt-2 text-sm text-expense">
                        {updateCategory.error.message}
                    </p>
                )}
            </li>
        );
    }

    return (
        <li className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-background/60">
            <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: category.color }}
            />

            <span className="min-w-0 flex-1 truncate text-sm font-medium">
                {category.name}
            </span>

            <button
                onClick={() => setEditing(true)}
                aria-label="Editar categoría"
                className={iconButtonClass}
            >
                <Pencil size={16} />
            </button>

            <button
                onClick={handleDelete}
                aria-label="Eliminar categoría"
                className="shrink-0 rounded-lg p-1.5 text-muted transition-colors hover:bg-expense/10 hover:text-expense"
            >
                <Trash2 size={16} />
            </button>
        </li>
    );
}