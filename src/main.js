/**
 * Configuration principale du jeu Phaser
 */
const config = {
  type: Phaser.AUTO, // Utilise WebGL si disponible, sinon Canvas
  width: 800,
  height: 600,
  backgroundColor: "#000000",
  parent: "game-container",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  pixelArt: true,
  scene: [
    BootScene,
    MainMenuScene,
    LevelSelectScene,
    GameScene,
    FeedbackScene,
    EditorScene,
    ResultScene,
  ],
};

// Création de l'instance du jeu
const game = new Phaser.Game(config);
