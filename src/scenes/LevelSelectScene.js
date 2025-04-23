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
      60,
      40,
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

    // Initialiser les niveaux complétés s'ils n'existent pas déjà
    if (!localStorage.getItem("tgiu__completedLevels")) {
      // Initialiser le stockage avec seulement les premiers niveaux de chaque type déverrouillés
      const initialCompletedLevels = {};
      const levelTypes = new Set(Level.levels.map((level) => level.type));

      levelTypes.forEach((type) => {
        initialCompletedLevels[type] = [];
      });

      localStorage.setItem(
        "tgiu__completedLevels",
        JSON.stringify(initialCompletedLevels)
      );
    }

    // Affichage des niveaux
    this.displayLevels();

    createToggleSoundButton(this);

    MusicManager.play(this, "music_title");

    // Animation d'entrée
    this.cameras.main.fadeIn(500);
  }

  // Vérifier si un niveau est déverrouillé
  isLevelUnlocked(type, levelIndex) {
    try {
      const completedLevels =
        JSON.parse(localStorage.getItem("tgiu__completedLevels")) || {};

      // Si c'est le premier niveau du type, il est toujours déverrouillé
      if (levelIndex === 0) return true;

      // Sinon, vérifier si le niveau précédent a été complété
      return (
        completedLevels[type] && completedLevels[type].includes(levelIndex - 1)
      );
    } catch (e) {
      console.error(e);
      return levelIndex === 0; // En cas d'erreur, déverrouiller uniquement le premier niveau
    }
  }

  // Vérifier si un niveau est complété
  isLevelCompleted(type, levelIndex) {
    try {
      const completedLevels =
        JSON.parse(localStorage.getItem("tgiu__completedLevels")) || {};

      return (
        completedLevels[type] && completedLevels[type].includes(levelIndex)
      );
    } catch (e) {
      console.error(e);
      return false; // En cas d'erreur, considérer le niveau comme non complété
    }
  }

  // Marquer un niveau comme complété
  static markLevelAsCompleted(level) {
    try {
      const levelIndex = Level.levels
        .filter((l) => l.type === level.type)
        .findIndex((l) => l.id === level.id);

      if (levelIndex === -1) return;

      const completedLevels =
        JSON.parse(localStorage.getItem("tgiu__completedLevels")) || {};

      if (!completedLevels[level.type]) {
        completedLevels[level.type] = [];
      }

      if (!completedLevels[level.type].includes(levelIndex)) {
        completedLevels[level.type].push(levelIndex);
        localStorage.setItem(
          "tgiu__completedLevels",
          JSON.stringify(completedLevels)
        );
      }
    } catch (e) {
      console.error("Erreur lors du marquage du niveau comme complété:", e);
    }
  }

  displayLevels() {
    const padding = 20;
    const startY = 135;

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
    const levelWidth = 160;
    const levelsPerRow = 4;
    const gapBetweenLevels = 15;

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

          // Vérifier si le niveau est déverrouillé et complété
          const levelIndex = i + j;
          const isUnlocked = this.isLevelUnlocked(type, levelIndex);
          const isCompleted = this.isLevelCompleted(type, levelIndex);

          // Couleurs différentes selon l'état du niveau
          let backgroundColor;
          if (!isUnlocked) {
            backgroundColor = 0x95a5a6; // Gris pour verrouillé
          } else if (isCompleted) {
            backgroundColor = 0x27ae60; // Vert pour complété
          } else {
            backgroundColor = 0x3498db; // Bleu pour déverrouillé mais non complété
          }

          // Créer un graphique avec des coins arrondis au lieu d'un rectangle
          const background = this.add.graphics();
          background.fillStyle(backgroundColor, 1);
          background.lineStyle(2, 0xffffff, 1);

          // Dessiner un rectangle avec des coins arrondis (x, y, width, height, radius)
          background.fillRoundedRect(
            xPosition - levelWidth / 2,
            rowY - levelHeight / 2,
            levelWidth,
            levelHeight,
            12
          );

          // Ajouter une bordure avec des coins arrondis
          background.strokeRoundedRect(
            xPosition - levelWidth / 2,
            rowY - levelHeight / 2,
            levelWidth,
            levelHeight,
            12
          );

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

          const displayText = isUnlocked ? levelTitle : "🔒";

          this.add
            .text(xPosition, rowY + 15, displayText, {
              fontSize: "18px",
              fontFamily: "Arial",
              color: "#ffffff",
              align: "center",
            })
            .setOrigin(0.5);

          // Rendre le bouton interactif seulement si le niveau est déverrouillé
          if (isUnlocked) {
            // Créer une zone interactive invisible qui couvre la tuile
            const hitArea = this.add
              .zone(xPosition, rowY, levelWidth, levelHeight)
              .setInteractive({ useHandCursor: true });

            hitArea.on("pointerover", () => {
              const hoverColor = isCompleted ? 0x219653 : 0x2980b9; // Vert foncé ou bleu foncé au survol
              background.clear();
              background.fillStyle(hoverColor, 1);
              background.lineStyle(2, 0xffffff, 1);
              background.fillRoundedRect(
                xPosition - levelWidth / 2,
                rowY - levelHeight / 2,
                levelWidth,
                levelHeight,
                12
              );
              background.strokeRoundedRect(
                xPosition - levelWidth / 2,
                rowY - levelHeight / 2,
                levelWidth,
                levelHeight,
                12
              );
            });

            hitArea.on("pointerout", () => {
              background.clear();
              background.fillStyle(backgroundColor, 1);
              background.lineStyle(2, 0xffffff, 1);
              background.fillRoundedRect(
                xPosition - levelWidth / 2,
                rowY - levelHeight / 2,
                levelWidth,
                levelHeight,
                12
              );
              background.strokeRoundedRect(
                xPosition - levelWidth / 2,
                rowY - levelHeight / 2,
                levelWidth,
                levelHeight,
                12
              );
            });

            hitArea.on("pointerdown", () => {
              this.sound.play("click");
              this.cameras.main.fade(500, 0, 0, 0);
              this.time.delayedCall(500, () => {
                this.scene.start("GameScene", { level });
              });
            });
          }
        }

        currentY += levelHeight + padding;
      }

      // Ajouter un espace entre les catégories
      currentY += 20;
    });
  }
}
