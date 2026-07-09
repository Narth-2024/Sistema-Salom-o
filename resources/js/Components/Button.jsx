export default function Button({ children, variant = 'primary', size = 'md', className = '', disabled, ...props }) {
    const base = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]'

    const variants = {
        primary: 'bg-green-600 text-white hover:bg-green-500 shadow-lg shadow-green-600/15',
        secondary: 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-500 ring-1 ring-gray-200',
        danger: 'bg-red-500/10 text-red-400 hover:bg-red-500/20 ring-1 ring-red-500/15',
        ghost: 'text-gray-500 hover:text-gray-400 hover:bg-gray-100',
        outline: 'border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-500',
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
