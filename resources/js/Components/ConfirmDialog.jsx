import { Modal, Button } from '@/Components'
import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({ open, onClose, onConfirm, title = 'Confirmar exclusão', message, confirmLabel = 'Excluir', itemLabel }) {
    return (
        <Modal open={open} onClose={onClose} title={title}>
            <div className="flex items-start gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                    <p className="text-sm text-gray-600">{message}</p>
                    {itemLabel && (
                        <p className="text-sm font-semibold text-gray-800 mt-1">"{itemLabel}"</p>
                    )}
                </div>
            </div>
            <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={onClose}>Cancelar</Button>
                <button
                    onClick={() => { onConfirm(); onClose() }}
                    className="inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition cursor-pointer"
                >
                    {confirmLabel}
                </button>
            </div>
        </Modal>
    )
}
