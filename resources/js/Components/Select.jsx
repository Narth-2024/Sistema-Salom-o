export default function Select({ label, error, icon: Icon, children, className = '', ...props }) {
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
                <select
                    className={`w-full px-4 py-2.5 rounded-xl border bg-white text-sm text-gray-800
                        transition focus:outline-none focus:ring-2 appearance-none
                        ${Icon ? 'pl-10' : ''}
                        ${error
                            ? 'border-danger focus:ring-danger/20 focus:border-danger'
                            : 'border-gray-200 focus:ring-green-600/20 focus:border-green-600'
                        }
                        ${className}`}
                    {...props}
                >
                    {children}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            {error && (
                <p className="mt-1.5 text-xs text-danger">{error}</p>
            )}
        </div>
    )
}
