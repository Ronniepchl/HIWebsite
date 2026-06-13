// lang.jsx — bilingual TH/EN context + helpers
const LangCtx = React.createContext({ lang: "th", setLang: () => {} });

function useLang() { return React.useContext(LangCtx); }

// t(th, en) → returns the right string for current language
function useT() {
  const { lang } = useLang();
  return React.useCallback((th, en) => (lang === "en" && en != null ? en : th), [lang]);
}

// pick(item, field) → returns item[field+"En"] in EN mode if present, else item[field]
function usePick() {
  const { lang } = useLang();
  return React.useCallback((item, field) => {
    if (!item) return "";
    if (lang === "en") {
      const en = item[field + "En"];
      if (en != null) return en;
    }
    return item[field];
  }, [lang]);
}

Object.assign(window, { LangCtx, useLang, useT, usePick });
