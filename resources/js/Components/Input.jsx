import { forwardRef, useId } from 'react'

const Input = forwardRef(({ label, error, icon: Icon, className = '', id: idProp, ...props }, ref) => {
    const autoId = useId()
    const id = idProp || autoId
    const errorId = `${id}-error`

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-600 mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500" aria-hidden="true">
                        <Icon className="w-4 h-4" />
                    </div>
                )}
                <input
                    ref={ref}
                    id={id}
                    aria-invalid={error ? 'true' : undefined}
                    aria-describedby={error ? errorId : undefined}
                    className={`w-full px-4 py-2.5 rounded-xl border bg-surface-elevated text-sm text-gray-800 placeholder-gray-500
                        transition duration-150 focus:outline-none focus:ring-2
                        ${Icon ? 'pl-10' : ''}
                        ${error
                            ? 'border-red-500/30 focus:ring-red-500/20 focus:border-red-500/50'
                            : 'border-border-strong focus:ring-primary/20 focus:border-primary/50'
                        }
                        ${className}`}
                    {...props}
                />
            </div>
            {error && (
                <p id={errorId} className="mt-1.5 text-xs text-red-400">{error}</p>
            )}
        </div>
    )
})

Input.displayName = 'Input'
export default Input
