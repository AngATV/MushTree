"use client";

import { useState } from "react";

export function AdminBannerForm({ onCreated }: { onCreated?: () => void }) {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, imageUrl, linkUrl }),
      });
      if (!res.ok) throw new Error("Erreur API");
      setTitle("");
      setImageUrl("");
      setLinkUrl("");
      onCreated?.();
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
      {error ? <p className="text-red-400 text-sm">{error}</p> : null}
      <button disabled={loading} className="px-4 py-2 rounded bg-white text-black disabled:opacity-50">{loading ? "Ajout..." : "Ajouter"}</button>
    </form>
  );
}


