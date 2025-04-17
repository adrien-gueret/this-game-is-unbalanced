/**
 * FeedbackScene - Scène de feedback du joueur virtuel
 *
 * Cette scène montre le feedback du joueur fictif après avoir essayé le niveau
 */
class FeedbackScene extends Phaser.Scene {
  constructor() {
    super({ key: "FeedbackScene" });
  }

  create() {
    const { width, height } = this.cameras.main;

    // Récupération des données du niveau actuel
    this.currentLevelIndex = window.gameData.currentLevel;
    this.levelData = window.gameData.levels[this.currentLevelIndex];

    // Fond
    this.add.rectangle(0, 0, width, height, 0x2c3e50).setOrigin(0);

    // Avatar du joueur fictif
    const avatarSize = 120;
    const avatar = this.add
      .circle(150, height / 3, avatarSize / 2, 0x3498db)
      .setStrokeStyle(4, 0xffffff);

    this.add
      .text(150, height / 3, "😎", {
        fontSize: "60px",
      })
      .setOrigin(0.5);

    // Nom du joueur fictif
    this.add
      .text(150, height / 3 + avatarSize / 2 + 20, "JOUEUR VIRTUEL", {
        fontSize: "20px",
        fontFamily: "Arial",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Niveau joué
    this.add
      .text(width / 2, 60, `"${this.levelData.title}"`, {
        fontSize: "36px",
        fontFamily: "Arial",
        color: "#ffffff",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Bulle de dialogue
    this.createSpeechBubble(300, height / 3 - 20, width - 350, 160);

    // Feedback du joueur fictif
    const feedback = this.levelData.playerFeedback;
    const feedbackText = this.add
      .text(320, height / 3 - 30, feedback, {
        fontSize: "20px",
        fontFamily: "Arial",
        color: "#000000",
        wordWrap: { width: width - 400 },
      })
      .setOrigin(0, 0);

    // État de complétion du niveau
    const statusColor = this.levelData.balanced ? 0x2ecc71 : 0xe74c3c;
    const statusText = this.levelData.balanced
      ? "NIVEAU ÉQUILIBRÉ !"
      : "NIVEAU DÉSÉQUILIBRÉ";

    this.add
      .rectangle(width / 2, height / 2 + 30, 400, 60, statusColor, 0.8)
      .setStrokeStyle(3, 0xffffff);

    this.add
      .text(width / 2, height / 2 + 30, statusText, {
        fontSize: "28px",
        fontFamily: "Arial",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Boutons d'action
    if (this.levelData.balanced) {
      // Si le niveau est équilibré, permettre de continuer au niveau suivant
      if (this.currentLevelIndex < window.gameData.levels.length - 1) {
        // Débloquer le niveau suivant si nécessaire
        window.gameData.unlockedLevels = Math.max(
          window.gameData.unlockedLevels,
          this.currentLevelIndex + 2
        );

        const nextButton = this.createButton(
          width / 2,
          height - 100,
          "NIVEAU SUIVANT",
          0x2ecc71,
          () => {
            window.gameData.currentLevel = this.currentLevelIndex + 1;
            this.scene.start("GameScene");
          }
        );
      } else {
        // Si c'est le dernier niveau, afficher un message de félicitations
        this.add
          .text(width / 2, height - 150, "FÉLICITATIONS !", {
            fontSize: "36px",
            fontFamily: "Arial",
            color: "#f1c40f",
            fontStyle: "bold",
            stroke: "#000000",
            strokeThickness: 4,
          })
          .setOrigin(0.5);

        this.add
          .text(
            width / 2,
            height - 100,
            "Vous avez équilibré tous les niveaux !",
            {
              fontSize: "24px",
              fontFamily: "Arial",
              color: "#ffffff",
            }
          )
          .setOrigin(0.5);
      }
    } else {
      // Si le niveau n'est pas équilibré, permettre de l'éditer
      this.createButton(
        width / 2,
        height - 100,
        "MODIFIER LE NIVEAU",
        0x3498db,
        () => {
          this.scene.start("EditorScene");
        }
      );
    }

    // Bouton retour au menu de sélection de niveau
    this.createButton(
      width / 2,
      height - 50,
      "MENU DE SÉLECTION",
      0xe67e22,
      () => {
        this.scene.start("LevelSelectScene");
      }
    );
  }

  createSpeechBubble(x, y, width, height) {
    // Forme principale de la bulle
    const bubble = this.add.graphics({ x, y });

    // Style de la bulle
    bubble.fillStyle(0xffffff, 1);
    bubble.lineStyle(4, 0x000000, 1);

    // Dessiner le corps de la bulle avec des coins arrondis
    // Au lieu d'utiliser arcTo qui n'est pas disponible, utilisons des courbes
    const radius = 20; // Rayon des coins arrondis

    // Dessiner le rectangle principal avec coins arrondis
    bubble.beginPath();

    // Coin supérieur gauche
    bubble.moveTo(radius, 0);

    // Bord supérieur
    bubble.lineTo(width - radius, 0);

    // Coin supérieur droit
    bubble.arc(width - radius, radius, radius, -Math.PI / 2, 0);

    // Bord droit
    bubble.lineTo(width, height - radius);

    // Coin inférieur droit
    bubble.arc(width - radius, height - radius, radius, 0, Math.PI / 2);

    // Bord inférieur
    bubble.lineTo(radius, height);

    // Coin inférieur gauche
    bubble.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);

    // Bord gauche
    bubble.lineTo(0, radius);

    // Coin supérieur gauche
    bubble.arc(radius, radius, radius, Math.PI, (3 * Math.PI) / 2);

    bubble.closePath();
    bubble.fillPath();
    bubble.strokePath();

    // Dessiner la pointe de la bulle vers l'avatar
    bubble.fillStyle(0xffffff, 1);
    bubble.lineStyle(4, 0x000000, 1);
    bubble.beginPath();
    bubble.moveTo(0, height / 2);
    bubble.lineTo(-20, height / 2 + 20);
    bubble.lineTo(0, height / 2 + 40);
    bubble.closePath();
    bubble.fillPath();
    bubble.strokePath();

    return bubble;
  }

  createButton(x, y, text, color, callback) {
    const button = this.add
      .text(x, y, text, {
        fontSize: "24px",
        fontFamily: "Arial",
        color: "#ffffff",
        backgroundColor: "#" + color.toString(16),
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    button
      .on("pointerover", () => {
        button.setStyle({ color: "#ffff00" });
        button.setScale(1.05);
      })
      .on("pointerout", () => {
        button.setStyle({ color: "#ffffff" });
        button.setScale(1);
      })
      .on("pointerdown", callback);

    return button;
  }
}
