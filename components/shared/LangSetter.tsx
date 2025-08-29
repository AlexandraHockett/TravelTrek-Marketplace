// File: components/shared/LangSetter.tsx
// Location: CRIAR este arquivo em components/shared/LangSetter.tsx

"use client";

import { useEffect } from "react";
import { languages, type Locale } from "@/lib/i18n";

interface LangSetterProps {
  locale: Locale;
}

export default function LangSetter({ locale }: LangSetterProps) {
  useEffect(() => {
    // Define o atributo lang do documento HTML
    const htmlLang = languages[locale]?.htmlLang || "pt-PT";
    document.documentElement.lang = htmlLang;
  }, [locale]);

  return null; // Este componente não renderiza nada
}
