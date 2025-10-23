"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminBannerItem } from "@/components/AdminBannerItem";
import { Modal } from "@/components/Modal";

type Banner = {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  featured: boolean;
  category: string | null;
  tags: string[] | null;
  position: number;
};

export function AdminBannerGrid({ initial }: { initial: Banner[] }) {
  const [items, setItems] = useState<Banner[]>(initial);
  const [openId, setOpenId] = useState<string|null>(null);
  const router = useRouter();

  useEffect(() => { setItems(initial); }, [initial]);

  function onDragStart(e: React.DragEvent<HTMLDivElement>, id: string) {
    e.dataTransfer.setData("text/plain", id);
  }

  function onDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>, targetId: string) {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData("text/plain");
    if (!sourceId || sourceId === targetId) return;
    const current = [...items];
    const from = current.findIndex(i => i.id === sourceId);
    const to = current.findIndex(i => i.id === targetId);
    if (from === -1 || to === -1) return;
    const [moved] = current.splice(from, 1);
    current.splice(to, 0, moved);
    setItems(current);
  }

  async function persist() {
    try {
      const res = await fetch('/api/banners/reorder', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ ids: items.map(i => i.id) })
      });
      if (!res.ok) throw new Error('reorder failed');
      router.refresh();
    } catch (e) {
      alert('Échec de la sauvegarde de l\'ordre');
    }
  }

  return (
    <div className="space-y-3">
      <div className="text-sm text-white/60">Glissez-déposez pour réordonner. Cliquez « Enregistrer l’ordre ».</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {items.map(b => (
          <div key={b.id} draggable onDragStart={(e) => onDragStart(e, b.id)} onDragOver={onDragOver} onDrop={(e) => onDrop(e, b.id)} className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition p-3">
            <div className="flex items-start gap-3">
              <div className="w-40 aspect-[16/9] overflow-hidden rounded bg-black/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.imageUrl} alt={b.title} className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold truncate">{b.title}</div>
                <div className="text-xs text-white/60 truncate">{b.linkUrl}</div>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => setOpenId(b.id)} className="px-3 py-1.5 rounded bg-white text-black text-sm">Éditer</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <button onClick={persist} className="px-4 py-2 rounded bg-white text-black font-semibold">Enregistrer l’ordre</button>
      </div>

      {/* Drawer/modal d'édition */}
      <Modal open={!!openId} onClose={() => setOpenId(null)} title="Éditer la bannière">
        {openId && (
          <AdminBannerItem banner={items.find(i => i.id === openId)!} />
        )}
      </Modal>
    </div>
  );
}


