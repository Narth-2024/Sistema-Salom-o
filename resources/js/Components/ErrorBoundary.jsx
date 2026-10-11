import { Component } from 'react'

// Evita tela branca quando um componente React lança erro durante o render.
// Mostra uma mensagem amigável com opção de recarregar.
export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        // Em produção, apenas loga no console (sem vazar detalhes na tela)
        console.error('Erro na aplicação:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-surface px-4">
                    <div className="text-center max-w-md">
                        <div className="w-16 h-16 mx-auto bg-red-500/10 rounded-2xl flex items-center justify-center mb-5">
                            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold text-gray-800 mb-2">Algo deu errado</h1>
                        <p className="text-sm text-gray-500 mb-6">
                            Ocorreu um erro inesperado. Recarregue a página para tentar novamente.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center gap-2 bg-primary text-primary-fg font-semibold px-6 py-3 rounded-xl hover:bg-primary-hover transition shadow-sm cursor-pointer"
                        >
                            Recarregar página
                        </button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}
