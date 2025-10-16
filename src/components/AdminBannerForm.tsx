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
        body: JSON.stringify({ title, imageUrl, linkUrl, featured, category: category || null, tags: tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : [], position }),
      });
      if (!res.ok) throw new Error("Erreur API");
      setTitle("");
      setImageUrl("");
      setLinkUrl("");
      setFeatured(false);
      setCategory("");
      setTags("");
      setPosition(0);
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
        <input className="w-full px-3 py-2 rounded bg-white/10 border border-white/20" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required />
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
      {error ? <p className="text-red-400 text-sm">{error}</p> : null}
      <button disabled={loading} className="px-4 py-2 rounded bg-white text-black disabled:opacity-50">{loading ? "Ajout..." : "Ajouter"}</button>
    </form>
  );
}


