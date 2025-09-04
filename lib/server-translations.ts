// ===================================================================
// 📁 lib/server-translations.ts
// Location: SUBSTITUIR COMPLETAMENTE o arquivo existente
// ===================================================================

// Server-side translation utilities for Next.js App Router

// Type for translation function
export type TranslationFunction = (key: string, fallback?: string) => string;

// Helper function to safely access nested object properties without TypeScript errors
function getNestedValue(obj: Record<string, any>, path: string): any {
  const keys = path.split(".");
  let current = obj;

  for (const key of keys) {
    if (
      current &&
      typeof current === "object" &&
      Object.prototype.hasOwnProperty.call(current, key)
    ) {
      current = current[key];
    } else {
      return undefined;
    }
  }

  return current;
}

// Server-side translations loader that returns a translation function
export async function getServerTranslations(
  locale: string
): Promise<TranslationFunction> {
  try {
    // Dynamic import for server-side usage
    const translationsModule = await import(`../locales/${locale}.json`);
    const translationData: Record<string, any> = translationsModule.default;

    // Return a function similar to client-side t()
    return function t(key: string, fallback?: string): string {
      const result = getNestedValue(translationData, key);

      if (typeof result === "string") {
        return result;
      }

      if (fallback) {
        return fallback;
      }

      console.warn(`Translation key "${key}" not found for locale "${locale}"`);
      return key;
    };
  } catch (error) {
    console.warn(
      `Translation file for locale "${locale}" not found, falling back to Portuguese`
    );

    try {
      const fallbackModule = await import(`../locales/pt.json`);
      const translationData: Record<string, any> = fallbackModule.default;

      return function t(key: string, fallback?: string): string {
        const result = getNestedValue(translationData, key);

        if (typeof result === "string") {
          return result;
        }

        if (fallback) {
          return fallback;
        }

        console.warn(`Translation key "${key}" not found in fallback locale`);
        return key;
      };
    } catch (fallbackError) {
      console.error("Portuguese translation file not found");
      return function t(key: string, fallback?: string): string {
        return fallback || key;
      };
    }
  }
}

// Alternative: Get raw translations object (for backward compatibility)
export async function getTranslations(
  locale: string
): Promise<Record<string, any>> {
  try {
    const translationsModule = await import(`../locales/${locale}.json`);
    return translationsModule.default;
  } catch (error) {
    console.warn(
      `Translation file for locale "${locale}" not found, falling back to Portuguese`
    );

    try {
      const fallbackModule = await import(`../locales/pt.json`);
      return fallbackModule.default;
    } catch (fallbackError) {
      console.error("Portuguese translation file not found");
      return {};
    }
  }
}
