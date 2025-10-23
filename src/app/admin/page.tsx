"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) router.push("/admin/dashboard");
    else setError("Identifiants invalides");
    setLoading(false);
  }

  return (
    <div className="container py-10 max-w-md">
      <h1 className="text-2xl font-semibold mb-4">Connexion admin</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full px-3 py-2 rounded bg-white/10 border border-white/20" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full px-3 py-2 rounded bg-white/10 border border-white/20" placeholder="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error ? <p className="text-red-400 text-sm">{error}</p> : null}
        <button disabled={loading} className="px-4 py-2 rounded bg-white text-black disabled:opacity-50">{loading ? "Connexion..." : "Se connecter"}</button>
      </form>
      <div className="mt-6">
        <a href="/api/auth/discord/start" className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#5865F2] text-white font-semibold">
          <span>Se connecter avec Discord</span>
        </a>
      </div>
    </div>
  );
}


