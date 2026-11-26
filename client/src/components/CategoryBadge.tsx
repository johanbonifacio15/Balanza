type CategoryBadgeProps = {
    name: string;
    color: string;
};

export function CategoryBadge({ name, color }: CategoryBadgeProps) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-border/50 px-2 py-0.5 text-xs text-muted">
            <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: color }}
            />
            {name}
        </span>
    );
}