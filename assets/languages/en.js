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

  // Instructions du tutoriel
  tutorialInstructions: [
    "1. See Lilmonster playing a game",
    "2. It then gives you feedback on its gameplay experience",
    "3. Balance the game by adjusting some parameters",
    "4. Unlock new games by balancing previous ones",
    "5. Have fun creating the perfect gameplay experience!",
  ],

  editGameLabel: "Edit game",
  selectGameLabel: "Play another game",

  // - Levels
  timer: (current, max) =>
    `Time: ${(max - current).toString().padStart(2, "0")}`,
  watchInstruction: "Watch Lilmonster play the game!",
  timeout: "Time out!",
  clickToStart: "Click to start",
  clickToContinue: "Click to continue",

  gameFeedbackTooEasy: "This game is too easy! I won without any difficulty...",
  gameFeedbackTooHard:
    "I won, but wow... That wasn't easy! You should probably adjust the obstacles a bit.",
  gameFeedbackBalanced:
    "This game is well-balanced! I had just the right amount of challenge to have fun!",

  platformsSuccess: "Lilmonster has won!",
  platformsBlocked: "Lilmonster is blocked...",
  platformsFailure: "Lilmonster has fallen!",

  platformsFeedbackBlocked:
    "This game is impossible! I got stuck, I couldn't jump correctly...",
  platformsFeedbackTimeout:
    "This game is unbalanced! There's just not enough time to finish it...",
  platformsFeedbackFailure:
    "This game is too difficult! How am I supposed not falling in the water?",

  platformsFeedbackTooFarLimit:
    "This game is too easy! The timer is too generous, it doesn't pose any challenge!",
  platformsFeedbackTooNearLimit:
    "I won, but just barely...! The timer probably needs a slight adjustment.",

  platforms1_title: "My first game",
  platforms2_title: "Oh. Water!",
  platforms3_title: "Let's drop it...",

  // Feedback
  feedbackTitle: "Lilmonster's Feedback",
  balancedGame: "WELL-BALANCED GAME",
  unbalancedGame: "UNBALANCED GAME",

  // Editor
  editorTitle: (levelTitle) => `Game editor - ${levelTitle}`,
  editorInstructions: "Update game parameters to balance it!",

  editorPlayButton: "Test with these parameters",
  editorResetButton: "Reset parameters",

  platformsPlayerSpeedSettings: "Player speed",
  platformsPlayerGravitySettings: "Gravity strength",
  platformsJumpHeightSettings: "Jump height",
  platformsTimeLimitSettings: "Timer (in seconds)",

  platforms1WallHeightSettings: "Wall height",
  platforms2WaterLengthSettings: "Water stretch length",
  platforms3PlatformLengthSettings: "Platform width",
};
