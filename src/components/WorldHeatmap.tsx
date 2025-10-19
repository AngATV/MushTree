"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

const WorldMap = dynamic(() => import("react-svg-worldmap").then(m => m.WorldMap), { ssr: false });

type Country = { country: string | null; clicks: number };

export default function WorldHeatmap({ countries }: { countries: Country[] }) {
  const data = useMemo(() => (countries || [])
    .filter(c => c.country)
    .map(c => ({ country: (c.country || "").toUpperCase(), value: c.clicks })), [countries]);

  if (!data.length) return <div className="text-sm text-white/70">Pas de données pays pour cette période.</div>;

  return (
    <div className="w-full overflow-hidden">
      <WorldMap
        color="rgba(16,185,129,0.8)"
        title=""
        valueSuffix=" clics"
        size="responsive"
        data={data as any}
        tooltipBgColor="#0b1216"
        backgroundColor="transparent"
      />
    </div>
  );
}
