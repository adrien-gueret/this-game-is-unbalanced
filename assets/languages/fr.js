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

  // Instructions du tutoriel
  tutorialInstructions: [
    "1. Regardez quelqu'un jouer à un jeu",
    "2. Ce joueur vous donne son avis sur son expérience de jeu",
    "3. Équilibrez le jeu en ajustant divers paramètres",
    "4. Débloquez de nouveaux jeux en équilibrant les précédents",
    "5. Amusez-vous à créer l'expérience de jeu parfaite !",
  ],

  // - Levels
  timer: (current, max) =>
    `Temps : ${(max - current).toString().padStart(2, "0")}`,
  watchInstruction: "Regardez Potimonstre jouer au niveau !",
  timeout: "Temps écoulé...",
  clickToStart: "Cliquez pour commencer",
  clickToContinue: "Cliquez pour continuer",

  gameFeedbackTooEasy:
    "Ce jeu est trop facile ! J'ai gagné sans la moindre difficulté...",
  gameFeedbackTooHard:
    "J'ai gagné, mais wow... Ce n'était pas facile ! Il faudrait sans doute un peu moins d'obstacles.",
  gameFeedbackBalanced:
    "Ce jeu est bien équilibré ! J'ai eu juste ce qu'il faut de défi pour m'amuser !",

  platformsSuccess: "Potimonstre a gagné !",
  platformsBlocked: "Potimonstre est bloqué...",
  platformsFailure: "Potimonstre est tombé !",

  platformsFeedbackBlocked:
    "Ce jeu est impossible ! Je me suis retrouvé bloqué, je ne pouvais pas sauter assez haut...",
  platformsFeedbackTimeout:
    "Ce jeu est mal équilibré ! On n'a juste pas le temps de le finir...",
  platformsFeedbackFailure:
    "Ce jeu est trop difficile ! Comment suis-je censé sauter par dessus ce trou ?",

  platformsFeedbackTooFarLimit:
    "Ce jeu est trop facile ! Le chronomètre est trop généreux, il ne représente aucun défi !",
  platformsFeedbackTooNearLimit:
    "J'ai gagné, mais vraiment de justesse... ! Il faudrait sans doute ajuster un petit peu le chronomètre.",

  platforms1_title: "Mon premier jeu",
  platforms2_title: "Oh, de l'eau !",

  // Feedback
  feedbackTitle: "L'avis de Potimonstre",
  balancedGame: "JEU ÉQUILIBRÉ",
  unbalancedGame: "JEU NON ÉQUILIBRÉ",
};
