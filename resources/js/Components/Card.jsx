export default function Card({ children, className = '', padding = true, hover = false, accent = false, ...props }) {
    return (
        <div
            className={`bg-surface border border-border rounded-2xl shadow-sm ${hover ? 'hover:border-border-strong hover:-translate-y-0.5 transition duration-200' : ''} ${padding ? 'p-6' : ''} relative ${className}`}
            {...props}
        >
            {accent && (
                <div className={`absolute top-0 ${padding ? 'left-6 right-6' : 'left-0 right-0'} h-[2px] rounded-full ${accent === true ? 'bg-primary' : accent === 'danger' ? 'bg-red-400' : accent === 'info' ? 'bg-indigo-400' : accent === 'warning' ? 'bg-amber-500' : accent}`} />
            )}
            {children}
        </div>
    )
}
