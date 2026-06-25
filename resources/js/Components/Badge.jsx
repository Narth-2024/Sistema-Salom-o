export default function Badge({ children, variant = 'default', className = '' }) {
    const variants = {
        default: 'bg-gray-100 text-gray-700',
        income: 'bg-success-light text-success',
        expense: 'bg-danger-light text-danger',
        green: 'bg-green-100 text-green-800',
        warning: 'bg-amber-100 text-amber-800',
    }

    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
            {children}
        </span>
    )
}
