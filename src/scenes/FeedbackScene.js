/**
 * FeedbackScene - Scène de feedback du joueur virtuel
 *
 * Cette scène montre le feedback du joueur fictif après avoir essayé le niveau
 */
class FeedbackScene extends Phaser.Scene {
  constructor() {
    super({ key: "FeedbackScene" });
  }

  init({ level, isBalanced, feedback }) {
    this.level = level;
    this.isBalanced = isBalanced;
    this.feedback = feedback;
  }

  create() {
    const { width, height } = this.cameras.main;

    // Background
    this.add
      .image(width / 2, height / 2, "background-grey")
      .setDisplaySize(width, height);

    // Niveau joué
    this.add
      .text(width / 2, 60, `${this.level.getTitle()}`, {
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

    // État de complétion du niveau
    const statusColor = this.isBalanced ? 0x2ecc71 : 0xe74c3c;
    const statusText = this.isBalanced
      ? window.i18n.get("balancedGame")
      : window.i18n.get("unbalancedGame");

    this.add
      .rectangle(width / 2, 125, 400, 60, statusColor, 0.8)
      .setStrokeStyle(3, 0xffffff);

    this.add
      .text(width / 2, 125, statusText, {
        fontSize: "28px",
        fontFamily: "Arial",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Boutons d'action
    if (this.isBalanced) {
      // TODO
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
