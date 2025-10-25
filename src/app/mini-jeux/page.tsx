"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { getDict } from "@/lib/i18n";

function CoinFlip({ lang }: { lang: string }) {
  const [choice, setChoice] = useState<"pile"|"face"|null>(null);
  const [result, setResult] = useState<"pile"|"face"|null>(null);
  const [spinning, setSpinning] = useState(false);
  const t = lang === "en" ? { title: "Coin flip", heads: "heads", tails: "tails", play: "Flip" } : { title: "Pile ou face", heads: "face", tails: "pile", play: "Lancer" };
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
      <div className="font-medium">{t.title}</div>
      <div className="flex gap-2 text-sm">
        <button onClick={() => setChoice("pile")} className={`px-3 py-1.5 rounded border ${choice === "pile" ? "bg-white text-black" : "border-white/20"}`}>{t.tails}</button>
        <button onClick={() => setChoice("face")} className={`px-3 py-1.5 rounded border ${choice === "face" ? "bg-white text-black" : "border-white/20"}`}>{t.heads}</button>
        <button onClick={() => { setSpinning(true); setTimeout(() => { const r = Math.random() < 0.5 ? "pile" : "face"; setResult(r); setSpinning(false); }, 600); }} className="ml-auto px-3 py-1.5 rounded bg-white text-black">{t.play}</button>
      </div>
      <div className="h-10 flex items-center text-sm text-white/80">
        {spinning ? (lang === "en" ? "Flipping..." : "Lancement...") : result ? (lang === "en" ? `Result: ${result}` : `Résultat: ${result}`) : (lang === "en" ? "Pick and play" : "Choisissez et jouez")}
      </div>
    </div>
  );
}

function DiceRoll({ lang }: { lang: string }) {
  const [n, setN] = useState<number|null>(null);
  const t = lang === "en" ? { title: "Dice roll", play: "Roll" } : { title: "Lancer de dé", play: "Lancer" };
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
      <div className="font-medium">{t.title}</div>
      <div className="flex items-center gap-3 text-sm">
        <button onClick={() => setN(1 + Math.floor(Math.random()*6))} className="px-3 py-1.5 rounded bg-white text-black">{t.play}</button>
        <div className="text-white/80">{n ? (lang === "en" ? `Result: ${n}` : `Résultat: ${n}`) : (lang === "en" ? "Press roll" : "Appuyez sur Lancer")}</div>
      </div>
    </div>
  );
}

const symbols = ["🍒","🍋","🔔","⭐","7️⃣"]; 
function Slots({ lang }: { lang: string }) {
  const [reels, setReels] = useState([0,0,0]);
  const [spinning, setSpinning] = useState(false);
  const t = lang === "en" ? { title: "Slots", play: "Spin", win: "Win!", lose: "Try again" } : { title: "Machine à sous", play: "Spin", win: "Gagné !", lose: "Réessayez" };
  const status = useMemo(() => {
    if (spinning) return lang === "en" ? "Spinning..." : "Rotation...";
    if (reels[0]===reels[1] && reels[1]===reels[2]) return t.win;
    return t.lose;
  }, [reels, spinning, t, lang]);
  function spin() {
    setSpinning(true);
    const r = [0,0,0].map(() => Math.floor(Math.random()*symbols.length));
    setTimeout(() => { setReels(r); setSpinning(false); }, 700);
  }
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
      <div className="font-medium">{t.title}</div>
      <div className="flex items-center justify-center gap-4 text-3xl">
        <div className="w-12 h-12 rounded bg-black/30 flex items-center justify-center">{symbols[reels[0]]}</div>
        <div className="w-12 h-12 rounded bg-black/30 flex items-center justify-center">{symbols[reels[1]]}</div>
        <div className="w-12 h-12 rounded bg-black/30 flex items-center justify-center">{symbols[reels[2]]}</div>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <button onClick={spin} disabled={spinning} className="px-3 py-1.5 rounded bg-white text-black disabled:opacity-50">{t.play}</button>
        <div className="text-white/80">{status}</div>
      </div>
    </div>
  );
}

export default function MiniJeuxPage() {
  const sp = useSearchParams();
  const lang = sp.get("lang") === "en" ? "en" : "fr";
  const dict = getDict(lang);
  return (
    <section className="space-y-6">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{lang === "en" ? "Mini games" : "Mini-jeux"}</h1>
        <p className="text-white/70">{lang === "en" ? "Have fun with quick games (no real bets)" : "Amusez-vous avec des mini-jeux (sans enjeu réel)"}</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <CoinFlip lang={lang} />
        <DiceRoll lang={lang} />
        <Slots lang={lang} />
      </div>
      <p className="text-xs text-white/50 text-center">{lang === "en" ? "For entertainment only." : "Pour divertissement uniquement."}</p>
    </section>
  );
}


