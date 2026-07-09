import { Head, Link, usePage, useForm } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout.jsx'
import { Card, Button, Input } from '@/Components'
import useTheme from '@/hooks/useTheme'
import { Sun, Moon, ArrowLeft, Palette, User, Camera, CheckCircle } from 'lucide-react'
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

    const avatarSrc = preview || user.avatar_url || null

    return (
        <AppLayout>
            <Head title="Configurações" />

            <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="mb-6">
                    <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 font-medium mb-4 transition">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <User className="w-7 h-7 text-green-600" />
                        Configurações
                    </h1>
                    <p className="text-gray-500 mt-1">Personalize sua experiência no Salomão.</p>
                </div>

                {/* Profile */}
                <Card accent className="mb-6">
                    <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <User className="w-4 h-4 text-green-600" />
                        Perfil
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="flex items-center gap-5 mb-6">
                            <div className="relative shrink-0">
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 ring-1 ring-white/5 flex items-center justify-center">
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
                                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center shadow-md hover:bg-green-500 transition cursor-pointer"
                                >
                                    <Camera className="w-3 h-3 text-white" />
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

                        <div className="flex items-center gap-3 pt-2 border-t border-gray-200/60">
                            <Button type="submit" variant="primary" disabled={processing}>
                                {recentlySuccessful ? <CheckCircle className="w-4 h-4" /> : null}
                                {processing ? 'Salvando...' : 'Salvar'}
                            </Button>
                            {recentlySuccessful && (
                                <span className="text-xs text-green-600 font-medium">Salvo!</span>
                            )}
                        </div>
                    </form>
                </Card>

                {/* Theme */}
                <Card accent>
                    <h2 className="text-base font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <Palette className="w-4 h-4 text-green-600" />
                        Aparência
                    </h2>
                    <p className="text-sm text-gray-500 mb-5">Escolha entre tema escuro ou claro.</p>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ring-1 ring-white/5 ${theme === 'dark' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-amber-500/10 text-amber-500'}`}>
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
                            onClick={toggle}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 cursor-pointer shrink-0 ${
                                theme === 'dark' ? 'bg-green-600' : 'bg-gray-200'
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
            </main>
        </AppLayout>
    )
}
