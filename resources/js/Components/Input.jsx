import { forwardRef } from 'react'

const Input = forwardRef(({ label, error, icon: Icon, className = '', ...props }, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Icon className="w-4 h-4" />
                    </div>
                )}
                <input
                    ref={ref}
                    className={`w-full px-4 py-2.5 rounded-xl border bg-white text-sm text-gray-800 placeholder-gray-400
                        transition focus:outline-none focus:ring-2
                        ${Icon ? 'pl-10' : ''}
                        ${error
                            ? 'border-danger focus:ring-danger/20 focus:border-danger'
                            : 'border-gray-200 focus:ring-green-600/20 focus:border-green-600'
                        }
                        ${className}`}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1.5 text-xs text-danger">{error}</p>
            )}
        </div>
    )
})

Input.displayName = 'Input'
export default Input
