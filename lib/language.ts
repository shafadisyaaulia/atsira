let _lang: "ID" | "EN" = typeof window !== "undefined" ? (localStorage.getItem("atsira-lang") as "ID" | "EN" || "ID") : "ID";
const _listeners: Array<() => void> = [];

export function getLang() { return _lang; }

export function toggleLang() {
  _lang = _lang === "ID" ? "EN" : "ID";
  
  if (typeof window !== "undefined") {
    localStorage.setItem("atsira-lang", _lang);
    console.log("Lang set to:", localStorage.getItem("atsira-lang"));
    
    // Google Translate integration
    const googleCombo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (googleCombo) {
      googleCombo.value = _lang === "EN" ? "en" : "id";
      googleCombo.dispatchEvent(new Event('change'));
    }

    const event = new CustomEvent("atsira-language-changed", { detail: _lang });
    window.dispatchEvent(event);
  }
  
  _listeners.forEach((fn) => fn());
}

export function subscribeLang(fn: () => void) {
  _listeners.push(fn);
  return () => {
    const i = _listeners.indexOf(fn);
    if (i > -1) _listeners.splice(i, 1);
  };
}
