/**
 * Classe de gestion des traductions
 *
 * Cette classe permet de gérer les traductions pour différentes langues
 * et offre des méthodes pour changer de langue ou obtenir une traduction
 */

class I18n {
  constructor() {
    // Langue par défaut
    this.currentLanguage = "en";
    // Langues disponibles
    this.availableLanguages = ["fr", "en"];

    this.loadPreferredLanguage();
  }

  /**
   * Obtenir une traduction
   * @param {string} key - Clé de traduction
   * @returns {string|Object} - Traduction correspondante ou clé si non trouvée
   */
  get(key) {
    const translation = window.languages[this.currentLanguage]?.[key];
    if (translation !== undefined) {
      return translation;
    }

    console.warn(
      `Traduction non trouvée pour la clé "${key}" dans la langue "${this.currentLanguage}"`
    );
    return key;
  }

  /**
   * Alterne entre les langues disponibles
   * @returns {string} - Nouvelle langue active
   */
  toggleLanguage() {
    const currentIndex = this.availableLanguages.indexOf(this.currentLanguage);
    const nextIndex = (currentIndex + 1) % this.availableLanguages.length;
    this.currentLanguage = this.availableLanguages[nextIndex];
    // Enregistrer la préférence dans localStorage pour la persistance
    localStorage.setItem("preferredLanguage", this.currentLanguage);
    return this.currentLanguage;
  }

  /**
   * Charge la langue préférée du joueur depuis le stockage local
   */
  loadPreferredLanguage() {
    const savedLanguage = localStorage.getItem("preferredLanguage");
    if (savedLanguage && this.availableLanguages.includes(savedLanguage)) {
      this.currentLanguage = savedLanguage;
    }
  }
}

window.i18n = new I18n();
