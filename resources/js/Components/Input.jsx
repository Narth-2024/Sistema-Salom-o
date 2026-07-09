import { forwardRef } from 'react'

const Input = forwardRef(({ label, error, icon: Icon, className = '', ...props }, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <Icon className="w-4 h-4" />
                    </div>
                )}
                <input
                    ref={ref}
                    className={`w-full px-4 py-2.5 rounded-xl border bg-surface-elevated text-sm text-gray-800 placeholder-gray-500
                        transition-all duration-150 focus:outline-none focus:ring-2
                        ${Icon ? 'pl-10' : ''}
                        ${error
                            ? 'border-red-500/30 focus:ring-red-500/20 focus:border-red-500/50'
                            : 'border-gray-200/60 focus:ring-green-600/20 focus:border-green-600/50'
                        }
                        ${className}`}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1.5 text-xs text-red-400">{error}</p>
            )}
        </div>
    )
})

Input.displayName = 'Input'
export default Input
