/**
 * FeedbackScene - Scène de feedback du joueur virtuel
 *
 * Cette scène montre le feedback du joueur fictif après avoir essayé le niveau
 */
class FeedbackScene extends Phaser.Scene {
  constructor() {
    super({ key: "FeedbackScene" });
  }

  init({ level, isBalanced, feedback, monsterAnimation, monsterStaticFrame }) {
    this.level = level;
    this.isBalanced = isBalanced;
    this.feedback = feedback;

    this.renderMonster = (x, y) => {
      const monsterSprite = this.add.sprite(
        x,
        y,
        "player-platforms",
        monsterStaticFrame
      );

      // Jouer l'animation
      if (!monsterStaticFrame && monsterAnimation) {
        monsterSprite.anims.play(monsterAnimation, true);
      }

      return monsterSprite;
    };
  }

  create() {
    // Enregistrer les animations via AnimationManager
    AnimationManager.registerAnimations(this);

    const { width, height } = this.cameras.main;

    // Background
    this.add
      .image(width / 2, height / 2, "background-grey")
      .setDisplaySize(width, height);

    this.add
      .text(width / 2, 60, window.i18n.get("feedbackTitle"), {
        fontSize: "36px",
        fontFamily: "Arial",
        color: "#ffffff",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Bulle de dialogue
    const { height: bubbleHeight, bubble } = this.createSpeechBubble(
      300,
      height / 2 - 60,
      width - 350,
      this.feedback
    );

    // Ajuster la position du cadre du monstre pour l'aligner dynamiquement avec la queue de la bulle
    const bubbleY = bubble.y; // Position Y de la bulle
    const bubbleTailY = bubbleY + bubbleHeight / 2; // Position Y de la queue de la bulle

    const monsterFrame = this.add.graphics();
    const frameWidth = 120;
    const frameHeight = 120;
    const frameX = 150; // Position à gauche de la bulle
    const frameY = bubbleTailY - frameHeight / 2; // Centré verticalement sur la queue de la bulle

    // Dessiner le cadre avec des bords arrondis
    const frameRadius = 20;
    monsterFrame.fillStyle(0xffffff, 0.5); // Fond blanc semi-transparent
    monsterFrame.lineStyle(4, 0x000000, 1); // Bords noirs
    monsterFrame.strokeRoundedRect(
      frameX,
      frameY,
      frameWidth,
      frameHeight,
      frameRadius
    );
    monsterFrame.fillRoundedRect(
      frameX,
      frameY,
      frameWidth,
      frameHeight,
      frameRadius
    );

    // Ajouter le sprite du monstre
    const monsterSprite = this.renderMonster(
      frameX + frameWidth / 2,
      frameY + frameHeight / 2
    );
    monsterSprite.setDisplaySize(frameWidth - 20, frameHeight - 20); // Ajuster la taille du sprite pour qu'il rentre dans le cadre
    monsterSprite.setDepth(1); // S'assurer que le sprite est au-dessus du cadre

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
      // Si le niveau est équilibré, permettre de l'éditer à nouveau
      this.createButton(
        this.cameras.main.width / 2,
        this.cameras.main.height - 100,
        window.i18n.get("editGameLabel"),
        0x3498db,
        () => {
          this.scene.start("EditorScene", {
            level: this.level,
          });
        }
      );
    } else {
      // Si le niveau n'est pas équilibré, permettre de l'éditer
      this.createButton(
        width / 2,
        height - 100,
        window.i18n.get("editGameLabel"),
        0x3498db,
        () => {
          this.scene.start("EditorScene", {
            level: this.level,
          });
        }
      );
    }

    // Bouton retour au menu de sélection de niveau
    this.createButton(
      width / 2,
      height - 50,
      window.i18n.get("selectGameLabel"),
      0xe67e22,
      () => {
        this.scene.start("LevelSelectScene");
      }
    );
  }

  createSpeechBubble(x, y, width, message) {
    // Définir des marges pour le texte à l'intérieur de la bulle
    const padding = 30;
    const textWidth = width - padding * 2;

    // Dessiner d'abord la bulle
    const bubble = this.add.graphics({ x, y });
    bubble.fillStyle(0xffffff, 1);
    bubble.lineStyle(4, 0x000000, 1);

    // Dimensionnement temporaire de la bulle
    const tempHeight = 160; // Hauteur temporaire
    const radius = 20;

    // Dessiner la bulle avec une hauteur temporaire
    bubble.beginPath();

    // Coin supérieur gauche
    bubble.moveTo(radius, 0);

    // Bord supérieur
    bubble.lineTo(width - radius, 0);

    // Coin supérieur droit
    bubble.arc(width - radius, radius, radius, -Math.PI / 2, 0);

    // Bord droit
    bubble.lineTo(width, tempHeight - radius);

    // Coin inférieur droit
    bubble.arc(width - radius, tempHeight - radius, radius, 0, Math.PI / 2);

    // Bord inférieur
    bubble.lineTo(radius, tempHeight);

    // Coin inférieur gauche
    bubble.arc(radius, tempHeight - radius, radius, Math.PI / 2, Math.PI);

    // Bord gauche jusqu'au point où commence la flèche
    bubble.lineTo(0, tempHeight / 2 + 20);

    // Dessiner la pointe de la flèche (centrée verticalement)
    bubble.lineTo(-20, tempHeight / 2);
    bubble.lineTo(0, tempHeight / 2 - 20);

    // Continuer le bord gauche jusqu'au coin supérieur
    bubble.lineTo(0, radius);

    // Compléter le coin supérieur gauche
    bubble.arc(radius, radius, radius, Math.PI, (3 * Math.PI) / 2);

    bubble.closePath();
    bubble.fillPath();
    bubble.strokePath();

    // APRÈS avoir dessiné la bulle, créer le texte
    const textObj = this.add
      .text(x + width / 2, y + padding, message, {
        fontSize: "24px",
        fontFamily: "Arial",
        color: "#000000",
        fontStyle: "bold", // Rendre le texte plus visible
        align: "center",
        wordWrap: { width: textWidth },
      })
      .setOrigin(0.5, 0);

    // Calculer la hauteur finale de la bulle
    const textHeight = textObj.height;
    const height = textHeight + padding * 2;

    // Effacer la bulle temporaire
    bubble.clear();

    // Redessiner la bulle avec la hauteur correcte
    bubble.fillStyle(0xffffff, 1);
    bubble.lineStyle(4, 0x000000, 1);
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

    // Bord gauche jusqu'au point où commence la flèche
    bubble.lineTo(0, height / 2 + 20);

    // Dessiner la pointe de la flèche (centrée verticalement)
    bubble.lineTo(-20, height / 2);
    bubble.lineTo(0, height / 2 - 20);

    // Continuer le bord gauche jusqu'au coin supérieur
    bubble.lineTo(0, radius);

    // Compléter le coin supérieur gauche
    bubble.arc(radius, radius, radius, Math.PI, (3 * Math.PI) / 2);

    bubble.closePath();
    bubble.fillPath();
    bubble.strokePath();

    // S'assurer que le texte est positionné au-dessus de la bulle (en z-index)
    textObj.setDepth(1);
    bubble.setDepth(0);

    // Positionner le texte au centre de la bulle
    textObj.setPosition(x + width / 2, y + height / 2);
    textObj.setOrigin(0.5);

    // Ajouter un contour au texte pour s'assurer qu'il est visible
    textObj.setStroke("#333333", 1);

    return { bubble, textObj, height };
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
