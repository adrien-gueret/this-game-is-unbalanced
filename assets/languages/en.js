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

  gameFeedbackBalanced:
    "This game is well-balanced! I had just the right amount of challenge to have fun!",

  platformsSuccess: "Lilmonster has won!",
  platformsBlocked: "Lilmonster is blocked...",
  platformsFailure: "Lilmonster has fallen!",

  platformsFeedbackTooEasy:
    "This game is too easy! I won without any difficulty...",
  platformsFeedbackTooHard:
    "I won, but wow... That wasn't easy! You should probably adjust the obstacles a bit.",
  platformsFeedbackBlocked:
    "This game is impossible! I got stuck, I couldn't jump correctly...",
  platformsFeedbackTimeout:
    "This game is unbalanced! There's just not enough time to finish it...",
  platformsFeedbackFailure:
    "This game is too difficult! How am I supposed not falling in the water?",
  platformsFeedbackTooFarLimit:
    "The time management is unbalanced: maybe the timer is too generous?",
  platformsFeedbackTooNearLimit:
    "I won, but just barely...! The timer probably needs a slight adjustment.",

  bossSuccess: "Lilmonster has won the fight!",
  bossFailure: "Lilmonster is KO...",

  bossFeedbackDefeat:
    "This fight is too difficult! I lost even though I gave it all my best...",
  bossFeedbackTooEasy:
    "This game is too easy! I won with almost all my life left at the end of the fight!",
  bossFeedbackAlmostTooHard:
    "The fight is a bit too difficult, I barely won and feel like it was only due to luck...",

  platforms1_title: "My first game",
  platforms2_title: "Oh. Water!",
  platforms3_title: "Let's drop it...",
  boss4_title: "Time to duel!",
  boss5_title: "It's critical",

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
  platformsTimeLimitSettings: "Timer",

  platforms1WallHeightSettings: "Wall height",
  platforms2WaterLengthSettings: "Water stretch length",
  platforms3PlatformLengthSettings: "Platform width",

  bossPlayerLifeSettings: "Player life",
  bossPlayerAttackSettings: "Player attack",
  bossPlayerDefenseSettings: "Player defense",
  bossPlayerCriticalChanceSettings: "Player critical chance",
  bossSlimeLifeSettings: "Enemy life",
  bossSlimeAttackSettings: "Enemy attack",
  bossSlimeDefenseSettings: "Enemy defense",
  bossSlimeCriticalChanceSettings: "Enemy critical chance",

  bossInflictDamageLog: (attackerName, targetName, damage) =>
    `${attackerName} deals ${damage} damage${
      damage > 1 ? "s" : ""
    } to ${targetName}!`,

  bossInflictCriticalDamageLog: (attackerName, targetName, damage) =>
    `${attackerName} deals a critical hit! ${targetName} loses ${damage} life point${
      damage > 1 ? "s" : ""
    }!`,
};
