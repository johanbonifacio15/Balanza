const blockClass = "rounded-xl bg-border/60";

export function SummarySkeleton() {
    return (
        <div className="grid animate-pulse grid-cols-2 gap-3 sm:grid-cols-3">
            <div className={`h-24 ${blockClass}`} />
            <div className={`h-24 ${blockClass}`} />
            <div className={`col-span-2 h-24 sm:col-span-1 ${blockClass}`} />
        </div>
    );
}

export function ListSkeleton() {
    return <div className={`h-64 animate-pulse ${blockClass}`} />;
}