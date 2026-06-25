export default function Button({ children, variant = 'primary', size = 'md', className = '', disabled, ...props }) {
    const base = 'inline-flex items-center justify-center font-medium rounded-xl transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
        primary: 'bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md',
        secondary: 'bg-green-100 text-green-800 hover:bg-green-200',
        danger: 'bg-danger text-white hover:bg-red-700 shadow-sm',
        ghost: 'text-gray-600 hover:bg-gray-100',
        outline: 'border border-green-600 text-green-600 hover:bg-green-50',
    }

    const sizes = {
        sm: 'px-3 py-1.5 text-xs gap-1.5',
        md: 'px-5 py-2.5 text-sm gap-2',
        lg: 'px-8 py-3 text-base gap-2.5',
    }

    return (
        <button
            className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    )
}
