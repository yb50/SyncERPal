import { createContext, useContext, useMemo, useState } from "react";
import { translations } from "./translations";

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem("syncerpal_lang") || "en");

  function changeLang(next) {
    setLang(next);
    localStorage.setItem("syncerpal_lang", next);
  }

  function t(key) {
    const dict = translations[lang] || translations.en;
    return dict[key] || translations.en[key] || key;
  }

  function formatNumber(value) {
    try {
      return new Intl.NumberFormat(lang === "ja" ? "ja-JP" : "en-US").format(value);
    } catch {
      return String(value);
    }
  }

  function formatDate(isoString) {
    if (!isoString) return "-";
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat(lang === "ja" ? "ja-JP" : "en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(d);
    } catch {
      return isoString;
    }
  }

  const value = useMemo(
    () => ({ lang, setLang: changeLang, t, formatNumber, formatDate }),
    [lang]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
