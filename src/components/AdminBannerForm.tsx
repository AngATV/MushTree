"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminBannerForm() {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [position, setPosition] = useState(0);
  const [depositMin, setDepositMin] = useState("");
  const [bonus, setBonus] = useState("");
  const [cashback, setCashback] = useState("");
  const [freeSpins, setFreeSpins] = useState("");
  const [ctaLabel, setCtaLabel] = useState("Récupérer mon Bonus");
  const [bannerType, setBannerType] = useState('square');
  const [uploading, setUploading] = useState(false);
  const [imgInfo, setImgInfo] = useState<{w:number;h:number;ratio:number}|null>(null);
  const [ratioOk, setRatioOk] = useState(true);

  function expectedRatio(type: string) {
    if (type === 'landscape') return 21/9; // ≈2.333
    if (type === 'portrait') return 3/5;   // 0.6
    return 1; // square
  }

  function ratioWithin(r:number, target:number) {
    const tol = 0.08; // ±8%
    return Math.abs(r - target) / target <= tol;
  }

  function analyze(url: string, type: string) {
    if (!url) { setImgInfo(null); setRatioOk(true); return; }
    const img = new Image();
    img.onload = () => {
      const r = img.width / img.height;
      setImgInfo({ w: img.width, h: img.height, ratio: parseFloat(r.toFixed(3)) });
      setRatioOk(ratioWithin(r, expectedRatio(type)));
    };
    img.onerror = () => { setImgInfo(null); setRatioOk(true); };
    img.src = url;
  }

  async function startUpload(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd, credentials: 'include' });
      const { url } = await res.json();
      setImageUrl(url);
      analyze(url, bannerType);
    } finally {
      setUploading(false);
    }
  }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, imageUrl, linkUrl, featured, category: category || null, tags: tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : [], position, depositMin: depositMin || null, bonus: bonus || null, cashback: cashback || null, freeSpins: freeSpins || null, ctaLabel, bannerType }),
      });
      if (!res.ok) throw new Error("Erreur API");
      setTitle("");
      setImageUrl("");
      setLinkUrl("");
      setFeatured(false);
      setCategory("");
      setTags("");
      setPosition(0);
      setDepositMin("");
      setBonus("");
      setCashback("");
      setFreeSpins("");
      setCtaLabel("Récupérer mon Bonus");
      setBannerType('square');
      // Rafraîchir la page serveur pour recharger la liste
      router.refresh();
    } catch (err: any) {
      setError(err.message ?? "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="block text-sm mb-1">Titre</label>
        <input className="w-full px-3 py-2 rounded bg-white/10 border border-white/20" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm mb-1">Image URL</label>
        <div className="flex gap-2">
          <input className="w-full px-3 py-2 rounded bg-white/10 border border-white/20" value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); analyze(e.target.value, bannerType); }} required />
          <label className="inline-flex items-center px-3 py-2 rounded bg-white text-black cursor-pointer">
            {uploading ? 'Upload…' : 'Uploader'}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && e.target.files[0] && startUpload(e.target.files[0])} />
          </label>
        </div>
      </div>
      <div>
        <label className="block text-sm mb-1">Lien d'affiliation</label>
        <input className="w-full px-3 py-2 rounded bg-white/10 border border-white/20" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} required />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          <span>Mettre en avant</span>
        </label>
        <div>
          <label className="block text-sm mb-1">Catégorie</label>
          <input className="w-full px-3 py-2 rounded bg-white/10 border border-white/20" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="ex: Bonus" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">Tags (séparés par des virgules)</label>
          <input className="w-full px-3 py-2 rounded bg-white/10 border border-white/20" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="ex: cashback, free spins" />
        </div>
        <div>
          <label className="block text-sm mb-1">Position</label>
          <input type="number" className="w-full px-3 py-2 rounded bg-white/10 border border-white/20" value={position} onChange={(e) => setPosition(parseInt(e.target.value || '0', 10))} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm mb-1">Dépôt mini</label>
          <input className="w-full px-3 py-2 rounded bg-white/10 border border-white/20" value={depositMin} onChange={(e) => setDepositMin(e.target.value)} placeholder="ex: 20€" />
        </div>
        <div>
          <label className="block text-sm mb-1">Bonus</label>
          <input className="w-full px-3 py-2 rounded bg-white/10 border border-white/20" value={bonus} onChange={(e) => setBonus(e.target.value)} placeholder="ex: 100%" />
        </div>
        <div>
          <label className="block text-sm mb-1">Cashback</label>
          <input className="w-full px-3 py-2 rounded bg-white/10 border border-white/20" value={cashback} onChange={(e) => setCashback(e.target.value)} placeholder="ex: 10%" />
        </div>
        <div>
          <label className="block text-sm mb-1">Free Spins</label>
          <input className="w-full px-3 py-2 rounded bg-white/10 border border-white/20" value={freeSpins} onChange={(e) => setFreeSpins(e.target.value)} placeholder="ex: 50" />
        </div>
        <div>
          <label className="block text-sm mb-1">Label du bouton</label>
          <input className="w-full px-3 py-2 rounded bg-white/10 border border-white/20" value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} placeholder="Récupérer mon Bonus" />
        </div>
        <div>
          <label className="block text-sm mb-1">Type de bannière</label>
          <select className="w-full px-3 py-2 rounded bg-white/10 border border-white/20" value={bannerType} onChange={(e) => { setBannerType(e.target.value); analyze(imageUrl, e.target.value); }}>
            <option value="square">Carré (grille)</option>
            <option value="landscape">Paysage (large)</option>
            <option value="portrait">Portrait (vertical)</option>
          </select>
        </div>
      </div>

      {/* Aide ratios */}
      <div className={`text-xs mt-1 ${ratioOk ? 'text-white/60' : 'text-red-400'}`}>
        {imgInfo ? (
          <>Taille détectée: {imgInfo.w}×{imgInfo.h} (ratio {imgInfo.ratio}). {ratioOk ? 'OK' : 'Ratio conseillé non respecté.'}</>
        ) : 'Chargez une image pour analyser le ratio.'}
        <div className="mt-1 text-white/60">
          Recos: carré 1200×1200; paysage 1920×816 (21:9) ou 1600×900 (16:9); portrait 1200×2000 (3:5) ou 1080×1920 (9:16).
        </div>
      </div>
      {error ? <p className="text-red-400 text-sm">{error}</p> : null}
      <button disabled={loading} className="px-4 py-2 rounded bg-white text-black disabled:opacity-50">{loading ? "Ajout..." : "Ajouter"}</button>
    </form>
  );
}


