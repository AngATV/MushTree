"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const PLATFORMS = ["youtube", "x", "instagram", "telegram"] as const;

type Link = { platform: string; url: string };

export default function AdminSocialPage() {
  const router = useRouter();
  const [links, setLinks] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/settings/social", { cache: "no-store" });
        const data = await res.json();
        const map: Record<string, string> = {};
        (data.links as Link[]).forEach(l => { map[l.platform] = l.url; });
        setLinks(map);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function save(platform: string) {
    setSaving(true);
    try {
      const url = links[platform] || "";
      const res = await fetch("/api/settings/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, url })
      });
      if (!res.ok) throw new Error("save failed");
    } finally {
      setSaving(false);
      router.refresh();
    }
  }

  if (loading) return <div className="container py-6">Chargement…</div>;

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-xl font-semibold">Réseaux</h1>
      <div className="grid max-w-2xl gap-4">
        {PLATFORMS.map(p => (
          <div key={p} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-medium mb-2 capitalize">{p}</div>
            <div className="flex gap-2">
              <input
                className="flex-1 px-3 py-2 rounded bg-white/10 border border-white/20"
                placeholder={`https://... (${p})`}
                value={links[p] || ""}
                onChange={(e) => setLinks(prev => ({ ...prev, [p]: e.target.value }))}
              />
              <button onClick={() => save(p)} className="px-4 py-2 rounded bg-white text-black font-semibold" disabled={saving}>
                {saving ? "…" : "Enregistrer"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
