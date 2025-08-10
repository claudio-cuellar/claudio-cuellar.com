/**
 * i18n.js - Internationalization utility for the portfolio website
 * 
 * This module provides functionality to load and apply translations
 * to the website based on the selected language.
 */

// Preload all JSON translations in this folder
// eager: false → returns async loader functions
const translationLoaders = import.meta.glob('./*.json');

export class I18nManager {
  constructor() {
    this.translations = {};
    this.currentLanguage = 'en';
    this.defaultLanguage = 'en';
    this.supportedLanguages = ['en', 'es'];
    this.initialized = false;
  }

  /**
   * Initialize the i18n system
   * @returns {Promise} A promise that resolves when initialization is complete
   */
  async init() {
    // Load translations for all supported languages
    const loadPromises = this.supportedLanguages.map(lang => this.loadTranslation(lang));
    await Promise.all(loadPromises);

    // Set initial language based on browser preference or localStorage
    this.currentLanguage = this.getSavedLanguage() || this.getBrowserLanguage() || this.defaultLanguage;

    // Apply translations
    this.applyTranslations();

    // Add language selector to the page
    this.addLanguageSelector();

    this.initialized = true;
    return this;
  }

  async loadTranslation(lang) {
    const key = `./${lang}.json`;
    if (translationLoaders[key]) {
      const module = await translationLoaders[key]();
      this.translations[lang] = module.default; // JSON default export
    } else {
      console.error(`Translation file for ${lang} not found`);
    }
  }

  /**
   * Get the saved language from localStorage
   * @returns {string|null} The saved language code or null
   */
  getSavedLanguage() {
    return localStorage.getItem('language');
  }

  /**
   * Save the current language to localStorage
   */
  saveLanguage() {
    localStorage.setItem('language', this.currentLanguage);
  }

  /**
   * Get the preferred language from the browser
   * @returns {string|null} The browser language code or null
   */
  getBrowserLanguage() {
    const browserLang = navigator.language.split('-')[0];
    return this.supportedLanguages.includes(browserLang) ? browserLang : null;
  }

  /**
   * Change the current language
   * @param {string} lang - Language code
   */
  changeLanguage(lang) {
    if (!this.supportedLanguages.includes(lang)) {
      console.error(`Language ${lang} is not supported`);
      return;
    }

    this.currentLanguage = lang;
    this.saveLanguage();
    this.applyTranslations();

    // Update flag buttons active state
    const flagButtons = document.querySelectorAll('.flag-button');
    if (flagButtons.length > 0) {
      flagButtons.forEach(btn => {
        const buttonLang = btn.getAttribute('data-lang');
        if (buttonLang === lang) {
          btn.classList.remove('border', 'border-transparent');
          btn.classList.add('border-2', 'border-yellow-400');
        } else {
          btn.classList.remove('border-2', 'border-yellow-400');
          btn.classList.add('border', 'border-transparent');
        }
      });
    }
  }

  /**
   * Get a translation by key
   * @param {string} key - Dot notation key (e.g., 'nav.home')
   * @returns {string} The translated text
   */
  t(key) {
    const keys = key.split('.');
    let result = this.translations[this.currentLanguage];

    // Fallback to default language if translation doesn't exist
    if (!result) {
      result = this.translations[this.defaultLanguage];
    }

    // Navigate through the nested keys
    for (const k of keys) {
      if (result && result[k] !== undefined) {
        result = result[k];
      } else {
        // If key not found in current language, try default language
        let fallback = this.translations[this.defaultLanguage];
        for (const fk of keys) {
          if (fallback && fallback[fk] !== undefined) {
            fallback = fallback[fk];
          } else {
            return key; // Return the key itself if no translation found
          }
        }
        return fallback;
      }
    }

    return result;
  }

  /**
   * Apply translations to all elements with data-i18n attribute
   */
  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);

      // Handle different element types
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        if (element.getAttribute('placeholder')) {
          element.setAttribute('placeholder', translation);
        } else {
          element.value = translation;
        }
      } else {
        element.textContent = translation;
      }
    });
  }

  /**
   * Add language selector to the page
   */
  addLanguageSelector() {
    // Create container
    const container = document.createElement('div');
    container.className = 'language-selector-container fixed top-4 right-16 z-50 flex gap-2';

    // Flag mapping
    const flagEmojis = {
      'en': '🇺🇸',
      'es': '🇪🇸'
    };

    // Create flag buttons
    this.supportedLanguages.forEach(lang => {
      const button = document.createElement('button');
      button.className = 'flag-button w-10 h-10 rounded-full flex items-center justify-center text-xl border';
      button.setAttribute('data-lang', lang);
      button.setAttribute('title', this.t(`languageSelector.${lang}`));
      button.setAttribute('aria-label', this.t(`languageSelector.${lang}`));

      // Set active state for current language
      if (lang === this.currentLanguage) {
        button.classList.add('border-2', 'border-yellow-400');
      } else {
        button.classList.add('border-transparent');
      }

      // Add flag emoji
      button.textContent = flagEmojis[lang] || lang.toUpperCase();

      // Add event listener
      button.addEventListener('click', () => {
        this.changeLanguage(lang);
      });

      container.appendChild(button);
    });

    // Add to page
    document.body.appendChild(container);
  }
}

// Create and export a singleton instance
const i18n = new I18nManager();

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  i18n.init();
});

// Export for global use
window.i18n = i18n;

// Export the singleton instance as default
export default i18n;