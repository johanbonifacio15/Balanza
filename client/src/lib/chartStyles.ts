import type { CSSProperties } from "react";

const contentStyle: CSSProperties = {
    backgroundColor: "var(--color-background)",
    border: "1px solid var(--color-border)",
    borderRadius: 12,
    fontSize: 13,
};

const textStyle: CSSProperties = { color: "var(--color-foreground)" };

// Estilos compartidos por los tooltips de las graficas con los colores del tema
export const tooltipProps = {
    contentStyle,
    itemStyle: textStyle,
    labelStyle: textStyle,
};