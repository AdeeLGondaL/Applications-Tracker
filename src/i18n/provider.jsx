import { useCallback, useEffect, useMemo, useState } from "react";
import { daysUntil, parseDate } from "@/utils/date";
import { LanguageContext } from "@/i18n/context";
import { LANGUAGES, RTL_LANGS, STORAGE_KEY, translations } from "@/i18n/translations";

function interpolate(template, params = {}) {
  return String(template).replace(/\{(\w+)\}/g, (_, key) => {
    const value = params[key];
    return value === undefined || value === null ? "" : String(value);
  });
}

function getStoredLanguage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && translations[stored]) return stored;
    const preferred = navigator.language || "";
    const exact = LANGUAGES.find((language) => language.code.toLowerCase() === preferred.toLowerCase());
    if (exact) return exact.code;
    const base = preferred.split("-")[0];
    return LANGUAGES.find((language) => language.code.split("-")[0] === base)?.code || "en";
  } catch {
    return "en";
  }
}

function getByPath(source, path) {
  return path.split(".").reduce((current, part) => current?.[part], source);
}

const ATTRIBUTE_NAMES = ["placeholder", "title", "aria-label", "alt"];
const originalText = new WeakMap();
let translationObserver = null;
let isTranslating = false;

function shouldSkipNode(node) {
  const parent = node.parentElement;
  if (!parent) return true;
  return !!parent.closest("script, style, code, pre, textarea, input, [data-i18n-ignore]");
}

function translateTextValue(value, dictionary) {
  const trimmed = String(value).replace(/\s+/g, " ").trim();
  if (!trimmed) return value;
  if (dictionary[trimmed]) return String(value).replace(trimmed, dictionary[trimmed]);

  const selectedMatch = trimmed.match(/^(\d+) selected$/);
  if (selectedMatch && dictionary["{count} selected"]) return dictionary["{count} selected"].replace("{count}", selectedMatch[1]);

  const showingMatch = trimmed.match(/^Showing (\d+) of (\d+)$/);
  if (showingMatch && dictionary["Showing {showing} of {total}"]) {
    return dictionary["Showing {showing} of {total}"]
      .replace("{showing}", showingMatch[1])
      .replace("{total}", showingMatch[2]);
  }

  return value;
}

function translateElementAttributes(element, dictionary) {
  ATTRIBUTE_NAMES.forEach((name) => {
    if (!element.hasAttribute?.(name)) return;
    const originalName = `data-i18n-original-${name}`;
    if (!element.hasAttribute(originalName)) element.setAttribute(originalName, element.getAttribute(name) || "");
    const original = element.getAttribute(originalName) || "";
    const translated = translateTextValue(original, dictionary);
    if (element.getAttribute(name) !== translated) element.setAttribute(name, translated);
  });
}

function translateNode(node, dictionary) {
  if (node.nodeType === Node.TEXT_NODE) {
    if (shouldSkipNode(node)) return;
    if (!originalText.has(node)) originalText.set(node, node.nodeValue || "");
    node.nodeValue = translateTextValue(originalText.get(node), dictionary);
    return;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return;
  translateElementAttributes(node, dictionary);
  node.childNodes.forEach((child) => translateNode(child, dictionary));
}

function applyDomTranslations(lang) {
  if (typeof document === "undefined" || !document.body) return;
  const dictionary = translations[lang]?.phrases || {};
  isTranslating = true;
  translateNode(document.body, dictionary);
  isTranslating = false;
}

function observeDomTranslations(lang) {
  if (typeof document === "undefined" || !document.body || typeof MutationObserver === "undefined") return undefined;
  translationObserver?.disconnect();
  translationObserver = new MutationObserver((mutations) => {
    if (isTranslating) return;
    const dictionary = translations[lang]?.phrases || {};
    isTranslating = true;
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => translateNode(node, dictionary));
      if (mutation.type === "characterData") translateNode(mutation.target, dictionary);
      if (mutation.type === "attributes") translateElementAttributes(mutation.target, dictionary);
    });
    isTranslating = false;
  });
  translationObserver.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ATTRIBUTE_NAMES,
  });
  return () => translationObserver?.disconnect();
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getStoredLanguage);

  const language = LANGUAGES.find((item) => item.code === lang) || LANGUAGES[0];
  const dir = RTL_LANGS.has(lang) ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Preference persistence is nice-to-have.
    }
    window.setTimeout(() => applyDomTranslations(lang), 0);
    return observeDomTranslations(lang);
  }, [dir, lang]);

  const t = useCallback((key, params = {}) => {
    const phraseKey = key.startsWith("phrases.") ? key.slice("phrases.".length) : null;
    const value = phraseKey
      ? translations[lang]?.phrases?.[phraseKey] ?? translations.en.phrases?.[phraseKey] ?? phraseKey
      : getByPath(translations[lang], key) ?? getByPath(translations.en, key) ?? key;
    return interpolate(value, params);
  }, [lang]);

  const label = useCallback((group, value) => {
    if (!value) return value;
    return translations[lang]?.labels?.[group]?.[value] ?? translations.en.labels?.[group]?.[value] ?? value;
  }, [lang]);

  const formatDate = useCallback((value) => {
    const date = parseDate(value);
    if (!date) return "—";
    try {
      return new Intl.DateTimeFormat(language.locale, { day: "2-digit", month: "short", year: "numeric" }).format(date);
    } catch {
      return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
    }
  }, [language.locale]);

  const deadlineInfo = useCallback((value) => {
    const days = daysUntil(value);
    if (days === null) return { label: t("deadline.none"), tone: "neutral", sort: 999999 };
    if (days < 0) return { label: t("deadline.overdue", { count: Math.abs(days) }), tone: "danger", sort: days };
    if (days <= 14) return { label: t("deadline.left", { count: days }), tone: "warning", sort: days };
    if (days <= 45) return { label: t("deadline.left", { count: days }), tone: "notice", sort: days };
    return { label: t("deadline.left", { count: days }), tone: "success", sort: days };
  }, [t]);

  const value = useMemo(() => ({
    lang,
    dir,
    language,
    languages: LANGUAGES,
    setLanguage: setLang,
    t,
    label,
    formatDate,
    deadlineInfo,
  }), [deadlineInfo, dir, formatDate, label, lang, language, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
