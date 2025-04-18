/**
 * GameScene - Scène de simulation du jeu
 *
 * Cette scène simule un joueur fictif jouant au niveau actuellement sélectionné.
 * Selon les paramètres du niveau, le joueur fictif va réussir ou échouer.
 */

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  init({ level }) {
    this.level = level;
  }

  create() {
    const { width, height } = this.cameras.main;

    // Variables pour la simulation
    this.simulationComplete = false;
    this.simulationTime = 0;
    this.simulationSpeed = 1; // Vitesse normale par défaut
    this.simulation = null; // Stockera l'objet de simulation actif

    // Background approprié selon le type de niveau
    let backgroundImage;
    switch (this.level.type) {
      case "platforms":
        backgroundImage = "background-green";
        break;
      case "racing":
        backgroundImage = "background-blue";
        break;
      case "boss":
        backgroundImage = "background-red";
        break;
      default:
        break;
    }

    // Affichage du background
    this.add
      .image(width / 2, height / 2, backgroundImage)
      .setDisplaySize(width, height);

    // Interface supérieure - Type de niveau et titre
    this.add.rectangle(0, 0, width, 60, 0x000000, 0.7).setOrigin(0);

    this.add
      .text(width / 2, 30, this.level.getTitle(), {
        fontSize: "24px",
        fontFamily: "Arial",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Type de niveau (icône)
    let typeIcon;
    switch (this.level.type) {
      case "platforms":
        typeIcon = "🏃";
        break;
      case "racing":
        typeIcon = "🏎️";
        break;
      case "boss":
        typeIcon = "👾";
        break;
      default:
        typeIcon = "🎮";
    }

    this.add
      .text(20, 30, typeIcon, {
        fontSize: "30px",
      })
      .setOrigin(0, 0.5);

    // Boutons de contrôle de la simulation
    const speedButton = this.add
      .text(width - 20, 30, "⏩", {
        fontSize: "24px",
        color: "#ffffff",
        backgroundColor: "#2c3e50",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(1, 0.5)
      .setInteractive({ useHandCursor: true });

    speedButton.on("pointerdown", () => {
      this.simulationSpeed = this.simulationSpeed === 1 ? 3 : 1;
      speedButton.setText(this.simulationSpeed === 1 ? "⏩" : "⏩⏩⏩");
    });

    // Bouton de saut (permet de sauter la simulation)
    const skipButton = this.add
      .text(width - 100, 30, window.i18n.get("skipButton"), {
        fontSize: "18px",
        color: "#ffffff",
        backgroundColor: "#e67e22",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(1, 0.5)
      .setInteractive({ useHandCursor: true });

    skipButton.on("pointerdown", () => {
      // TODO: Not working yet
    });

    // Création du masque basé sur le rectangle de la zone de jeu
    const mask = this.make.graphics();
    mask.fillStyle(0xffffff);
    mask.fillRect(
      width / 2 - (width - 60) / 2,
      height / 2 + 30 - (height - 100) / 2,
      width - 60,
      height - 100
    );

    // Création du masque géométrique que nous pourrons appliquer individuellement
    this.gameMask = mask.createGeometryMask();

    // Zone de jeu principale
    this.add
      .rectangle(
        width / 2,
        height / 2 + 30,
        width - 60,
        height - 100,
        0x000000,
        0.2
      )
      .setStrokeStyle(2, 0xffffff);

    // Ajout d'une image de fond pour la zone de jeu
    const gameZoneBackground = this.add
      .image(
        width / 2,
        height / 2 + 30,
        "background-platforms" // Remplacez par le nom de votre asset
      )
      .setDisplaySize(width - 60, height - 100);

    // Appliquer le masque à l'image de fond
    this.applyGameMask(gameZoneBackground);

    // Créer la visualisation selon le type de niveau
    this.createSimulation();

    // Démarrer la simulation
    this.startSimulation();
  }

  // Méthode d'aide pour appliquer le masque à un élément de jeu
  applyGameMask(gameObject) {
    if (gameObject && this.gameMask) {
      gameObject.setMask(this.gameMask);
    }
    return gameObject;
  }

  createSimulation() {
    switch (this.level.type) {
      case "platforms":
        this.simulation = new PlatformSimulation(this);
        break;
      case "racing":
        this.simulation = new RacingSimulation(this);
        break;
      case "boss":
        this.simulation = new BossSimulation(this);
        break;
      default:
        throw new Error(`Cannot simulate: ${this.level.type}`);
    }
  }

  startSimulation() {
    this.events.once("simulationComplete", (data) => {
      console.log(`Simulation terminée avec résultat:`, data);

      this.scene.start("FeedbackScene", {
        level: this.level,
        isBalanced: data.isBalanced,
        feedback: data.feedback,
      });
    });

    this.simulation.startLevel(this.level);
  }
}
