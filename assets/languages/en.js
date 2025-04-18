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

  // Instructions du tutoriel
  tutorialInstructions: [
    "1. See someone playing a game",
    "2. This player gives you feedback on their gameplay experience",
    "3. Balance the game by adjusting some parameters",
    "4. Unlock new games by balancing previous ones",
    "5. Have fun creating the perfect gameplay experience!",
  ],

  // - Levels
  timer: (current, max) =>
    `Time: ${(max - current).toString().padStart(2, "0")}`,
  watchInstruction: "Watch Lilmonster play the game!",
  timeout: "Time out!",
  clickToStart: "Click to start",
  clickToContinue: "Click to continue",

  gameFeedbackTooEasy: "This game is too easy! I won without any difficulty...",
  gameFeedbackTooHard:
    "I won, but wow... That wasn't easy! Maybe there should be fewer obstacles.",
  gameFeedbackBalanced:
    "This game is well-balanced! I had just the right amount of challenge to have fun!",

  platformsSuccess: "Lilmonster has won!",
  platformsBlocked: "Lilmonster is blocked...",
  platformsFailure: "Lilmonster has fallen!",

  platformsFeedbackBlocked:
    "This game is impossible! I got stuck, I couldn't jump high enough...",
  platformsFeedbackTimeout:
    "This game is unbalanced! There's just not enough time to finish it...",
  platformsFeedbackFailure:
    "This game is too difficult! How am I supposed to jump over that gap?",

  platformsFeedbackTooFarLimit:
    "This game is too easy! The timer is too generous, it doesn't pose any challenge!",
  platformsFeedbackTooNearLimit:
    "I won, but just barely...! The timer probably needs a slight adjustment.",

  platforms1_title: "My first game",
  platforms2_title: "Oh. Water!",

  // Feedback
  balancedGame: "THIS GAME IS WELL-BALANCED",
  unbalancedGame: "THIS GAME IS UNBALANCED",
};
