// ===================================================================
// 📁 app/[locale]/admin/translations/page.tsx
// Location: CREATE NEW FILE app/[locale]/admin/translations/page.tsx
// Sistema de tradução automática de mensagens dos hosts (versão simplificada)
// ===================================================================

"use client";

import { useState, use } from "react";
import {
  Globe,
  MessageSquare,
  Languages,
  Sparkles,
  Copy,
  Check,
  AlertCircle,
  ChevronDown,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { useTranslations } from "@/lib/i18n";

interface TranslationsPageProps {
  params: Promise<{ locale: string }>;
}

const LANGUAGES = [
  { code: "pt", name: "Português 🇵🇹", flag: "🇵🇹" },
  { code: "en", name: "English 🇬🇧", flag: "🇬🇧" },
  { code: "es", name: "Español 🇪🇸", flag: "🇪🇸" },
  { code: "fr", name: "Français 🇫🇷", flag: "🇫🇷" },
  { code: "de", name: "Deutsch 🇩🇪", flag: "🇩🇪" },
];

// Simulação de serviço de tradução
const translateText = async (
  text: string,
  fromLang: string,
  toLang: string
): Promise<string> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Exemplos de traduções simuladas
  const translations: Record<string, Record<string, string>> = {
    "Olá! Gostaria de confirmar a sua reserva para o tour.": {
      en: "Hello! I would like to confirm your booking for the tour.",
      es: "¡Hola! Me gustaría confirmar su reserva para el tour.",
      fr: "Bonjour! Je voudrais confirmer votre réservation pour la visite.",
      de: "Hallo! Ich möchte Ihre Buchung für die Tour bestätigen.",
    },
    "O ponto de encontro será na Praça da Ribeira às 10h.": {
      en: "The meeting point will be at Ribeira Square at 10am.",
      es: "El punto de encuentro será en la Plaza de Ribeira a las 10h.",
      fr: "Le point de rencontre sera à la Place Ribeira à 10h.",
      de: "Der Treffpunkt ist am Ribeira-Platz um 10 Uhr.",
    },
  };

  // Se tivermos uma tradução pré-definida, usar
  if (translations[text] && translations[text][toLang]) {
    return translations[text][toLang];
  }

  // Caso contrário, retornar uma tradução genérica simulada
  return `[Translated from ${fromLang} to ${toLang}]: ${text}`;
};

export default function AdminTranslationsPage({
  params,
}: TranslationsPageProps) {
  const { locale } = use(params);
  const t = useTranslations(locale);

  const [originalText, setOriginalText] = useState("");
  const [sourceLang, setSourceLang] = useState("pt");
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const [copiedLang, setCopiedLang] = useState<string | null>(null);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);

  // Exemplos de mensagens comuns
  const commonMessages = [
    {
      category: "Saudações",
      messages: [
        "Olá! Bem-vindo ao nosso tour!",
        "Bom dia! Está pronto para a experiência?",
        "Obrigado por escolher o nosso tour!",
      ],
    },
    {
      category: "Logística",
      messages: [
        "O ponto de encontro será na entrada principal.",
        "Por favor, chegue 15 minutos antes do horário marcado.",
        "Traga água e protetor solar.",
      ],
    },
    {
      category: "Confirmações",
      messages: [
        "A sua reserva está confirmada!",
        "Recebemos o seu pagamento com sucesso.",
        "Vejo você no dia do tour!",
      ],
    },
  ];

  const handleTranslate = async () => {
    if (!originalText.trim()) {
      alert("Por favor introduz texto para traduzir");
      return;
    }

    setIsTranslating(true);
    const newTranslations: Record<string, string> = {};

    try {
      // Traduzir para todas as línguas exceto a origem
      for (const lang of LANGUAGES) {
        if (lang.code !== sourceLang) {
          newTranslations[lang.code] = await translateText(
            originalText,
            sourceLang,
            lang.code
          );
        }
      }

      setTranslations(newTranslations);
      alert("Texto traduzido com sucesso!");
    } catch (error) {
      alert("Erro ao traduzir texto");
    } finally {
      setIsTranslating(false);
    }
  };

  const copyToClipboard = (text: string, lang: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLang(lang);
    setTimeout(() => setCopiedLang(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Globe className="w-8 h-8" />
                <h1 className="text-4xl font-bold">
                  Centro de Tradução de Mensagens
                </h1>
              </div>
              <p className="text-white/80 text-lg">
                Traduz mensagens dos hosts para as 5 línguas suportadas
                instantaneamente
              </p>
            </div>
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
              <Languages className="w-4 h-4 mr-2" />5 Línguas
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Translation Area */}
          <div className="lg:col-span-2">
            <Card className="p-6 shadow-xl bg-white/95 backdrop-blur">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Língua de Origem
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowSourceDropdown(!showSourceDropdown)}
                    className="w-full px-4 py-3 bg-gray-50 rounded-lg flex items-center justify-between hover:bg-gray-100 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-2xl">
                        {LANGUAGES.find((l) => l.code === sourceLang)?.flag}
                      </span>
                      <span className="font-medium">
                        {LANGUAGES.find((l) => l.code === sourceLang)?.name}
                      </span>
                    </span>
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  </button>

                  {showSourceDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border z-10">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setSourceLang(lang.code);
                            setShowSourceDropdown(false);
                          }}
                          className="w-full px-4 py-3 flex items-center gap-2 hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-2xl">{lang.flag}</span>
                          <span>{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem Original
                </label>
                <textarea
                  value={originalText}
                  onChange={(e) => setOriginalText(e.target.value)}
                  placeholder="Introduz a mensagem do host para traduzir..."
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-32"
                />
              </div>

              <Button
                onClick={handleTranslate}
                disabled={isTranslating || !originalText.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
              >
                {isTranslating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />A
                    traduzir...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Traduzir para Todas as Línguas
                  </>
                )}
              </Button>

              {/* Translation Results */}
              {Object.keys(translations).length > 0 && (
                <div className="mt-8 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Traduções
                  </h3>

                  {LANGUAGES.filter((lang) => lang.code !== sourceLang).map(
                    (lang) => (
                      <div
                        key={lang.code}
                        className="p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{lang.flag}</span>
                            <span className="font-medium text-gray-900">
                              {lang.name}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              copyToClipboard(
                                translations[lang.code],
                                lang.code
                              )
                            }
                          >
                            {copiedLang === lang.code ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        <p className="text-gray-700 bg-white p-3 rounded">
                          {translations[lang.code]}
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* Quick Templates */}
          <div className="lg:col-span-1">
            <Card className="p-6 shadow-xl bg-white/95 backdrop-blur">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                Modelos Rápidos
              </h3>

              <div className="space-y-4">
                {commonMessages.map((category, idx) => (
                  <div key={idx}>
                    <h4 className="text-sm font-medium text-gray-600 mb-2">
                      {category.category}
                    </h4>
                    <div className="space-y-2">
                      {category.messages.map((message, msgIdx) => (
                        <button
                          key={msgIdx}
                          onClick={() => {
                            setOriginalText(message);
                            setSourceLang("pt");
                          }}
                          className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors group"
                        >
                          <p className="text-sm text-gray-700 group-hover:text-blue-700">
                            {message}
                          </p>
                          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                            <ArrowRight className="w-3 h-3" />
                            <span>Clica para usar</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Dica Pro
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      Guarda traduções comuns como modelos para comunicação mais
                      rápida com hóspedes internacionais.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
