import { Head, Link, usePage, useForm } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout.jsx'
import { Card, Button, Input, Modal, ONBOARDING_STORAGE } from '@/Components'
import { startAppTour } from '@/tour/AppTour'
import useTheme from '@/hooks/useTheme'
import useLogout from '@/hooks/useLogout'
import { usePWAInstall } from '@/lib/pwa'
import { Sun, Moon, ArrowLeft, Palette, User, Camera, CheckCircle, LifeBuoy, RefreshCcw, Star, Bug, Lock, Download, Smartphone, Trash2, AlertTriangle } from 'lucide-react'
import { useRef, useState } from 'react'

export default function Settings() {
    const { theme, toggle } = useTheme()
    const { auth } = usePage().props
    const user = auth.user
    const { canInstall, isInstalled, isIOS, promptInstall } = usePWAInstall()
    const logout = useLogout()

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        name: user.name || '',
        avatar: null,
    })

    const [preview, setPreview] = useState(null)
    const fileRef = useRef(null)

    const deleteForm = useForm({
        confirmation: '',
    })
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    function handleSubmit(e) {
        e.preventDefault()
        post('/settings/profile', {
            forceFormData: true,
            preserveScroll: true,
        })
    }

    function handleDeleteSubmit(e) {
        e.preventDefault()
        deleteForm.delete('/settings/profile', {
            preserveScroll: true,
            onSuccess: () => {
                window.location.href = '/'
            },
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

            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
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
                <Card className="mb-6" data-tour="settings-profile">
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
                                    aria-label="Trocar foto do perfil"
                                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md hover:bg-primary-hover transition cursor-pointer"
                                >
                                    <Camera className="w-3 h-3 text-primary-fg" aria-hidden="true" />
                                </button>
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFile}
                                    aria-label="Selecionar nova foto"
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

                {/* Password — gerenciada pelo Clerk */}
                <Card className="mt-6" data-tour="settings-password">
                    <h2 className="text-base font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-accent-text" />
                        Senha de acesso
                    </h2>
                    <p className="text-sm text-gray-500 mb-5">
                        A senha é cuidada pela sua conta no Clerk, não pelo sistema.
                    </p>

                    <div className="bg-surface border border-border rounded-xl p-4 flex items-start gap-3">
                        <Lock className="w-5 h-5 text-accent-text shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-600">
                            Para alterar sua senha, saia e entre novamente: na tela de login, use
                            <strong className="text-gray-800"> &quot;Esqueci minha senha&quot;</strong> e
                            siga o link enviado para o seu e-mail.
                        </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-border">
                        <Button type="button" onClick={() => logout({ redirectUrl: '/login' })}>
                            <RefreshCcw className="w-4 h-4" />
                            Sair para alterar a senha
                        </Button>
                    </div>
                </Card>

                {/* Theme */}
                <Card data-tour="settings-theme">
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

                {/* Install app */}
                <Card className="mt-6" data-tour="settings-install">
                    <h2 className="text-base font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <Download className="w-4 h-4 text-accent-text" />
                        Instalar aplicativo
                    </h2>
                    <p className="text-sm text-gray-500 mb-5">
                        Instale o Salomão na tela inicial do celular para abrir como um aplicativo, em tela cheia.
                    </p>

                    {isInstalled ? (
                        <div className="flex items-center gap-2 text-sm text-accent-text font-medium">
                            <CheckCircle className="w-4 h-4" />
                            Aplicativo instalado neste dispositivo.
                        </div>
                    ) : canInstall ? (
                        <Button variant="primary" onClick={() => promptInstall()}>
                            <Download className="w-4 h-4" />
                            Instalar agora
                        </Button>
                    ) : isIOS ? (
                        <div className="text-sm text-gray-600 space-y-1">
                            <p className="font-medium text-gray-700 flex items-center gap-2">
                                <Smartphone className="w-4 h-4 text-accent-text" />
                                No iPhone/iPad:
                            </p>
                            <p>1. Abra esta página no <strong>Safari</strong></p>
                            <p>2. Toque em <strong>Compartilhar</strong> (ícone de quadrado com seta)</p>
                            <p>3. Escolha <strong>Adicionar à Tela de Início</strong></p>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">
                            Para instalar, abra o sistema pelo <strong>Chrome</strong> ou <strong>Edge</strong> no celular — o botão de instalação fica disponível na barra de endereço.
                        </p>
                    )}
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

                {/* Danger zone — delete account */}
                <Card className="mt-6" accent="danger" data-tour="settings-account">
                    <h2 className="text-base font-semibold text-red-500 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Excluir conta
                    </h2>
                    <p className="text-sm text-gray-500 mb-5">
                        Ao excluir sua conta, <strong className="text-gray-700">todos os seus dados serão removidos definitivamente</strong>:
                        transações, categorias, tags e simulações de investimento. Esta ação não pode ser desfeita.
                    </p>

                    {!showDeleteConfirm ? (
                        <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
                            <Trash2 className="w-4 h-4" />
                            Excluir minha conta
                        </Button>
                    ) : (
                        <form onSubmit={handleDeleteSubmit} className="space-y-4">
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                <p className="text-sm text-red-400">
                                    Essa ação é <strong>irreversível</strong>. Digite seu e-mail para confirmar.
                                </p>
                            </div>
                            <Input
                                label="Confirme com seu e-mail"
                                type="email"
                                placeholder={user.email}
                                value={deleteForm.data.confirmation}
                                onChange={e => deleteForm.setData('confirmation', e.target.value)}
                                autoComplete="off"
                                required
                                error={deleteForm.errors.confirmation}
                            />
                            <div className="flex items-center gap-3 pt-2 border-t border-border">
                                <Button type="submit" variant="danger" disabled={deleteForm.processing}>
                                    <Trash2 className="w-4 h-4" />
                                    {deleteForm.processing ? 'Excluindo...' : 'Confirmar exclusão definitiva'}
                                </Button>
                                <button
                                    type="button"
                                    onClick={() => { setShowDeleteConfirm(false); deleteForm.reset() }}
                                    className="px-5 py-2.5 text-sm text-gray-500 hover:text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition cursor-pointer"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    )}
                </Card>
            </div>
        </AppLayout>
    )
}
