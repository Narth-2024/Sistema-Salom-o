export default function Progress({ value = 0, max = 100, className = '', barClassName = '' }) {
    const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0

    return (
        <div className={`h-1.5 w-full bg-gray-200 rounded-full ${className}`}>
            <div
                className={`h-full rounded-full transition duration-500 ${barClassName || 'bg-primary'}`}
                style={{ width: `${pct}%` }}
            />
        </div>
    )
}
