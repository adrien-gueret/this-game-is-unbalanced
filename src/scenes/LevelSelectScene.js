/**
 * LevelSelectScene - Scène de sélection de niveau
 *
 * Cette scène permet au joueur de choisir le niveau qu'il souhaite jouer
 */
class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: "LevelSelectScene" });
  }

  create() {
    const { width, height } = this.cameras.main;

    // Background
    this.add
      .image(width / 2, height / 2, "background-yellow")
      .setDisplaySize(width, height);

    // Titre
    this.add
      .text(width / 2, 50, window.i18n.get("levelSelectTitle"), {
        fontSize: "36px",
        fontFamily: "Arial",
        color: "#ffffff",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Bouton retour au menu
    createButton(
      this,
      window.i18n.get("backButton"),
      100,
      50,
      () => {
        this.cameras.main.fade(500, 0, 0, 0);
        this.time.delayedCall(500, () => {
          this.scene.start("MainMenuScene");
        });
      },
      {
        color: "#e74c3c",
        size: "small",
      }
    );

    // Affichage des niveaux
    this.displayLevels();

    // Animation d'entrée
    this.cameras.main.fadeIn(500);
  }

  displayLevels() {
    const padding = 20;
    const startY = 150;

    // Grouper les niveaux par type
    const levelsByType = {};
    Level.levels.forEach((level) => {
      if (!levelsByType[level.type]) {
        levelsByType[level.type] = [];
      }
      levelsByType[level.type].push(level);
    });

    // Variable pour suivre la position Y actuelle
    let currentY = startY;
    const categoryHeight = 50;
    const levelHeight = 80;
    const levelWidth = 150;
    const levelsPerRow = 3;
    const gapBetweenLevels = 20;

    // Parcourir chaque type de niveau
    Object.keys(levelsByType).forEach((type) => {
      const levels = levelsByType[type];

      // Ajouter un titre de catégorie
      const categoryTitleKey = `${type}LevelTitle`;
      this.add
        .text(padding, currentY - 20, window.i18n.get(categoryTitleKey), {
          fontSize: "24px",
          fontFamily: "Arial",
          color: "#ffffff",
          fontStyle: "bold",
          stroke: "#000000",
          strokeThickness: 3,
        })
        .setOrigin(0, 0.5);

      currentY += categoryHeight;

      // Afficher les niveaux en grille pour ce type
      for (let i = 0; i < levels.length; i += levelsPerRow) {
        const rowY = currentY;

        // Créer une ligne de niveaux
        for (let j = 0; j < levelsPerRow && i + j < levels.length; j++) {
          const level = levels[i + j];
          const xPosition =
            padding + j * (levelWidth + gapBetweenLevels) + levelWidth / 2;

          // Fond du bouton de niveau
          const background = this.add
            .rectangle(xPosition, rowY, levelWidth, levelHeight, 0x3498db)
            .setStrokeStyle(2, 0xffffff);

          // Titre du niveau
          const levelTitle = level.getTitle();

          // Numéro du niveau
          this.add
            .text(xPosition, rowY - 15, `#${i + j + 1}`, {
              fontSize: "16px",
              fontFamily: "Arial",
              color: "#ffffff",
            })
            .setOrigin(0.5);

          this.add
            .text(xPosition, rowY + 15, levelTitle, {
              fontSize: "18px",
              fontFamily: "Arial",
              color: "#ffffff",
              align: "center",
            })
            .setOrigin(0.5);

          // Rendre le bouton interactif
          background
            .setInteractive({ useHandCursor: true })
            .on("pointerover", () => background.setFillStyle(0x2980b9))
            .on("pointerout", () => background.setFillStyle(0x3498db))
            .on("pointerdown", () => {
              this.cameras.main.fade(500, 0, 0, 0);
              this.time.delayedCall(500, () => {
                this.scene.start("GameScene", { level });
              });
            });
        }

        currentY += levelHeight + padding;
      }

      // Ajouter un espace entre les catégories
      currentY += 20;
    });
  }
}
