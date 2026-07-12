"use client";
import { useState, createContext, useContext } from "react";

type Lang = "id" | "en";
const LangCtx = createContext<{ lang: Lang; toggle: () => void }>({ lang: "id", toggle: () => {} });
export const useLang = () => useContext(LangCtx);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("id");
  return (
    <LangCtx.Provider value={{ lang, toggle: () => setLang(l => l === "id" ? "en" : "id") }}>
      {children}
    </LangCtx.Provider>
  );
}

export function LanguageToggle() {
  const { lang, toggle } = useLang();
  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-outline-variant text-xs font-semibold text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
    >
      <span className={lang === "id" ? "text-primary font-bold" : ""}>ID</span>
      <span className="text-outline">|</span>
      <span className={lang === "en" ? "text-primary font-bold" : ""}>EN</span>
    </button>
  );
}