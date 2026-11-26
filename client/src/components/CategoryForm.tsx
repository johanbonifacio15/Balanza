import { useState } from "react";
import type { FormEvent } from "react";
import { useCreateCategory } from "../hooks/useCategories";
import { fieldClass, primaryButtonClass } from "../lib/styles";

export function CategoryForm() {
    const createCategory = useCreateCategory();

    const [name, setName] = useState("");
    const [color, setColor] = useState("#6366f1");

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        createCategory.mutate(
            { name, color },
            { onSuccess: () => setName("") },
        );
    }

    return (
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-5">
            <h2 className="text-sm font-semibold">Nueva categoría</h2>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                <label className="block flex-1 text-sm font-medium">
                    Nombre
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        maxLength={30}
                        className={fieldClass}
                    />
                </label>

                <label className="block text-sm font-medium">
                    Color
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="mt-1 block h-[38px] w-14 cursor-pointer rounded-lg border border-border bg-background/60 p-1"
                    />
                </label>

                <button
                    type="submit"
                    disabled={createCategory.isPending}
                    className={primaryButtonClass}
                >
                    {createCategory.isPending ? "Agregando..." : "Agregar"}
                </button>
            </div>

            {createCategory.isError && (
                <p className="mt-4 text-sm text-expense">
                    {createCategory.error.message}
                </p>
            )}
        </form>
    );
}