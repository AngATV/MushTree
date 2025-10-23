"use client";

import { useEffect } from "react";

export function Modal({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: React.ReactNode; title?: string }) {
  useEffect(() => {
    function esc(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    if (open) document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl rounded-xl border border-white/10 bg-[#0b1216] p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="text-lg font-semibold">{title ?? 'Édition'}</div>
            <button onClick={onClose} className="text-white/60 hover:text-white">✕</button>
          </div>
          <div className="max-h-[85vh] overflow-hidden pr-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}


