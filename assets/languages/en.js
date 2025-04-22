window.languages = window.languages || {};

window.languages.en = {
  // Titres généraux
  mainTitle: "This game is unbalanced!",
  subtitle: "The game where YOU balance the game!",
  levelSelectTitle: "Game Selection",
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
    "1. Watch Lilmonster playing a game",
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
  playerName: "Lilmonster",
  slimeName: "Lilslime",

  gameFeedbackBalanced:
    "This game is well-balanced! I had just the right amount of challenge to have fun!",

  platformsLevelTitle: "Platform Games",
  bossLevelTitle: "Turn-based Fight Games",
  match3LevelTitle: "Match 3 Games",

  platformsSuccess: "Lilmonster has won!",
  platformsBlocked: "Lilmonster is blocked...",
  platformsFailure: "Lilmonster has fallen!",

  platformsFeedbackTooEasy:
    "This game is too easy! I won without any difficulty... You should probably add some obstacles.",
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
  bossFeedbackTimeout:
    "This game is unbalanced, the fight is way too long... I have better things to do!",

  platforms_1_title: "My first game",
  platforms_2_title: "Oh. Water!",
  platforms_3_title: "Let's drop it...",
  boss_1_title: "Time to duel!",
  boss_2_title: "It's critical",
  boss_3_title: "I need healing",
  match3_1_title: "Not a Pay-2-Win",
  match3_2_title: "C-c-combos!",
  match3_3_title: "Broken combo...",

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
  bossPotitionQuantitySettings: "Potion quantity",
  bossPotitionEfficiencySettings: "Health restored per potion",

  bossInflictDamageLog: (attackerName, targetName, damage) =>
    `${attackerName} deals ${damage} damage${
      damage > 1 ? "s" : ""
    } to ${targetName}!`,

  bossInflictCriticalDamageLog: (attackerName, targetName, damage) =>
    `${attackerName} deals a critical hit! ${targetName} loses ${damage} life point${
      damage > 1 ? "s" : ""
    }!`,

  bossDrinkPotionLog: (targetName, heal) =>
    `${targetName} drinks a potion and recovers ${heal} life point${
      heal > 1 ? "s" : ""
    }!`,

  match3Blocked: "Game blocked! Shuffling the grid...",
  match3Success: "Lilmonster reached the target score!",
  match3MovesDepleted: "Lilmonster ran out of moves...",
  match3MovesDepletedFeedback:
    "This game is too difficult! I played as best as I could, but I lost...",
  match3FeedbackTooEasy:
    "This game is too easy! It gives me too many ways to reach the target score.",
  match3FeedbackTooHard:
    "I won but... I found it stressful. The game sets a goal that's too hard to reach...",
  match3FeedbackTooFast:
    "I won in far fewer moves than needed: where's the challenge?",

  match3Score: (currentScore, targetScore) =>
    `Score: ${Math.floor(currentScore)}/${targetScore}`,
  match3Moves: (movesCount, moveLimit) => `Moves: ${movesCount}/${moveLimit}`,

  match3TotalColorsSettings: "Total of colors",
  match3TargetScoreSettings: "Score to reach",
  match3MaxMovesSettings: "Maximum number of moves",
  match3ScorePerTileSettings: "Score per removed tile",
  match3ComboMultiplierSettings: "Combo multiplier increment",
};
