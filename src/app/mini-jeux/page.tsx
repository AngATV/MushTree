"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { getDict } from "@/lib/i18n";

function Card({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_14px_40px_rgba(0,0,0,0.35)] transition">
      <div className="mb-3 font-semibold bg-gradient-to-r from-amber-300 via-rose-300 to-fuchsia-400 bg-clip-text text-transparent">
        {title}
      </div>
      {children}
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-300 via-rose-400 to-fuchsia-500 text-black font-semibold disabled:opacity-50 shadow-[0_6px_24px_rgba(251,191,36,0.25)] hover:scale-[1.03] active:scale-[0.99] transition">
      {children}
    </button>
  );
}

function Pill({ active, children, onClick }: { active?: boolean; children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`px-3 py-1.5 rounded-full text-sm border ${active ? 'bg-white text-black border-white' : 'border-white/20 hover:border-white/40'}`}>{children}</button>
  );
}

function CoinFlip({ lang }: { lang: string }) {
  const [choice, setChoice] = useState<"pile"|"face"|null>(null);
  const [result, setResult] = useState<"pile"|"face"|null>(null);
  const [spinning, setSpinning] = useState(false);
  const t = lang === "en" ? { title: "Coin flip", heads: "heads", tails: "tails", play: "Flip" } : { title: "Pile ou face", heads: "face", tails: "pile", play: "Lancer" };
  return (
    <Card title={t.title}>
      <div className="flex gap-2 text-sm items-center">
        <Pill active={choice === "pile"} onClick={() => setChoice("pile")}>{t.tails}</Pill>
        <Pill active={choice === "face"} onClick={() => setChoice("face")}>{t.heads}</Pill>
        <div className="ml-auto" />
        <PrimaryButton onClick={() => { setSpinning(true); setTimeout(() => { const r = Math.random() < 0.5 ? "pile" : "face"; setResult(r); setSpinning(false); }, 700); }}>{t.play}</PrimaryButton>
      </div>
      <div className="mt-4 h-16 flex items-center justify-center text-base">
        <div className={`w-16 h-16 rounded-full bg-white/90 text-black font-semibold flex items-center justify-center ${spinning ? 'anim-coin-flip' : ''}`}>
          {spinning ? '' : (result ? (result === 'pile' ? (lang==='en' ? 'T' : 'P') : (lang==='en' ? 'H' : 'F')) : '?')}
        </div>
      </div>
    </Card>
  );
}

function DiceRoll({ lang }: { lang: string }) {
  const [n, setN] = useState<number|null>(null);
  const t = lang === "en" ? { title: "Dice roll", play: "Roll" } : { title: "Lancer de dé", play: "Lancer" };
  return (
    <Card title={t.title}>
      <div className="flex items-center gap-4 text-sm">
        <div className={`w-14 h-14 rounded-xl bg-white/90 text-black text-2xl font-bold flex items-center justify-center ${n===null ? '' : 'anim-die-spin'}`}>{n ?? '•'}</div>
        <PrimaryButton onClick={() => setN(1 + Math.floor(Math.random()*6))}>{t.play}</PrimaryButton>
      </div>
    </Card>
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
    <Card title={t.title}>
      <div className="flex items-center justify-center gap-4 text-4xl">
        <div className={`w-14 h-14 rounded-xl bg-black/30 flex items-center justify-center ${spinning ? 'animate-pulse' : ''}`}>{symbols[reels[0]]}</div>
        <div className={`w-14 h-14 rounded-xl bg-black/30 flex items-center justify-center ${spinning ? 'animate-pulse' : ''}`}>{symbols[reels[1]]}</div>
        <div className={`w-14 h-14 rounded-xl bg-black/30 flex items-center justify-center ${spinning ? 'animate-pulse' : ''}`}>{symbols[reels[2]]}</div>
      </div>
      <div className="flex items-center gap-3 text-sm mt-3">
        <PrimaryButton onClick={spin} disabled={spinning}>{t.play}</PrimaryButton>
        <div className="px-3 py-1.5 rounded-lg border border-white/15 bg-white/10 text-white/80">{status}</div>
      </div>
    </Card>
  );
}

export default function MiniJeuxPage() {
  const sp = useSearchParams();
  const lang = sp.get("lang") === "en" ? "en" : "fr";
  const dict = getDict(lang);
  return (
    <section className="space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-300 via-rose-300 to-fuchsia-400 bg-clip-text text-transparent">{lang === "en" ? "Mini games" : "Mini-jeux"}</h1>
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


