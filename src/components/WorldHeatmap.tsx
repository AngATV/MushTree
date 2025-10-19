"use client";

import { useMemo } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

// TopoJSON minifié (World-110m) importé depuis un CDN à l’exécution (SSG off)
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type Country = { country: string | null; clicks: number };

export default function WorldHeatmap({ countries }: { countries: Country[] }) {
  const map = useMemo(() => {
    const m = new Map<string, number>();
    for (const c of countries || []) {
      if (!c.country) continue;
      m.set(c.country.toUpperCase(), (m.get(c.country.toUpperCase()) || 0) + c.clicks);
    }
    const max = Math.max(1, ...Array.from(m.values()));
    return { m, max };
  }, [countries]);

  function colorFor(code: string | undefined | null) {
    if (!code || typeof code !== 'string') return 'rgba(16,185,129,0.06)';
    const v = map.m.get(code.toUpperCase()) || 0;
    const t = v / map.max; // 0..1
    const alpha = 0.2 + 0.6 * t; // 0.2..0.8
    return `rgba(16,185,129,${alpha.toFixed(3)})`;
  }

  return (
    <div className="w-full overflow-hidden">
      <ComposableMap projectionConfig={{ scale: 140 }} style={{ width: "100%", height: "auto" }}>
        <Geographies geography={geoUrl}>
          {({ geographies }: { geographies?: any[] }) => Array.isArray(geographies) ? (
            geographies.map((geo: any) => {
              const isoA2 = ((geo.properties as any).iso_a2 as string) || 'XX';
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={colorFor(isoA2)}
                  stroke="#0b1216"
                  style={{ default: { outline: "none" }, hover: { outline: "none" }, pressed: { outline: "none" } }}
                />
              );
            })
          ) : null}
        </Geographies>
      </ComposableMap>
    </div>
  );
}
