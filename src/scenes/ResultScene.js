/**
 * ResultScene - Scène de résultat final
 *
 * Cette scène affiche le résultat final quand tous les niveaux sont équilibrés
 */
class ResultScene extends Phaser.Scene {
  constructor() {
    super({ key: "ResultScene" });
  }

  create() {
    const { width, height } = this.cameras.main;

    // Fond festif avec des particules
    this.add.rectangle(0, 0, width, height, 0x2c3e50).setOrigin(0);

    // Titre de félicitations
    this.add
      .text(width / 2, 100, "FÉLICITATIONS !", {
        fontSize: "48px",
        fontFamily: "Arial",
        color: "#f1c40f",
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

    // Message principal
    this.add
      .text(width / 2, 180, "Vous avez équilibré tous les niveaux !", {
        fontSize: "28px",
        fontFamily: "Arial",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Détails du résultat
    const totalLevels = window.gameData.levels.length;
    const balancedLevels = window.gameData.levels.filter(
      (level) => level.balanced
    ).length;

    this.add
      .text(
        width / 2,
        250,
        `Niveaux équilibrés: ${balancedLevels}/${totalLevels}`,
        {
          fontSize: "24px",
          fontFamily: "Arial",
          color: "#2ecc71",
        }
      )
      .setOrigin(0.5);

    // Icône de trophée
    this.add.text(width / 2, 350, "🏆", { fontSize: "80px" }).setOrigin(0.5);

    // Message de fin
    this.add
      .text(
        width / 2,
        450,
        "Vous êtes maintenant un expert en équilibrage de jeux !",
        {
          fontSize: "22px",
          fontFamily: "Arial",
          color: "#ffffff",
          fontStyle: "italic",
        }
      )
      .setOrigin(0.5);

    // Boutons pour revenir au menu ou recommencer
    this.createButton(width / 2, height - 150, "RETOUR AU MENU", 0x3498db, () =>
      this.scene.start("MainMenuScene")
    );

    this.createButton(width / 2, height - 80, "RECOMMENCER", 0xe67e22, () =>
      this.resetGame()
    );

    // Ajouter des particules festives
    this.createParticles();

    // Jouer un son de victoire si disponible
    // this.sound.play('victory');

    // Animation d'entrée
    this.cameras.main.fadeIn(1000);
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

    button.on("pointerover", () => {
      button.setStyle({ color: "#ffff00" });
      button.setScale(1.05);
    });

    button.on("pointerout", () => {
      button.setStyle({ color: "#ffffff" });
      button.setScale(1);
    });

    button.on("pointerdown", callback);

    return button;
  }

  createParticles() {
    const { width, height } = this.cameras.main;

    // Émetteurs de particules aux quatre coins
    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];

    for (let i = 0; i < 4; i++) {
      const x = i % 2 === 0 ? 100 : width - 100;
      const y = i < 2 ? 100 : height - 100;

      const particles = this.add.particles(x, y, "particle", {
        frame: { frames: [0], cycle: true },
        lifespan: 3000,
        speed: { min: 100, max: 200 },
        scale: { start: 0.5, end: 0 },
        gravityY: 100,
        blendMode: "ADD",
        emitting: true,
        frequency: 100,
        quantity: 2,
      });

      // Comme nous n'avons pas de texture réelle pour les particules,
      // créons une alternative simple avec des cercles colorés
      for (let j = 0; j < 100; j++) {
        setTimeout(() => {
          const color = Phaser.Utils.Array.GetRandom(colors);
          const angle = Phaser.Math.Between(0, 360);
          const speed = Phaser.Math.Between(100, 300);

          const particle = this.add.circle(
            x,
            y,
            Phaser.Math.Between(2, 5),
            color,
            0.8
          );

          this.tweens.add({
            targets: particle,
            x: x + Math.cos(angle) * speed,
            y: y + Math.sin(angle) * speed,
            alpha: 0,
            scale: 0.1,
            duration: Phaser.Math.Between(1000, 3000),
            onComplete: () => particle.destroy(),
          });
        }, j * 50);
      }
    }
  }

  resetGame() {
    // Réinitialiser les données du jeu
    window.gameData.currentLevel = 0;
    window.gameData.unlockedLevels = 1;

    window.gameData.levels.forEach((level) => {
      level.completed = false;
      level.balanced = false;
      level.playerFeedback = "";
    });

    this.scene.start("MainMenuScene");
  }
}
