"use client";

import { useEffect, useMemo, useState } from "react";
import WorldHeatmap from "@/components/WorldHeatmap";

type Agg = { bucket: string; banner_id?: string | null; clicks: number };

type Country = { country: string | null; clicks: number };

type Banner = { id: string; title: string };

export default function TrackingsPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [bannerId, setBannerId] = useState<string>("");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [grain, setGrain] = useState<"day" | "week" | "month">("day");
  const [agg, setAgg] = useState<Agg[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/banners", { cache: "no-store" });
      const data = await res.json();
      setBanners(data.banners);
    })();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (bannerId) params.set("bannerId", bannerId);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    params.set("grain", grain);
    (async () => {
      const [a, c] = await Promise.all([
        fetch(`/api/stats/aggregate?${params.toString()}`).then(r => r.json()),
        fetch(`/api/stats/countries?${params.toString()}`).then(r => r.json()),
      ]);
      setAgg(a.rows || []);
      setCountries(c.rows || []);
    })();
  }, [bannerId, from, to, grain]);

  const series = useMemo(() => agg.map(r => ({ x: new Date(r.bucket).toLocaleDateString("fr-FR"), y: r.clicks })), [agg]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Trackings</h1>

      <div className="grid md:grid-cols-4 gap-3">
        <div>
          <label className="block text-sm mb-1">Bannière</label>
          <select className="w-full px-3 py-2 rounded bg-white/10 border border-white/20" value={bannerId} onChange={(e) => setBannerId(e.target.value)}>
            <option value="">Toutes</option>
            {banners.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Du</label>
          <input type="date" className="w-full px-3 py-2 rounded bg-white/10 border border-white/20" value={from} onChange={(e) => setFrom(e.target.value ? new Date(e.target.value).toISOString() : "")} />
        </div>
        <div>
          <label className="block text-sm mb-1">Au</label>
          <input type="date" className="w-full px-3 py-2 rounded bg-white/10 border border-white/20" value={to} onChange={(e) => setTo(e.target.value ? new Date(e.target.value).toISOString() : "")} />
        </div>
        <div>
          <label className="block text-sm mb-1">Granularité</label>
          <select className="w-full px-3 py-2 rounded bg-white/10 border border-white/20" value={grain} onChange={(e) => setGrain(e.target.value as any)}>
            <option value="day">Jour</option>
            <option value="week">Semaine</option>
            <option value="month">Mois</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="font-medium mb-3">Clics dans le temps</div>
        <div className="text-xs text-white/70">{series.length ? "" : "Pas de données pour cette période"}</div>
        <div className="grid grid-cols-12 gap-1 mt-2">
          {series.map((p, i) => (
            <div key={i} className="col-span-1">
              <div className="h-24 bg-emerald-400/30" style={{ height: `${Math.min(100, 4 + p.y)}px` }} />
              <div className="text-[10px] text-white/60 truncate mt-1">{p.x}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="font-medium mb-3">Répartition géographique</div>
        <WorldHeatmap countries={countries} />
      </div>
    </div>
  );
}
