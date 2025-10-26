"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { getDict } from "@/lib/i18n";

// Audio/vibration utils
let audioCtx: AudioContext | null = null;
function ensureCtx() { if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)(); return audioCtx!; }
function playTone(freq: number, durationMs: number, type: OscillatorType = 'sine', gain = 0.03) {
  try {
    const ctx = ensureCtx();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.value = gain;
    osc.connect(g).connect(ctx.destination);
    osc.start();
    setTimeout(() => { osc.stop(); osc.disconnect(); g.disconnect(); }, durationMs);
  } catch {}
}
function playSequence(steps: Array<{ f: number; d: number; t: OscillatorType; g?: number }>, gapMs = 30) {
  let delay = 0;
  steps.forEach(s => {
    setTimeout(() => playTone(s.f, s.d, s.t, s.g ?? 0.03), delay);
    delay += s.d + gapMs;
  });
}
function vibrate(ms: number) { try { navigator.vibrate?.(ms); } catch {} }

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
        <PrimaryButton onClick={() => {
          vibrate(25);
          // tick sequence while flipping
          playSequence([{f:300,d:60,t:'square'},{f:380,d:60,t:'square'},{f:450,d:60,t:'square'}], 40);
          setSpinning(true);
          setTimeout(() => {
            const r = Math.random() < 0.5 ? "pile" : "face";
            setResult(r);
            setSpinning(false);
            playTone(r === 'face' ? 820 : 420, 140, 'sine', 0.04);
          }, 700);
        }}>{t.play}</PrimaryButton>
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
        <PrimaryButton onClick={() => { vibrate(20); playSequence([{f:250,d:50,t:'triangle'},{f:300,d:50,t:'triangle'},{f:350,d:50,t:'triangle'}], 20); setN(1 + Math.floor(Math.random()*6)); }}>{t.play}</PrimaryButton>
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
    vibrate(20);
    setSpinning(true);
    const r = [0,0,0].map(() => Math.floor(Math.random()*symbols.length));
    playSequence([{f:280,d:50,t:'square'},{f:320,d:50,t:'square'},{f:360,d:50,t:'square'}], 30);
    setTimeout(() => { setReels(r); setSpinning(false); playTone(r[0]===r[1]&&r[1]===r[2]? 900:350, 140, 'sine', 0.04); }, 700);
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

function Roulette({ lang }: { lang: string }) {
  const labels = [
    lang === 'en' ? 'Bonus' : 'Bonus',
    lang === 'en' ? 'Try again' : 'Réessaie',
    'x2',
    lang === 'en' ? 'Jackpot' : 'Jackpot',
    'x3',
    lang === 'en' ? 'Miss' : 'Raté',
    'x5',
    lang === 'en' ? 'Lucky' : 'Chance',
  ];
  const colors = ['#fbbf24','#ef4444','#22d3ee','#a78bfa','#34d399','#f472b6','#f59e0b','#60a5fa'];
  const [deg, setDeg] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string|null>(null);

  function spin() {
    if (spinning) return;
    vibrate(25);
    setSpinning(true);
    setResult(null);
    const seg = Math.floor(Math.random()*labels.length);
    const segAngle = 360 / labels.length;
    const target = 360*5 + (seg*segAngle) + segAngle/2; // pointer at top
    setDeg(prev => prev + target);
    playSequence([{f:280,d:70,t:'sawtooth'},{f:330,d:70,t:'sawtooth'},{f:380,d:70,t:'sawtooth'},{f:430,d:70,t:'sawtooth'}], 50);
    setTimeout(() => { setSpinning(false); setResult(labels[seg]); playTone(880, 180, 'sine', 0.05); }, 2200);
  }

  return (
    <Card title={lang==='en' ? 'Roulette' : 'Roulette'}>
      <div className="flex items-center gap-5">
        <div className="relative">
          {/* Needle */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white/90 z-10" />
          {/* Wheel */}
          <div className="w-40 h-40 rounded-full border-2 border-white/20 overflow-hidden"
               style={{ background: `conic-gradient(${colors.map((c,i)=>`${c} ${(i)*12.5}% ${(i+1)*12.5}%`).join(',')})`, transform:`rotate(${deg}deg)`, transition:'transform 2s cubic-bezier(.17,.67,.32,1.24)'}} />
        </div>
        <div className="space-y-3 text-sm flex-1">
          <PrimaryButton onClick={spin} disabled={spinning}>{lang==='en' ? 'Spin' : 'Lancer'}</PrimaryButton>
          <div className="px-3 py-1.5 rounded-lg border border-white/15 bg-white/10 text-white/80">
            {spinning ? (lang==='en' ? 'Spinning...' : 'Rotation...') : result ? (lang==='en' ? `Result: ${result}` : `Résultat : ${result}`) : (lang==='en' ? 'Press spin' : 'Appuyez sur Lancer')}
          </div>
          <div className="grid grid-cols-2 gap-2 opacity-80">
            {labels.map((l,i)=> (
              <div key={i} className="flex items-center gap-2 text-xs"><span className="inline-block w-3 h-3 rounded-sm" style={{background:colors[i]}} /> {l}</div>
            ))}
          </div>
        </div>
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
        <Roulette lang={lang} />
      </div>
      <p className="text-xs text-white/50 text-center">{lang === "en" ? "For entertainment only." : "Pour divertissement uniquement."}</p>
    </section>
  );
}


