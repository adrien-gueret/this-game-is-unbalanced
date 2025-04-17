/**
 * MainMenuScene - Menu principal du jeu
 *
 * Cette scène affiche le menu d'accueil avec les options pour démarrer le jeu
 * et présente le titre du jeu.
 */
class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainMenuScene" });
  }

  create() {
    const { width, height } = this.cameras.main;

    // Affichage du background
    this.add
      .image(width / 2, height / 2, "background-yellow")
      .setDisplaySize(width, height);

    // Titre du jeu
    this.add
      .text(width / 2, height / 4, window.i18n.get("mainTitle"), {
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

    // Sous-titre
    this.add
      .text(width / 2, height / 4 + 50, window.i18n.get("subtitle"), {
        fontSize: "24px",
        fontFamily: "Arial",
        color: "#ffff00",
        fontStyle: "italic",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    // Logo du jeu (si disponible)
    this.add.image(width / 2, height / 2 - 20, "logo").setScale(0.5);

    // Bouton de démarrage
    const startButton = this.add
      .text(width / 2, height / 2 + 100, window.i18n.get("playButton"), {
        fontSize: "32px",
        fontFamily: "Arial",
        color: "#ffffff",
        backgroundColor: "#1a6b38",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    // Animation de survol du bouton
    startButton
      .on("pointerover", () => {
        startButton.setStyle({ color: "#ffff00" });
        startButton.setScale(1.1);
      })
      .on("pointerout", () => {
        startButton.setStyle({ color: "#ffffff" });
        startButton.setScale(1);
      })
      .on("pointerdown", () => {
        this.cameras.main.fade(500, 0, 0, 0);
        this.time.delayedCall(500, () => {
          this.scene.start("LevelSelectScene");
        });
      });

    // Bouton tutoriel
    const tutorialButton = this.add
      .text(width / 2, height / 2 + 160, window.i18n.get("tutorialButton"), {
        fontSize: "24px",
        fontFamily: "Arial",
        color: "#ffffff",
        backgroundColor: "#3498db",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    tutorialButton
      .on("pointerover", () => {
        tutorialButton.setStyle({ color: "#ffff00" });
        tutorialButton.setScale(1.1);
      })
      .on("pointerout", () => {
        tutorialButton.setStyle({ color: "#ffffff" });
        tutorialButton.setScale(1);
      })
      .on("pointerdown", () => {
        this.showTutorial();
      });

    // Bouton de changement de langue
    const languageButton = this.add
      .text(width - 20, height - 20, window.i18n.get("languageButton"), {
        fontSize: "18px",
        fontFamily: "Arial",
        color: "#ffffff",
        backgroundColor: "#2980b9",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(1, 1)
      .setInteractive({ useHandCursor: true });

    languageButton
      .on("pointerover", () => {
        languageButton.setScale(1.05);
      })
      .on("pointerout", () => {
        languageButton.setScale(1);
      })
      .on("pointerdown", () => {
        // Changer de langue
        window.i18n.toggleLanguage();
        // Rafraîchir la scène pour appliquer les changements
        this.scene.restart();
      });

    // Animation d'entrée
    this.cameras.main.fadeIn(1000);
  }

  showTutorial() {
    const { width, height } = this.cameras.main;

    // Groupe pour tous les éléments du tutoriel
    // Cela facilitera la suppression de tous les éléments en une seule fois
    const tutorialGroup = this.add.group();

    // Fond semi-transparent
    const overlay = this.add
      .rectangle(0, 0, width * 2, height * 2, 0x000000, 0.8)
      .setOrigin(0)
      .setInteractive();
    tutorialGroup.add(overlay);

    // Boîte de tutoriel
    const tutorialBox = this.add
      .rectangle(width / 2, height / 2, 600, 400, 0x333333)
      .setOrigin(0.5)
      .setStrokeStyle(4, 0xffffff);
    tutorialGroup.add(tutorialBox);

    // Titre du tutoriel
    const title = this.add
      .text(width / 2, height / 2 - 160, window.i18n.get("tutorialTitle"), {
        fontSize: "28px",
        fontFamily: "Arial",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    tutorialGroup.add(title);

    // Instructions
    const instructions = window.i18n.get("tutorialInstructions");
    let yPos = height / 2 - 100;

    instructions.forEach((instruction) => {
      const instructionText = this.add
        .text(width / 2 - 250, yPos, instruction, {
          fontSize: "20px",
          fontFamily: "Arial",
          color: "#ffffff",
          align: "left",
        })
        .setOrigin(0, 0.5);
      tutorialGroup.add(instructionText);
      yPos += 40;
    });

    // Bouton fermer
    const closeButton = this.add
      .text(width / 2, height / 2 + 150, window.i18n.get("closeButton"), {
        fontSize: "24px",
        fontFamily: "Arial",
        color: "#ffffff",
        backgroundColor: "#e74c3c",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    tutorialGroup.add(closeButton);

    closeButton
      .on("pointerover", () => closeButton.setStyle({ color: "#ffff00" }))
      .on("pointerout", () => closeButton.setStyle({ color: "#ffffff" }))
      .on("pointerdown", () => {
        // Détruire tous les éléments du tutoriel d'un coup
        tutorialGroup.destroy(true);
      });
  }
}
