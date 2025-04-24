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
    const { width } = this.cameras.main;

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

        // Calculer le nombre de niveaux dans cette ligne
        const levelsInCurrentRow = Math.min(levelsPerRow, levels.length - i);

        // Calculer la largeur totale que vont occuper les niveaux dans cette ligne
        const rowWidth =
          levelsInCurrentRow * levelWidth +
          (levelsInCurrentRow - 1) * gapBetweenLevels;

        // Calculer la position de départ pour centrer la ligne
        const startX = (width - rowWidth) / 2;

        // Créer une ligne de niveaux
        for (let j = 0; j < levelsPerRow && i + j < levels.length; j++) {
          const level = levels[i + j];
          const xPosition =
            startX + j * (levelWidth + gapBetweenLevels) + levelWidth / 2;

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

          // Créer un conteneur pour la tuile de niveau
          const tileContainer = this.add.container(xPosition, rowY);

          // Créer un graphique avec des coins arrondis au lieu d'un rectangle
          const background = this.add.graphics();
          background.fillStyle(backgroundColor, 1);
          background.lineStyle(2, 0xffffff, 1);

          // Dessiner un rectangle avec des coins arrondis (x, y, width, height, radius)
          background.fillRoundedRect(
            -levelWidth / 2,
            -levelHeight / 2,
            levelWidth,
            levelHeight,
            12
          );

          // Ajouter une bordure avec des coins arrondis
          background.strokeRoundedRect(
            -levelWidth / 2,
            -levelHeight / 2,
            levelWidth,
            levelHeight,
            12
          );

          // Ajouter le background au conteneur
          tileContainer.add(background);

          // Titre du niveau
          const levelTitle = level.getTitle();

          // Numéro du niveau
          const levelNumber = this.add
            .text(0, -15, `#${i + j + 1}`, {
              fontSize: "16px",
              fontFamily: "Arial",
              color: "#ffffff",
            })
            .setOrigin(0.5);

          tileContainer.add(levelNumber);

          // Affichage du titre du niveau ou du cadenas pour les niveaux verrouillés
          if (isUnlocked) {
            // Afficher le titre du niveau si déverrouillé
            const levelText = this.add
              .text(0, 15, levelTitle, {
                fontSize: "18px",
                fontFamily: "Arial",
                color: "#ffffff",
                align: "center",
              })
              .setOrigin(0.5);

            tileContainer.add(levelText);
          } else {
            // Afficher un cadenas (sprite) si verrouillé
            const lockIcon = this.add.sprite(0, 15, "ui", 0).setOrigin(0.5);
            tileContainer.add(lockIcon);

            // Ajouter une zone interactive pour les niveaux verrouillés aussi
            const hitArea = this.add
              .zone(0, 0, levelWidth, levelHeight)
              .setInteractive({ useHandCursor: false });

            tileContainer.add(hitArea);

            // Variable pour suivre si l'animation est en cours
            let isAnimationPlaying = false;

            // Animation du cadenas au survol
            hitArea.on("pointerover", () => {
              // Ne jouer l'animation que si elle n'est pas déjà en cours
              if (!isAnimationPlaying) {
                isAnimationPlaying = true;

                this.tweens.add({
                  targets: lockIcon,
                  x: { from: 0, to: -5, duration: 50, yoyo: true, repeat: 3 }, // Tremblement rapide de gauche à droite
                  ease: "Sine.easeInOut",
                  onComplete: () => {
                    // Réinitialiser la position et le flag quand l'animation est terminée
                    lockIcon.x = 0; // S'assurer que l'icône revient à sa position initiale
                    isAnimationPlaying = false;
                  },
                });
              }
            });
          }

          // Ajouter un checkmark pour les niveaux complétés
          if (isCompleted) {
            const checkmark = this.add
              .sprite(levelWidth / 2 - 20, -levelHeight / 2 + 20, "ui", 1)
              .setOrigin(0.5)
              .setAlpha(0.5);
            tileContainer.add(checkmark);
          }

          // Rendre le bouton interactif seulement si le niveau est déverrouillé
          if (isUnlocked) {
            // Créer une zone interactive invisible qui couvre la tuile
            const hitArea = this.add
              .zone(0, 0, levelWidth, levelHeight)
              .setInteractive({ useHandCursor: true });

            tileContainer.add(hitArea);

            hitArea.on("pointerover", () => {
              const hoverColor = isCompleted ? 0x219653 : 0x2980b9; // Vert foncé ou bleu foncé au survol
              background.clear();
              background.fillStyle(hoverColor, 1);
              background.lineStyle(2, 0xffffff, 1);
              background.fillRoundedRect(
                -levelWidth / 2,
                -levelHeight / 2,
                levelWidth,
                levelHeight,
                12
              );
              background.strokeRoundedRect(
                -levelWidth / 2,
                -levelHeight / 2,
                levelWidth,
                levelHeight,
                12
              );

              // Effet de scale up au hover
              this.tweens.add({
                targets: tileContainer,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 100,
                ease: "Power2.easeIn",
              });
            });

            hitArea.on("pointerout", () => {
              background.clear();
              background.fillStyle(backgroundColor, 1);
              background.lineStyle(2, 0xffffff, 1);
              background.fillRoundedRect(
                -levelWidth / 2,
                -levelHeight / 2,
                levelWidth,
                levelHeight,
                12
              );
              background.strokeRoundedRect(
                -levelWidth / 2,
                -levelHeight / 2,
                levelWidth,
                levelHeight,
                12
              );

              // Retour à la taille normale
              this.tweens.add({
                targets: tileContainer,
                scaleX: 1,
                scaleY: 1,
                duration: 100,
                ease: "Power1",
              });
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
