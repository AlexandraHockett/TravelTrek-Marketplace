// Translation structure types for better TypeScript support

export interface NavigationTranslations {
  home: string;
  tours: string;
  about: string;
  contact: string;
  login: string;
  signup: string;
  profile: string;
  logout: string;
  customerPortal: string;
  hostPortal: string;
  dashboard: string;
}

export interface AuthTranslations {
  login: string;
  loginSubtitle: string;
  loginButton: string;
  loginFailed: string;
  loginError: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  or: string;
  googleLogin: string;
  noAccount: string;
  signup: string;
}

export interface CustomerDashboardTranslations {
  title: string;
  subtitle: string;
}

export interface HostDashboardTranslations {
  title: string;
  subtitle: string;
}

export interface StatusPageTranslations {
  title: string;
  subtitle: string;
  categories: {
    coreInfrastructure: string;
    customerPortal: string;
  };
  features: {
    i18nSystem: string;
    nextjsReact: string;
    responsiveNavigation: string;
    typescriptIntegration: string;
    projectStructure: string;
    tourBrowsing: string;
  };
  descriptions: {
    i18nSystemDesc: string;
    nextjsReactDesc: string;
    responsiveNavigationDesc: string;
    typescriptIntegrationDesc: string;
    projectStructureDesc: string;
    tourBrowsingDesc: string;
  };
}

export interface PagesTranslations {
  customer: {
    dashboard: CustomerDashboardTranslations;
  };
  host: {
    dashboard: HostDashboardTranslations;
  };
  status: StatusPageTranslations;
}

export interface FooterTranslations {
  description: string;
  quickLinks: string;
  support: string;
  legal: string;
  newsletter: string;
  newsletterDescription: string;
  subscribe: string;
  allRightsReserved: string;
}

// Main translation interface
export interface Translations {
  navigation: NavigationTranslations;
  auth: AuthTranslations;
  pages: PagesTranslations;
  footer: FooterTranslations;
}

// Generic nested object type for dynamic key access
export type TranslationObject = {
  [key: string]: string | TranslationObject;
};

// Translation function type
export type TranslationFunction = (key: string, fallback?: string) => string;
