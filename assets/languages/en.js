window.languages = window.languages || {};

window.languages.en = {
  // Titres généraux
  mainTitle: "This game is unbalanced!",
  subtitle: "The game where YOU balance the game!",
  levelSelectTitle: "Level Selection",
  tutorialTitle: "How to Play",

  // Boot
  loading: "Loading...",

  // Boutons
  playButton: "Play",
  tutorialButton: "Tutorial",
  backButton: "Back",
  closeButton: "Close",
  languageButton: "🌐 Language: EN",
  playLevel: "Play",
  continueButton: "Continue",
  submitButton: "Submit",
  retryButton: "Retry",
  balanceButton: "Balance",
  skipButton: "SKIP ⏭️",

  // Messages de simulation
  simulationInProgress: "SIMULATION IN PROGRESS",
  levelSucceeded: "LEVEL COMPLETED!",
  levelFailed: "FAILED",

  // Statuts des niveaux
  lockedLevel: "Locked",
  balanced: "Balanced",
  previousAttempt: "Previous attempt",
  newLevel: "New",

  // Feedback
  completedLevelsCount: "Completed levels:",
  feedbackTitle: "How was your experience?",
  feedbackQuestion: "How was the gameplay experience?",
  feedbackDifficulty: "Difficulty:",
  feedbackFun: "Fun:",
  feedbackSuggestion: "Suggestions to improve this game:",
  thanksForFeedback: "Thanks for your feedback!",

  // Édition
  editorTitle: "Game balancing",
  editorInstructions: "Adjust parameters to make the game more balanced",
  saveChanges: "Save changes",
  resetToDefault: "Reset to Default",

  // Résultats
  levelBalanced: "Game balanced!",
  unlockedNew: "New game unlocked!",
  nextLevel: "Next game",
  returnToMenu: "Return to Menu",

  // Instructions du tutoriel
  tutorialInstructions: [
    "1. See someone playing a game",
    "2. This player gives you feedback on their gameplay experience",
    "3. Balance the game by adjusting some parameters",
    "4. Unlock new games by balancing previous ones",
    "5. Have fun creating the perfect gameplay experience!",
  ],

  // Simulateurs spécifiques
  // - Plateforme
  platformSpeed: "Player Speed",
  jumpHeight: "Jump Height",
  obstacleCount: "Obstacle Count",
  platformCount: "Platform Count",
  timeLimit: "Time Limit",

  // - Course
  carSpeed: "Your Car Speed",
  trackLength: "Track Length",
  opponentCount: "Opponent Count",
  opponentSpeed: "Opponent Speed",
  boostCount: "Boost Count",

  // - Boss
  playerHealth: "Player Health",
  bossHealth: "Boss Health",
  playerDamage: "Player Damage",
  bossDamage: "Boss Damage",
  healingItems: "Healing Items",

  // - Levels
  timer: (current, max) => `Time: ${(max - current).toString().padStart(2, "0")}`,
  watchInstruction: 'Watch the little monster playing the game!',

  platforms1_title: "My first game",
};
