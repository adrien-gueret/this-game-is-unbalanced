/**
 * MainMenuScene - Menu principal du jeu
 *
 * Cette scène affiche le menu d'accueil avec les options pour démarrer le jeu
 * et présente le titre du jeu.
 */

class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainMenuScene" });
    this.backgroundMusic = null;
  }

  create() {
    const { width, height } = this.cameras.main;

    // Initialisation de la musique de fond
    if (!this.backgroundMusic) {
      this.backgroundMusic = this.sound.add("music_title", {
        volume: 0.5,
        loop: true,
      });
    }

    // Essayer de jouer la musique automatiquement (peut être bloqué par le navigateur)
    this.tryPlayMusic();

    // Ajouter un gestionnaire d'événements global pour détecter la première interaction utilisateur
    if (!this.backgroundMusic.isPlaying) {
      this.input.on("pointerdown", this.handleFirstInteraction, this);
      this.input.keyboard.on("keydown", this.handleFirstInteraction, this);
    }

    // Affichage du background
    this.add
      .image(width / 2, height / 2, "background-yellow")
      .setDisplaySize(width, height);

    // Titre du jeu - initialement hors écran (à gauche)
    const title = this.add
      .text(-600, height / 4, window.i18n.get("mainTitle"), {
        fontSize: "40px",
        fontFamily: "Arial",
        color: "#ffffff",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 6,
        shadow: {
          color: "#000000",
          blur: 10,
          offsetX: 2,
          offsetY: 2,
          fill: true,
        },
      })
      .setOrigin(0.5);

    // Sous-titre - initialement hors écran (à droite)
    const subtitle = this.add
      .text(width + 600, height / 4 + 50, window.i18n.get("subtitle"), {
        fontSize: "24px",
        fontFamily: "Arial",
        color: "#000000",
        fontStyle: "italic",
        stroke: "#ffffff",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    // Animation d'entrée pour le titre (depuis la gauche)
    this.tweens.add({
      targets: title,
      x: width / 2,
      duration: 400,
      ease: "Power2.easeOut",
      delay: 100,
    });

    // Animation d'entrée pour le sous-titre (depuis la droite)
    this.tweens.add({
      targets: subtitle,
      x: width / 2,
      duration: 400,
      ease: "Power2.easeOut",
      delay: 400, // Léger décalage par rapport au titre
    });

    this.time.delayedCall(1000, () => {
      // Fonction pour créer un bouton avec effet de fondu
      const createFadingButton = (label, x, y, onClick, options, delay) => {
        const button = createButton(this, label, x, y, onClick, options);

        // Rendre le bouton initialement invisible
        button.setAlpha(0);

        // Animation de fondu
        this.tweens.add({
          targets: button,
          alpha: 1,
          duration: 500,
          ease: "Cubic.easeIn",
          delay: delay,
        });

        return button;
      };

      // Bouton de démarrage avec fondu
      createFadingButton(
        window.i18n.get("playButton"),
        width / 2,
        height / 2 + 100,
        () => {
          this.cameras.main.fade(500, 0, 0, 0);
          this.time.delayedCall(500, () => {
            this.scene.start("LevelSelectScene");
          });
        },
        { size: "big", color: "#3498db" },
        0 // Premier bouton à apparaître
      );

      // Bouton tutoriel avec fondu
      createFadingButton(
        window.i18n.get("tutorialButton"),
        width / 2,
        height / 2 + 160,
        () => {
          this.showTutorial();
        },
        { color: "#26a524" },
        150 // Légère attente après le premier bouton
      );

      // Bouton de changement de langue avec fondu
      createFadingButton(
        window.i18n.get("languageButton"),
        width - 100,
        height - 40,
        () => {
          // Changer de langue
          window.i18n.toggleLanguage();
          // Rafraîchir la scène pour appliquer les changements
          this.scene.restart();
        },
        { size: "small" },
        300
      );
    });

    // Initialisation du sprite monstre en dehors de l'écran
    const monsterSprite = this.add
      .sprite(100, height + 356 / 2, "player-platforms", 0)
      .setDisplaySize(356, 356); // Rendre le sprite interactif

    // Variable pour stocker la position finale du monstre
    const monsterFinalY = height - 356 / 2 + 100;
    const monsterIdleOffset = 10; // Différence pour l'oscillation

    // Animation d'entrée du monstre avec un délai de 1.5s
    this.time.delayedCall(1000, () => {
      this.tweens.add({
        targets: monsterSprite,
        y: monsterFinalY, // Position finale
        duration: 1600,
        ease: "Back.easeOut", // Effet de rebond léger à la fin
        onComplete: () => {
          // Animation d'idle après l'entrée
          this.startIdleAnimation(
            monsterSprite,
            monsterFinalY,
            monsterIdleOffset
          );

          monsterSprite.setInteractive({ useHandCursor: true });

          // Easter egg au clic sur le monstre
          monsterSprite.on("pointerdown", () => {
            // Si un easter egg est déjà en cours, ignorer le clic
            if (monsterSprite.isEasterEggActive) return;

            monsterSprite.isEasterEggActive = true;

            this.sound.play("surprised");

            // Stopper l'animation d'idle si elle existe
            if (this.idleTween) {
              this.idleTween.stop();
              this.idleTween = null; // Très important pour éviter les bugs
            }

            // Changer la frame du monstre
            monsterSprite.setFrame(6);

            // Créer et animer le point d'exclamation avec un style amélioré
            const exclamation = this.add
              .text(monsterSprite.x, monsterSprite.y - 180, "!", {
                fontSize: "72px", // Taille augmentée
                fontFamily: "Arial Black",
                fontStyle: "bold",
                color: "#ff0000",
                stroke: "#000000", // Contour noir
                strokeThickness: 8, // Épaisseur du contour
                shadow: {
                  offsetX: 2,
                  offsetY: 2,
                  color: "#000",
                  blur: 5,
                  fill: true,
                },
              })
              .setOrigin(0.5);

            // Animation d'apparition du point d'exclamation
            this.tweens.add({
              targets: exclamation,
              scale: { from: 0, to: 1.2 },
              y: monsterSprite.y - 220,
              duration: 400,
              ease: "Back.easeOut",
              yoyo: true,
              hold: 400,
              onComplete: () => {
                exclamation.destroy();
              },
            });

            // Retour à la normale après une seconde
            this.time.delayedCall(1000, () => {
              monsterSprite.setFrame(0);
              monsterSprite.isEasterEggActive = false;
              monsterSprite.y = monsterFinalY; // Important: réinitialiser la position

              // Petit délai pour assurer une transition fluide
              this.time.delayedCall(50, () => {
                // Redémarrer l'animation d'idle avec la fonction dédiée
                this.startIdleAnimation(
                  monsterSprite,
                  monsterFinalY,
                  monsterIdleOffset
                );
              });
            });
          });
        },
      });
    });

    // Animation d'entrée
    this.cameras.main.fadeIn(1000);
  }

  // Essayer de jouer la musique (peut être bloqué par le navigateur)
  tryPlayMusic() {
    if (this.backgroundMusic.isPlaying) {
      return;
    }

    try {
      this.backgroundMusic.play();
    } catch (error) {}
  }

  // Gérer la première interaction utilisateur
  handleFirstInteraction() {
    // Ne démarrer la musique que si elle n'est pas déjà en cours de lecture
    if (!this.backgroundMusic?.isPlaying) {
      this.backgroundMusic.play();
    }

    // Retirer les écouteurs après la première interaction
    this.input.off("pointerdown", this.handleFirstInteraction, this);
    this.input.keyboard.off("keydown", this.handleFirstInteraction, this);
  }

  // Méthode pour démarrer l'animation d'idle
  startIdleAnimation(sprite, baseY, offset) {
    // Assurer qu'on n'ait pas plusieurs animations idle en même temps
    if (this.idleTween) {
      this.idleTween.stop();
      this.idleTween = null;
    }

    // S'assurer que le sprite est à sa position de base
    sprite.y = baseY;

    // Créer une nouvelle animation idle avec un léger délai au démarrage
    this.idleTween = this.tweens.add({
      targets: sprite,
      y: baseY - offset,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
      delay: 100, // Petit délai pour une transition plus naturelle
    });
  }

  showTutorial() {
    const { width, height } = this.cameras.main;

    // Groupe pour tous les éléments du tutoriel
    const tutorialGroup = this.add.group();

    // Fond semi-transparent avec fondu
    const overlay = this.add
      .rectangle(0, 0, width * 2, height * 2, 0x000000, 0)
      .setOrigin(0)
      .setInteractive();
    tutorialGroup.add(overlay);

    // Animation de fondu pour l'overlay
    this.tweens.add({
      targets: overlay,
      fillAlpha: 0.8,
      duration: 300,
      ease: "Power2.easeIn",
    });

    // Dimensions optimisées de la boîte de tutoriel
    const boxWidth = 650;
    const boxHeight = 450;

    // Container pour tous les éléments du tutoriel (sauf overlay)
    const contentContainer = this.add.container(width / 2, -boxHeight);
    tutorialGroup.add(contentContainer);

    // Boîte de tutoriel
    const tutorialBox = this.add
      .rectangle(0, 0, boxWidth, boxHeight, 0x333333)
      .setStrokeStyle(4, 0xffffff);
    contentContainer.add(tutorialBox);

    // Titre du tutoriel
    const title = this.add
      .text(0, -boxHeight / 2 + 40, window.i18n.get("tutorialTitle"), {
        fontSize: "28px",
        fontFamily: "Arial",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    contentContainer.add(title);

    // Instructions
    const instructions = window.i18n.get("tutorialInstructions");
    let yPos = -boxHeight / 2 + 100;
    const textAreaWidth = boxWidth - 100; // Marge pour le texte

    instructions.forEach((instruction) => {
      const instructionText = this.add
        .text(-textAreaWidth / 2 + 20, yPos, instruction, {
          fontSize: "18px",
          fontFamily: "Arial",
          color: "#ffffff",
          wordWrap: { width: textAreaWidth, useAdvancedWrap: true },
          align: "left",
        })
        .setOrigin(0, 0); // Aligné en haut à gauche

      contentContainer.add(instructionText);

      // Ajuster la hauteur en fonction de la hauteur réelle du texte
      yPos += instructionText.height + 15;
    });

    // Bouton fermer
    const closeButton = createButton(
      this,
      window.i18n.get("closeButton"),
      0,
      boxHeight / 2 - 40,
      () => {
        // Animation de sortie
        this.tweens.add({
          targets: contentContainer,
          y: -boxHeight,
          duration: 400,
          ease: "Back.easeIn",
          onComplete: () => {
            tutorialGroup.destroy(true);
          },
        });

        // Fondu de l'overlay
        this.tweens.add({
          targets: overlay,
          fillAlpha: 0,
          duration: 300,
          ease: "Power2.easeOut",
        });
      },
      { color: "#e74c3c", size: "medium" }
    );
    contentContainer.add(closeButton);

    // Animation d'entrée pour le conteneur de tutoriel
    this.tweens.add({
      targets: contentContainer,
      y: height / 2,
      duration: 500,
      ease: "Back.easeOut",
      delay: 100,
    });
  }
}
