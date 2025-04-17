window.languages = window.languages || {};

window.languages.fr = {
  // Titres généraux
  mainTitle: "This game is unbalanced!",
  subtitle: "Le jeu où TU équilibres le jeu!",
  levelSelectTitle: "Sélection des niveaux",
  tutorialTitle: "Comment jouer",

  // Boot
  loading: "Chargement...",

  // Boutons
  playButton: "Jouer",
  tutorialButton: "Tutoriel",
  backButton: "Retour",
  closeButton: "Fermer",
  languageButton: "🌐 Langue: FR",
  playLevel: "Jouer",
  continueButton: "Continuer",
  submitButton: "Soumettre",
  retryButton: "Réessayer",
  balanceButton: "Équilibrer",
  skipButton: "PASSER ⏭️",

  // Messages de simulation
  simulationInProgress: "SIMULATION EN COURS",
  levelSucceeded: "NIVEAU TERMINÉ !",
  levelFailed: "ÉCHEC",

  // Statuts des niveaux
  lockedLevel: "Verrouillé",
  balanced: "Équilibré",
  previousAttempt: "Tentative précédente",
  newLevel: "Nouveau",

  // Feedback
  completedLevelsCount: "Niveaux complétés:",
  feedbackTitle: "Quel est votre ressenti?",
  feedbackQuestion: "Comment était l'expérience de jeu?",
  feedbackDifficulty: "Difficulté:",
  feedbackFun: "Amusant:",
  feedbackSuggestion: "Suggestions pour améliorer ce jeu:",
  thanksForFeedback: "Merci pour votre avis!",

  // Édition
  editorTitle: "Équilibrage du jeu",
  editorInstructions:
    "Ajustez les paramètres pour rendre le jeu plus équilibré",
  saveChanges: "Sauvegarder les changements",
  resetToDefault: "Réinitialiser",

  // Résultats
  levelBalanced: "Game équilibré!",
  unlockedNew: "Nouveau jeu débloqué!",
  nextLevel: "Jeu suivant",
  returnToMenu: "Retour au menu",

  // Instructions du tutoriel
  tutorialInstructions: [
    "1. Regardez quelqu'un jouer à un jeu",
    "2. Ce joueur vous donne son avis sur son expérience de jeu",
    "3. Équilibrez le jeu en ajustant divers paramètres",
    "4. Débloquez de nouveaux jeux en équilibrant les précédents",
    "5. Amusez-vous à créer l'expérience de jeu parfaite !",
  ],

  // Simulateurs spécifiques
  // - Plateforme
  platformSpeed: "Vitesse du joueur",
  jumpHeight: "Hauteur de saut",
  obstacleCount: "Nombre d'obstacles",
  platformCount: "Nombre de plateformes",
  timeLimit: "Limite de temps",

  // - Course
  carSpeed: "Vitesse de votre voiture",
  trackLength: "Longueur de la piste",
  opponentCount: "Nombre d'adversaires",
  opponentSpeed: "Vitesse des adversaires",
  boostCount: "Nombre de boosts",

  // - Boss
  playerHealth: "Points de vie du joueur",
  bossHealth: "Points de vie du boss",
  playerDamage: "Dégâts du joueur",
  bossDamage: "Dégâts du boss",
  healingItems: "Objets de soin",

  // - Levels
  timer: (current, max) => `Temps : ${(max-current).toString().padStart(2, "0")}`,

  platforms1_title: "Mon premier jeu",
};
