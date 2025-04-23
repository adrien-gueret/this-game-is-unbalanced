/**
 * BootScene - Scene de chargement des ressources
 *
 * Cette scène charge tous les assets nécessaires au jeu et affiche
 * une barre de progression pendant le chargement.
 */
class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  preload() {
    // Créer une barre de progression de chargement
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const loadingText = this.add.text(
      width / 2,
      height / 2 - 50,
      window.i18n.get("loading"),
      {
        font: "20px Arial",
        fill: "#ffffff",
      }
    );
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.add.text(width / 2, height / 2 + 25, "0%", {
      font: "18px Arial",
      fill: "#ffffff",
    });
    percentText.setOrigin(0.5, 0.5);

    // Mise à jour de la barre de progression
    this.load.on("progress", function (value) {
      percentText.setText(parseInt(value * 100) + "%");
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    // Nettoyer quand le chargement est terminé
    this.load.on("complete", () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });

    // Chargement des assets du jeu
    this.load.image(
      "background-yellow",
      "./assets/images/background-yellow.png"
    );
    this.load.image("background-green", "./assets/images/background-green.png");
    this.load.image("background-grey", "./assets/images/background-grey.png");
    this.load.image("background-blue", "./assets/images/background-blue.png");
    this.load.image("background-red", "./assets/images/background-red.png");
    this.load.image(
      "background-platforms",
      "./assets/images/platforms/background-weird.png"
    );

    this.load.spritesheet(
      "tiles-platforms",
      "./assets/images/platforms/tiles.png",
      { frameWidth: 32, frameHeight: 32, spacing: 2 }
    );
    this.load.spritesheet(
      "player-platforms",
      "./assets/images/platforms/monster.png",
      { frameWidth: 32, frameHeight: 32 }
    );

    this.load.image("background-boss", "./assets/images/boss/background.png");
    this.load.spritesheet("slime-boss", "./assets/images/boss/slime.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("player-boss", "./assets/images/boss/monster.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("potions-boss", "./assets/images/boss/potions.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet(
      "player-match3",
      "./assets/images/match3/monster.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
    this.load.spritesheet("tiles-match3", "./assets/images/match3/tiles.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("confettis", "./assets/images/confettis.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.audio("music_title", [
      "./assets/audio/music_title.ogg",
      "./assets/audio/music_title.mp3",
    ]);

    this.load.audio("music_platforms", [
      "./assets/audio/music_platforms.ogg",
      "./assets/audio/music_paltforms.mp3",
    ]);

    this.load.audio("music_boss", [
      "./assets/audio/music_boss.ogg",
      "./assets/audio/music_boss.mp3",
    ]);

    this.load.audio("music_match3", [
      "./assets/audio/music_match3.ogg",
      "./assets/audio/music_match3.mp3",
    ]);

    this.load.audio("surprised", [
      "./assets/audio/surprised.ogg",
      "./assets/audio/surprised.mp3",
    ]);

    this.load.audio("click", [
      "./assets/audio/click.ogg",
      "./assets/audio/click.mp3",
    ]);

    this.load.audio("jump", [
      "./assets/audio/jump.wav",
      "./assets/audio/jump.ogg",
    ]);

    this.load.audio("hurt", [
      "./assets/audio/hurt.wav",
      "./assets/audio/hurt.ogg",
    ]);

    this.load.audio("heal", [
      "./assets/audio/heal.wav",
      "./assets/audio/heal.ogg",
    ]);

    this.load.audio("tile-slide", [
      "./assets/audio/tile-slide.wav",
      "./assets/audio/tile-slide.ogg",
    ]);

    this.load.audio("popout", [
      "./assets/audio/popout.wav",
      "./assets/audio/popout.ogg",
    ]);

    this.load.audio("feedback-victory", [
      "./assets/audio/feedback-victory.mp3",
      "./assets/audio/feedback-victory.ogg",
    ]);

    this.load.audio("game-defeat", [
      "./assets/audio/game-defeat.mp3",
      "./assets/audio/game-defeat.ogg",
    ]);
  }

  create() {
    this.scene.start("MainMenuScene");
  }
}
