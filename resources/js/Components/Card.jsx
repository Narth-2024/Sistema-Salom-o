export default function Card({ children, className = '', padding = true, hover = false, accent = false, ...props }) {
    return (
        <div
            className={`bg-surface border border-gray-200/60 rounded-2xl ${hover ? 'hover:border-gray-300/60 hover:-translate-y-0.5 transition-all duration-200' : ''} ${padding ? 'p-6' : ''} relative ${className}`}
            {...props}
        >
            {accent && (
                <div className={`absolute top-0 ${padding ? 'left-6 right-6' : 'left-0 right-0'} h-[2px] rounded-full ${accent === true ? 'bg-green-600' : accent === 'danger' ? 'bg-red-400' : accent === 'info' ? 'bg-indigo-400' : accent === 'warning' ? 'bg-amber-500' : accent}`} />
            )}
            {children}
        </div>
    )
}
