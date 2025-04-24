window.languages = window.languages || {};

window.languages.fr = {
  // Titres généraux
  mainTitle: "This game is unbalanced!",
  subtitle: "Le jeu où TU équilibres le jeu!",
  levelSelectTitle: "Sélection du jeu",
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

  // Instructions du tutoriel
  tutorialInstructions: [
    "1. Regardez Potimonstre jouer à un jeu",
    "2. Il vous donnera ensuite son avis sur son expérience de jeu",
    "3. Équilibrez le jeu en ajustant divers paramètres",
    "4. Débloquez de nouveaux jeux en équilibrant les précédents",
    "5. Amusez-vous à créer l'expérience de jeu parfaite !",
  ],

  editGameLabel: "Modifier le jeu",
  selectGameLabel: "Jouer à un autre jeu",

  // - Levels
  timer: (current, max) =>
    `Temps : ${(max - current).toString().padStart(2, "0")}`,
  watchInstruction: "Regardez Potimonstre jouer au jeu !",
  timeout: "Temps écoulé...",
  clickToStart: "Cliquez pour commencer",
  clickToContinue: "Cliquez pour continuer",
  playerName: "Potimonstre",
  slimeName: "Potiblob",

  gameFeedbackBalanced:
    "Ce jeu est bien équilibré ! J'ai eu juste ce qu'il faut de défi pour m'amuser !",

  platformsLevelTitle: "Jeux de plateformes",
  bossLevelTitle: "Jeux de combats au tour par tour",
  match3LevelTitle: "Jeux de Match 3",

  platformsSuccess: "Potimonstre a gagné !",
  platformsBlocked: "Potimonstre est bloqué...",
  platformsFailure: "Potimonstre est tombé !",

  platformsFeedbackTooEasy:
    "Ce jeu est trop facile ! J'ai gagné sans la moindre difficulté... Il faudrait ajouter des obstacles.",
  platformsFeedbackTooHard:
    "J'ai gagné, mais wow... Ce n'était pas facile ! Il faudrait sans doute revoir un peu les obstacles.",
  platformsFeedbackBlocked:
    "Ce jeu est impossible ! Je me suis retrouvé bloqué, je ne pouvais pas sauter correctement...",
  platformsFeedbackTimeout:
    "Ce jeu est mal équilibré ! On n'a juste pas le temps de le finir...",
  platformsFeedbackFailure:
    "Ce jeu est trop difficile ! Comment suis-je censé ne pas tomber dans l'eau ?",
  platformsFeedbackTooFarLimit:
    "La gestion du temps est mal équilibrée : peut-être que le chronomètre est trop généreux ?",
  platformsFeedbackTooNearLimit:
    "J'ai gagné, mais vraiment de justesse... ! Il faudrait sans doute ajuster un petit peu le chronomètre.",

  bossSuccess: "Potimonstre a gagné le combat !",
  bossFailure: "Potimonstre est KO...",

  bossFeedbackDefeat:
    "Ce jeu est trop difficile ! J'ai perdu alors que j'ai donné le meilleur de moi-même...",
  bossFeedbackTooEasy:
    "Ce jeu est trop facile ! J'ai gagné en ayant presque toute ma vie à la fin du combat !",
  bossFeedbackAlmostTooHard:
    "Le combat est un peu trop difficile, j'ai gagné de justesse et j'ai l'impression que c'est uniquement par chance...",
  bossFeedbackTimeout:
    "Ce jeu est mal équilibré, le combat est beaucoup trop long... J'ai autre chose à faire !",

  platforms_1_title: "Mon premier jeu",
  platforms_2_title: "Oh, de l'eau !",
  platforms_3_title: "Laisse tomber...",
  platforms_4_title: "Sauts en série",
  boss_1_title: "L'heure du duel !",
  boss_2_title: "C'est critique",
  boss_3_title: "Besoin de soins",
  boss_4_title: "Ô rage !",
  match3_1_title: "Pas un Pay-2-Win",
  match3_2_title: "C-c-combos !",
  match3_3_title: "Combo cassé...",
  match3_4_title: "Puissance 4",

  // Feedback
  feedbackTitle: "L'avis de Potimonstre",
  balancedGame: "JEU ÉQUILIBRÉ",
  unbalancedGame: "JEU NON ÉQUILIBRÉ",

  // Editor
  editorTitle: (levelTitle) => `Édition du jeu - ${levelTitle}`,
  editorInstructions: "Modifiez les paramètres du jeu pour l'équilibrer !",

  editorPlayButton: "Tester ces paramètres",
  editorResetButton: "Réinitialiser les paramètres",

  platformsPlayerSpeedSettings: "Vitesse du joueur",
  platformsPlayerGravitySettings: "Force de la gravité",
  platformsJumpHeightSettings: "Hauteur de saut",
  platformsTimeLimitSettings: "Chronomètre",

  platforms1WallHeightSettings: "Hauteur du mur",
  platforms2WaterLengthSettings: "Longueur de l'étendue d'eau",
  platforms3PlatformLengthSettings: "Largeur de la plateforme",
  platforms4PlatformsTotalSettings: "Nombre de plateformes",
  platforms4PlatformsWidthSettings: "Largeur des plateformes",
  platforms4HolesWidthSettings: "Largeur des trous",

  bossPlayerLifeSettings: "Vie du joueur",
  bossPlayerAttackSettings: "Attaque du joueur",
  bossPlayerDefenseSettings: "Défense du joueur ",
  bossPlayerCriticalChanceSettings: "Chance de critique du joueur",
  bossSlimeLifeSettings: "Vie de l'ennemi",
  bossSlimeAttackSettings: "Attaque de l'ennemi",
  bossSlimeDefenseSettings: "Défense de l'ennemi",
  bossSlimeCriticalChanceSettings: "Chance de critique de l'ennemi",
  bossPotitionQuantitySettings: "Quantité de potions",
  bossPotitionEfficiencySettings: "Vie récupérée par potion",
  bossEnrageTriggerSettings: "% de vie restante pour que l'ennemi s'enrage",
  bossEnrageMultiplicatorSettings: "Bonus mult. de dégâts lors de la rage",

  bossInflictDamageLog: (attackerName, targetName, damage) =>
    `${attackerName} inflige ${damage} point${
      damage > 1 ? "s" : ""
    } de dégât à ${targetName} !`,

  bossInflictCriticalDamageLog: (attackerName, targetName, damage) =>
    `${attackerName} inflige un coup critique ! ${targetName} perd ${damage} point${
      damage > 1 ? "s" : ""
    } de vie !`,

  bossDrinkPotionLog: (targetName, heal) =>
    `${targetName} boit une potion et regagne ${heal} point${
      heal > 1 ? "s" : ""
    } de vie !`,

  bossEnrageLog: (targetName) =>
    `${targetName} est enragé ! Il devient plus fort !`,

  match3Success: "Potimonstre a obtenu le score à atteindre !",
  match3MovesDepleted: "Potimonstre a épuisé tous ses coups...",

  match3MovesDepletedFeedback:
    "Ce jeu est trop difficile ! J'ai joué du mieux que j'ai pu, mais j'ai perdu...",
  match3FeedbackTooEasy:
    "Ce jeu est trop facile ! Il me donne trop de moyens pour obtenir le score à atteindre.",
  match3FeedbackTooHard:
    "J'ai gagné mais... J'ai trouvé ça stressant. Le jeu fixe un objectif trop difficile à atteindre...",
  match3FeedbackTooFast:
    "J'ai gagné en beaucoup moins de coups que nécessaire : où est le défi ?",

  match3Blocked: "Jeu bloqué ! Mélangé de la grille...",
  match3Score: (currentScore, targetScore) =>
    `Score : ${Math.floor(currentScore)}/${targetScore}`,
  match3Moves: (movesCount, moveLimit) => `Coups : ${movesCount}/${moveLimit}`,

  match3TotalColorsSettings: "Nombre de couleurs",
  match3TargetScoreSettings: "Score à atteindre",
  match3MaxMovesSettings: "Nombre de coups maximum",
  match3ScorePerTileSettings: "Score obtenu par tuile supprimée",
  match3ComboMultiplierSettings: "Incrément du combo multiplicateur",
  match3MinMatchSettings: "Nombre de tuiles à aligner",
};
