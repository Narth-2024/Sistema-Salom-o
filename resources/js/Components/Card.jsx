export default function Card({ children, className = '', padding = true, ...props }) {
    return (
        <div
            className={`bg-surface border border-green-200 rounded-2xl shadow-sm ${padding ? 'p-6' : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    )
}
