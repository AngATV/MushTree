"use client";

import { useTheme } from "@/components/ThemeProvider";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 px-3 py-2 text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/10"
      aria-label="Basculer le thème"
   >
      <span aria-hidden>{isDark ? "🌙" : "☀️"}</span>
      <span>{isDark ? "Mode sombre" : "Mode clair"}</span>
    </button>
  );
}


