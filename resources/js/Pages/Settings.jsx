import { Head, Link, usePage, useForm } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout.jsx'
import { Card, Button, Input, ONBOARDING_STORAGE } from '@/Components'
import { startAppTour } from '@/tour/AppTour'
import useTheme from '@/hooks/useTheme'
import { Sun, Moon, ArrowLeft, Palette, User, Camera, CheckCircle, LifeBuoy, RefreshCcw, Star, Bug } from 'lucide-react'
import { useRef, useState } from 'react'

export default function Settings() {
    const { theme, toggle } = useTheme()
    const { auth } = usePage().props
    const user = auth.user

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        name: user.name || '',
        avatar: null,
    })

    const [preview, setPreview] = useState(null)
    const fileRef = useRef(null)

    function handleSubmit(e) {
        e.preventDefault()
        post('/settings/profile', {
            forceFormData: true,
            preserveScroll: true,
        })
    }

    function handleFile(e) {
        const file = e.target.files[0]
        if (!file) return
        setData('avatar', file)
        const reader = new FileReader()
        reader.onload = () => setPreview(reader.result)
        reader.readAsDataURL(file)
    }

    function restartTutorial() {
        localStorage.removeItem(ONBOARDING_STORAGE.DISMISSED)
        startAppTour()
    }

    const avatarSrc = preview || user.avatar_url || null

    return (
        <AppLayout>
            <Head title="Configurações" />

            <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="mb-6 sm:mb-8">
                    <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium mb-4 transition">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <User className="w-7 h-7 text-accent-text" />
                        Configurações
                    </h1>
                    <p className="text-gray-500 mt-1">Personalize sua experiência no Salomão.</p>
                </div>

                {/* Profile */}
                <Card className="mb-6">
                    <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <User className="w-4 h-4 text-accent-text" />
                        Perfil
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="flex items-center gap-5 mb-6">
                            <div className="relative shrink-0">
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 ring-1 ring-border-strong flex items-center justify-center">
                                    {avatarSrc ? (
                                        <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-lg font-bold text-gray-500">
                                            {user.name?.charAt(0).toUpperCase() || '?'}
                                        </span>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fileRef.current?.click()}
                                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md hover:bg-primary-hover transition cursor-pointer"
                                >
                                    <Camera className="w-3 h-3 text-primary-fg" />
                                </button>
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFile}
                                    className="hidden"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-700">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {avatarSrc ? 'Clique no ícone para trocar a foto' : 'Adicione uma foto de perfil'}
                                </p>
                            </div>
                        </div>

                        <div className="mb-5">
                            <Input
                                label="Nome"
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                required
                                placeholder="Seu nome"
                                error={errors.name}
                            />
                        </div>

                        {errors.avatar && (
                            <p className="text-xs text-red-400 mb-4">{errors.avatar}</p>
                        )}

                        <div className="flex items-center gap-3 pt-2 border-t border-border">
                            <Button type="submit" variant="primary" disabled={processing}>
                                {recentlySuccessful ? <CheckCircle className="w-4 h-4" /> : null}
                                {processing ? 'Salvando...' : 'Salvar'}
                            </Button>
                            {recentlySuccessful && (
                                <span className="text-xs text-accent-text font-medium">Salvo!</span>
                            )}
                        </div>
                    </form>
                </Card>

                {/* Theme */}
                <Card>
                    <h2 className="text-base font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <Palette className="w-4 h-4 text-accent-text" />
                        Aparência
                    </h2>
                    <p className="text-sm text-gray-500 mb-5">Escolha entre tema escuro ou claro.</p>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ring-1 ring-border-strong ${theme === 'dark' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-amber-500/10 text-amber-500'}`}>
                                {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">Tema {theme === 'dark' ? 'escuro' : 'claro'}</p>
                                <p className="text-xs text-gray-500">
                                    {theme === 'dark' ? 'Atual: fundo escuro com acentos verdes' : 'Atual: fundo claro com acentos verdes'}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            role="switch"
                            aria-checked={theme === 'dark'}
                            aria-label="Alternar entre tema escuro e claro"
                            onClick={toggle}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 cursor-pointer shrink-0 ${
                                theme === 'dark' ? 'bg-primary' : 'bg-gray-200'
                            }`}
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 shadow-sm ${
                                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>
                </Card>

                {/* Help / onboarding */}
                <Card className="mt-6" data-tour="help-card">
                    <h2 className="text-base font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <LifeBuoy className="w-4 h-4 text-accent-text" />
                        Ajuda
                    </h2>
                    <p className="text-sm text-gray-500 mb-5">
                        Refaça o tutorial de boas-vindas e o checklist da Dashboard quando quiser.
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                        <Button variant="outline" onClick={restartTutorial}>
                            <RefreshCcw className="w-4 h-4" />
                            Assistir tutorial novamente
                        </Button>
                        <a
                            href="https://forms.gle/KVW3gTD4VymBX8HK8"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-tour="help-survey"
                            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-fg hover:bg-primary-hover px-4 py-2 rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition cursor-pointer"
                        >
                            <Star className="w-4 h-4" />
                            Avaliar o sistema
                        </a>
                        <a
                            href="https://github.com/Narth-2024/Sistema-Salom-o/issues/new?template=bug_report.md"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-tour="help-bug"
                            className="inline-flex items-center justify-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer"
                        >
                            <Bug className="w-4 h-4" />
                            Reportar bug
                        </a>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                        O formulário de avaliação deve ser respondido após o uso do sistema — leva menos de 2 minutos.
                        Encontrou um erro? Clique em "Reportar bug" para abrir um issue no GitHub.
                    </p>
                </Card>
            </main>
        </AppLayout>
    )
}
