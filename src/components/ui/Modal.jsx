import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { FiX } from 'react-icons/fi';

export default function Modal({ aberto, aoFechar, titulo, children, className = '' }) {
  return (
    <Dialog open={aberto} onClose={aoFechar} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-ink/40 transition-opacity duration-150" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel
          className={`w-full max-w-lg rounded-xl bg-surface p-6 shadow-xl ${className}`}
        >
          <div className="mb-4 flex items-center justify-between">
            {titulo && (
              <DialogTitle className="font-serif text-xl text-ink">{titulo}</DialogTitle>
            )}
            <button
              onClick={aoFechar}
              aria-label="Fechar"
              className="ml-auto rounded-full p-1 text-muted hover:bg-black/5 hover:text-ink"
            >
              <FiX size={20} />
            </button>
          </div>
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
