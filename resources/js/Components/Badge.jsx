export default function Badge({ children, variant = 'default', className = '' }) {
    const variants = {
        default: 'bg-gray-100 text-gray-500 ring-1 ring-gray-200/60',
        income: 'bg-green-600/10 text-green-600 ring-1 ring-green-600/20',
        expense: 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20',
        green: 'bg-green-600/10 text-green-600 ring-1 ring-green-600/20',
        warning: 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20',
    }

    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
            {children}
        </span>
    )
}
