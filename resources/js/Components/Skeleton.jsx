export default function Skeleton({ rows = 4, className = '' }) {
    return (
        <div className={`animate-pulse space-y-3 ${className}`}>
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-surface-elevated">
                    <div className="w-10 h-10 rounded-lg bg-gray-200/60 dark:bg-gray-700/40 shrink-0" />
                    <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-200/60 dark:bg-gray-700/40 rounded w-1/3" />
                        <div className="h-3 bg-gray-200/40 dark:bg-gray-700/30 rounded w-1/5" />
                    </div>
                    <div className="h-4 bg-gray-200/50 dark:bg-gray-700/30 rounded w-20 shrink-0" />
                </div>
            ))}
        </div>
    )
}
