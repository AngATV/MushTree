"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Banner = {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  featured: boolean;
  category: string | null;
  tags: string[] | null;
  position: number;
  bannerType?: string | null;
};

export function AdminBannerItem({ banner }: { banner: Banner }) {
  const router = useRouter();
  const [title, setTitle] = useState(banner.title);
  const [imageUrl, setImageUrl] = useState(banner.imageUrl);
  const [linkUrl, setLinkUrl] = useState(banner.linkUrl);
  const [featured, setFeatured] = useState<boolean>(!!banner.featured);
  const [category, setCategory] = useState<string>("");
  const [tags, setTags] = useState<string>((banner.tags ?? []).join(", "));
  const [position, setPosition] = useState<number>(banner.position ?? 0);
  const [depositMin, setDepositMin] = useState<string>((banner as any).depositMin ?? "");
  const [bonus, setBonus] = useState<string>((banner as any).bonus ?? "");
  const [cashback, setCashback] = useState<string>((banner as any).cashback ?? "");
  const [freeSpins, setFreeSpins] = useState<string>((banner as any).freeSpins ?? "");
  const [ctaLabel, setCtaLabel] = useState<string>((banner as any).ctaLabel ?? "Récupérer mon Bonus");
  const [bannerType, setBannerType] = useState<string>((banner as any).bannerType ?? 'square');
  const [description, setDescription] = useState<string>((banner as any).description ?? "");
  const [uploading, setUploading] = useState(false);

  async function startUpload(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd, credentials: 'include' });
      const { url } = await res.json();
      setImageUrl(url);
    } finally {
      setUploading(false);
    }
  }
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);
    await fetch(`/api/banners/${banner.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title, imageUrl, linkUrl, featured, category: null, tags: tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : [], position, depositMin: depositMin || null, bonus: bonus || null, cashback: cashback || null, freeSpins: freeSpins || null, ctaLabel, bannerType, description: description || null }),
    });
    setLoading(false);
    router.refresh();
  }

  async function remove() {
    if (!confirm("Supprimer cette bannière ?")) return;
    setLoading(true);
    await fetch(`/api/banners/${banner.id}`, { method: "DELETE", credentials: "include" });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="p-3 rounded border border-white/10 grid gap-3 md:grid-cols-[160px_1fr] items-start">
      <div className="aspect-[16/9] w-full overflow-hidden rounded bg-white/5">
        {/* Aperçu image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt={title} className="w-full h-full object-contain" />
      </div>
      <div className="space-y-2">
        <div className="grid md:grid-cols-2 gap-2">
          <input className="px-3 py-2 rounded bg-white/10 border border-white/20" value={title} onChange={(e) => setTitle(e.target.value)} />
          {/* catégorie retirée */}
        </div>
        <div className="flex gap-2">
          <input className="w-full px-3 py-2 rounded bg-white/10 border border-white/20" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          <label className="inline-flex items-center px-3 py-2 rounded bg-white text-black cursor-pointer min-w-[120px] justify-center">
            {uploading ? 'Upload…' : 'Uploader'}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && e.target.files[0] && startUpload(e.target.files[0])} />
          </label>
        </div>
        <input className="w-full px-3 py-2 rounded bg-white/10 border border-white/20" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
        <div className="grid md:grid-cols-3 gap-2 items-center">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
            <span>Mettre en avant</span>
          </label>
          <input className="px-3 py-2 rounded bg-white/10 border border-white/20" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="tags, séparés, par virgules" />
          <input type="number" className="px-3 py-2 rounded bg-white/10 border border-white/20" value={position} onChange={(e) => setPosition(parseInt(e.target.value || '0', 10))} />
        </div>
        <div className="grid md:grid-cols-3 gap-2">
          <input className="px-3 py-2 rounded bg-white/10 border border-white/20" value={depositMin} onChange={(e) => setDepositMin(e.target.value)} placeholder="Dépôt mini" />
          <input className="px-3 py-2 rounded bg-white/10 border border-white/20" value={bonus} onChange={(e) => setBonus(e.target.value)} placeholder="Bonus" />
          <input className="px-3 py-2 rounded bg-white/10 border border-white/20" value={cashback} onChange={(e) => setCashback(e.target.value)} placeholder="Cashback" />
          <input className="px-3 py-2 rounded bg-white/10 border border-white/20" value={freeSpins} onChange={(e) => setFreeSpins(e.target.value)} placeholder="Free Spins" />
          <input className="px-3 py-2 rounded bg-white/10 border border-white/20" value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} placeholder="Récupérer mon Bonus" />
          <select className="px-3 py-2 rounded bg-white/10 border border-white/20" value={bannerType} onChange={(e) => setBannerType(e.target.value)}>
            <option value="square">Carré (grille)</option>
            <option value="landscape">Paysage (large)</option>
            <option value="portrait">Portrait (vertical)</option>
          </select>
        </div>
        <div>
          <textarea className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 min-h-[90px]" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description du casino" />
        </div>
        <div className="flex gap-2">
          <button onClick={save} disabled={loading} className="px-3 py-2 rounded bg-white text-black disabled:opacity-50">{loading ? 'Enregistrement...' : 'Enregistrer'}</button>
          <button onClick={remove} disabled={loading} className="px-3 py-2 rounded border border-red-400 text-red-300 disabled:opacity-50">Supprimer</button>
        </div>
      </div>
    </div>
  );
}


