import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

type ModalProps = {
    title: string;
    onClose: () => void;
    children: ReactNode;
};

export function Modal({ title, onClose, children }: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;

        if (dialog && !dialog.open) {
            dialog.showModal();
        }
    }, []);

    return (
        <dialog
            ref={dialogRef}
            onClose={onClose}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    dialogRef.current?.close();
                }
            }}
            className="m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl border border-border bg-background p-0 text-foreground shadow-xl backdrop:bg-black/50 backdrop:backdrop-blur-sm"
        >
            <div className="p-5">
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-sm font-semibold">{title}</h2>

                    <button
                        onClick={() => dialogRef.current?.close()}
                        aria-label="Cerrar"
                        className="shrink-0 rounded-lg p-1.5 text-muted transition-colors hover:bg-border/60 hover:text-foreground"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="mt-4">{children}</div>
            </div>
        </dialog>
    );
}