/**
 * i18n.js - Internationalization utility for the portfolio website
 * 
 * This module provides functionality to load and apply translations
 * to the website based on the selected language.
 */

class I18nManager {
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

  /**
   * Load translation file for a specific language
   * @param {string} lang - Language code
   * @returns {Promise} A promise that resolves when the translation is loaded
   */
  async loadTranslation(lang) {
    try {
      const response = await fetch(`/src/i18n/${lang}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${lang} translations`);
      }
      this.translations[lang] = await response.json();
    } catch (error) {
      console.error(`Error loading ${lang} translations:`, error);
      // Fallback to empty object if translation file can't be loaded
      this.translations[lang] = {};
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
    
    // Update language selector
    const selector = document.getElementById('language-selector');
    if (selector) {
      selector.value = lang;
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
    // Create language selector container
    const container = document.createElement('div');
    container.className = 'language-selector-container fixed top-4 right-4 z-50';
    
    // Create select element
    const select = document.createElement('select');
    select.id = 'language-selector';
    select.className = 'bg-gray-800 text-white border border-gray-700 rounded px-2 py-1';
    select.value = this.currentLanguage;
    
    // Add event listener
    select.addEventListener('change', (e) => {
      this.changeLanguage(e.target.value);
    });
    
    // Add options for each supported language
    this.supportedLanguages.forEach(lang => {
      const option = document.createElement('option');
      option.value = lang;
      option.textContent = this.t(`languageSelector.${lang}`);
      select.appendChild(option);
    });
    
    // Add label
    const label = document.createElement('label');
    label.htmlFor = 'language-selector';
    label.className = 'text-white mr-2';
    label.textContent = this.t('languageSelector.language') + ':';
    
    // Assemble and add to page
    container.appendChild(label);
    container.appendChild(select);
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