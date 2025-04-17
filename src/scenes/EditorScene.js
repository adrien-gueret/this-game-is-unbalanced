/**
 * EditorScene - Scène d'édition des paramètres du niveau
 *
 * Cette scène permet au joueur de modifier les paramètres du niveau
 * pour satisfaire le joueur fictif
 */
class EditorScene extends Phaser.Scene {
  constructor() {
    super({ key: "EditorScene" });
    this.sliders = [];
    this.sliderValues = {};
  }

  create() {
    const { width, height } = this.cameras.main;

    // Récupération des données du niveau actuel
    this.currentLevelIndex = window.gameData.currentLevel;
    this.levelData = window.gameData.levels[this.currentLevelIndex];

    // Copier les paramètres originaux (pour pouvoir les réinitialiser)
    this.originalSettings = JSON.parse(JSON.stringify(this.levelData.settings));
    this.currentSettings = JSON.parse(JSON.stringify(this.levelData.settings));

    // Fond
    this.add.rectangle(0, 0, width, height, 0x34495e).setOrigin(0);

    // Bandeau supérieur
    const headerBar = this.add
      .rectangle(0, 0, width, 60, 0x2c3e50, 0.95)
      .setOrigin(0);

    this.add
      .text(width / 2, 30, `ÉDITEUR DE NIVEAU - ${this.levelData.title}`, {
        fontSize: "24px",
        fontFamily: "Arial",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Type de niveau (icône)
    let typeIcon;
    switch (this.levelData.type) {
      case "platform":
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

    // Zone d'aperçu et de description
    this.createPreviewPanel();

    // Zone d'édition des paramètres
    this.createParameterPanel();

    // Boutons d'action
    this.createButtons();

    // Animation d'entrée
    this.cameras.main.fadeIn(500);
  }

  createPreviewPanel() {
    const { width, height } = this.cameras.main;
    const panelWidth = width * 0.3;
    const panelHeight = height - 100;
    const panelX = 20;
    const panelY = 80;

    // Panneau de prévisualisation
    this.add
      .rectangle(panelX, panelY, panelWidth, panelHeight, 0x2c3e50)
      .setOrigin(0)
      .setStrokeStyle(2, 0xffffff);

    // Titre du panneau
    this.add
      .text(panelX + panelWidth / 2, panelY + 20, "APERÇU", {
        fontSize: "20px",
        fontFamily: "Arial",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Visualisation selon le type de niveau
    const visualX = panelX + panelWidth / 2;
    const visualY = panelY + 100;
    const visualSize = panelWidth - 40;

    switch (this.levelData.type) {
      case "platform":
        this.createPlatformPreview(visualX, visualY, visualSize);
        break;
      case "racing":
        this.createRacingPreview(visualX, visualY, visualSize);
        break;
      case "boss":
        this.createBossPreview(visualX, visualY, visualSize);
        break;
    }

    // Description du niveau et feedback du joueur
    const feedbackY = panelY + panelHeight - 180;

    this.add
      .text(panelX + panelWidth / 2, feedbackY, "FEEDBACK JOUEUR", {
        fontSize: "16px",
        fontFamily: "Arial",
        color: "#f1c40f",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add.text(panelX + 15, feedbackY + 30, this.levelData.playerFeedback, {
      fontSize: "14px",
      fontFamily: "Arial",
      color: "#ffffff",
      wordWrap: { width: panelWidth - 30 },
    });
  }

  createPlatformPreview(x, y, size) {
    // Mini aperçu du niveau de plateforme
    const settings = this.levelData.settings;
    const obstacleCount = settings.obstacleCount;
    const platformCount = settings.platformCount;

    // Fond de l'aperçu
    this.add
      .rectangle(x, y, size, size * 0.6, 0x000000, 0.3)
      .setStrokeStyle(1, 0xffffff);

    // Sol
    this.add.rectangle(x, y + size * 0.3, size, 10, 0x3498db);

    // Plateformes
    for (let i = 0; i < platformCount; i++) {
      const platformX = x - size / 2 + (size / (platformCount + 1)) * (i + 1);
      const platformY = y + size * 0.15 - i * 10;
      this.add.rectangle(platformX, platformY, 40, 10, 0x3498db);
    }

    // Obstacles
    for (let i = 0; i < obstacleCount; i++) {
      const obstacleX =
        x - size / 3 + ((size / 2) * (i + 1)) / (obstacleCount + 1);
      const obstacleY = y + size * 0.25;
      this.add.rectangle(obstacleX, obstacleY, 15, 20, 0xe74c3c);
    }

    // Drapeau d'arrivée
    this.add.rectangle(
      x + size / 2 - 20,
      y + size * 0.25 - 10,
      5,
      30,
      0xf1c40f
    );

    // Icône du joueur
    this.add.circle(x - size / 2 + 20, y + size * 0.25 - 10, 10, 0xffffff);

    // Indicateurs de paramètres
    this.add
      .text(x, y - size * 0.25, `Vitesse: ${settings.playerSpeed}`, {
        fontSize: "14px",
        fontFamily: "Arial",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.add
      .text(x, y - size * 0.2, `Saut: ${settings.jumpHeight}`, {
        fontSize: "14px",
        fontFamily: "Arial",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.add
      .text(x, y - size * 0.15, `Temps: ${settings.timeLimit}s`, {
        fontSize: "14px",
        fontFamily: "Arial",
        color: "#ffffff",
      })
      .setOrigin(0.5);
  }

  createRacingPreview(x, y, size) {
    // Mini aperçu du niveau de course
    const settings = this.levelData.settings;
    const opponentCount = settings.opponentCount;

    // Piste
    this.add
      .rectangle(x, y, size, size * 0.4, 0x95a5a6)
      .setStrokeStyle(2, 0x7f8c8d);

    // Ligne de départ
    this.add.rectangle(x - size / 2 + 20, y, 5, size * 0.4, 0xffffff);

    // Ligne d'arrivée
    this.add.rectangle(x + size / 2 - 20, y, 5, size * 0.4, 0xf1c40f);

    // Voiture du joueur
    this.add.rectangle(x - size / 3, y - size * 0.1, 20, 10, 0xe74c3c);

    // Adversaires
    for (let i = 0; i < opponentCount; i++) {
      const opponentY = y + (i + 1) * 15 - size * 0.15;
      this.add.rectangle(
        x - size / 3 + 30 + i * 10,
        opponentY,
        20,
        10,
        0x3498db
      );
    }

    // Boosts
    for (let i = 0; i < settings.boostCount; i++) {
      const boostX =
        x - size / 4 + ((size / 2) * (i + 1)) / (settings.boostCount + 1);
      const boostY = y - size * 0.1;
      this.add.star(boostX, boostY, 5, 3, 8, 0xf1c40f);
    }

    // Indicateurs de paramètres
    this.add
      .text(x, y - size * 0.25, `Vitesse joueur: ${settings.carSpeed}`, {
        fontSize: "14px",
        fontFamily: "Arial",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.add
      .text(
        x,
        y - size * 0.2,
        `Vitesse adversaires: ${settings.opponentSpeed}`,
        {
          fontSize: "14px",
          fontFamily: "Arial",
          color: "#ffffff",
        }
      )
      .setOrigin(0.5);
  }

  createBossPreview(x, y, size) {
    // Mini aperçu du niveau de boss
    const settings = this.levelData.settings;

    // Arène
    this.add
      .circle(x, y, size * 0.25, 0x000000, 0.3)
      .setStrokeStyle(2, 0xffffff);

    // Boss
    this.add.rectangle(x, y - 30, 50, 50, 0xe74c3c).setStrokeStyle(2, 0xc0392b);

    // Joueur
    this.add.circle(x, y + 50, 10, 0x3498db).setStrokeStyle(1, 0x2980b9);

    // Barres de vie
    // - Boss
    this.add.text(x - 70, y - 70, "Boss", {
      fontSize: "14px",
      fontFamily: "Arial",
      color: "#e74c3c",
    });

    this.add
      .rectangle(x, y - 70, 140, 10, 0x000000)
      .setStrokeStyle(1, 0xffffff);

    this.add.rectangle(x - 70, y - 70, 140, 10, 0xe74c3c).setOrigin(0, 0.5);

    // - Joueur
    this.add.text(x - 70, y + 70, "Joueur", {
      fontSize: "14px",
      fontFamily: "Arial",
      color: "#3498db",
    });

    this.add
      .rectangle(x, y + 70, 140, 10, 0x000000)
      .setStrokeStyle(1, 0xffffff);

    this.add.rectangle(x - 70, y + 70, 140, 10, 0x3498db).setOrigin(0, 0.5);

    // Objets de soin
    for (let i = 0; i < settings.healingItems; i++) {
      const itemX = x - 50 + i * 30;
      const itemY = y;
      this.add.circle(itemX, itemY, 8, 0x2ecc71).setStrokeStyle(1, 0x27ae60);
    }

    // Indicateurs de paramètres
    this.add
      .text(x, y - size * 0.3, `PV Boss: ${settings.bossHealth}`, {
        fontSize: "14px",
        fontFamily: "Arial",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.add
      .text(x, y - size * 0.25, `PV Joueur: ${settings.playerHealth}`, {
        fontSize: "14px",
        fontFamily: "Arial",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.add
      .text(x, y - size * 0.2, `Attaque: ${settings.playerDamage}`, {
        fontSize: "14px",
        fontFamily: "Arial",
        color: "#ffffff",
      })
      .setOrigin(0.5);
  }

  createParameterPanel() {
    const { width, height } = this.cameras.main;
    const panelWidth = width - 20 - (width * 0.3 + 40);
    const panelHeight = height - 100;
    const panelX = width * 0.3 + 40;
    const panelY = 80;

    // Panneau des paramètres
    const paramPanel = this.add
      .rectangle(panelX, panelY, panelWidth, panelHeight, 0x2c3e50)
      .setOrigin(0)
      .setStrokeStyle(2, 0xffffff);

    // Titre du panneau
    this.add
      .text(panelX + panelWidth / 2, panelY + 20, "PARAMÈTRES DU NIVEAU", {
        fontSize: "20px",
        fontFamily: "Arial",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Créer les contrôles selon le type de niveau
    switch (this.levelData.type) {
      case "platform":
        this.createPlatformControls(panelX, panelY + 60, panelWidth);
        break;
      case "racing":
        this.createRacingControls(panelX, panelY + 60, panelWidth);
        break;
      case "boss":
        this.createBossControls(panelX, panelY + 60, panelWidth);
        break;
    }
  }

  createPlatformControls(x, y, width) {
    const settings = this.currentSettings;
    const controlWidth = width - 40;
    let yPos = y;

    // Vitesse du joueur
    this.createSlider(
      x + 20,
      yPos,
      controlWidth,
      "Vitesse du joueur",
      "playerSpeed",
      100,
      300,
      settings.playerSpeed
    );
    yPos += 80;

    // Hauteur de saut
    this.createSlider(
      x + 20,
      yPos,
      controlWidth,
      "Hauteur de saut",
      "jumpHeight",
      250,
      450,
      settings.jumpHeight
    );
    yPos += 80;

    // Nombre d'obstacles
    this.createSlider(
      x + 20,
      yPos,
      controlWidth,
      "Nombre d'obstacles",
      "obstacleCount",
      0,
      6,
      settings.obstacleCount,
      true
    );
    yPos += 80;

    // Nombre de plateformes
    this.createSlider(
      x + 20,
      yPos,
      controlWidth,
      "Nombre de plateformes",
      "platformCount",
      2,
      8,
      settings.platformCount,
      true
    );
    yPos += 80;

    // Limite de temps
    this.createSlider(
      x + 20,
      yPos,
      controlWidth,
      "Limite de temps (s)",
      "timeLimit",
      15,
      60,
      settings.timeLimit,
      true
    );
  }

  createRacingControls(x, y, width) {
    const settings = this.currentSettings;
    const controlWidth = width - 40;
    let yPos = y;

    // Vitesse de la voiture
    this.createSlider(
      x + 20,
      yPos,
      controlWidth,
      "Vitesse de votre voiture",
      "carSpeed",
      150,
      300,
      settings.carSpeed
    );
    yPos += 80;

    // Longueur du circuit
    this.createSlider(
      x + 20,
      yPos,
      controlWidth,
      "Longueur du circuit",
      "trackLength",
      3000,
      8000,
      settings.trackLength,
      false,
      1000
    );
    yPos += 80;

    // Nombre d'adversaires
    this.createSlider(
      x + 20,
      yPos,
      controlWidth,
      "Nombre d'adversaires",
      "opponentCount",
      1,
      5,
      settings.opponentCount,
      true
    );
    yPos += 80;

    // Vitesse des adversaires
    this.createSlider(
      x + 20,
      yPos,
      controlWidth,
      "Vitesse des adversaires",
      "opponentSpeed",
      150,
      250,
      settings.opponentSpeed
    );
    yPos += 80;

    // Nombre de boosts
    this.createSlider(
      x + 20,
      yPos,
      controlWidth,
      "Nombre de boosts",
      "boostCount",
      0,
      5,
      settings.boostCount,
      true
    );
  }

  createBossControls(x, y, width) {
    const settings = this.currentSettings;
    const controlWidth = width - 40;
    let yPos = y;

    // Points de vie du joueur
    this.createSlider(
      x + 20,
      yPos,
      controlWidth,
      "Points de vie du joueur",
      "playerHealth",
      50,
      200,
      settings.playerHealth,
      true
    );
    yPos += 80;

    // Points de vie du boss
    this.createSlider(
      x + 20,
      yPos,
      controlWidth,
      "Points de vie du boss",
      "bossHealth",
      300,
      800,
      settings.bossHealth,
      true,
      50
    );
    yPos += 80;

    // Dégâts du joueur
    this.createSlider(
      x + 20,
      yPos,
      controlWidth,
      "Dégâts du joueur",
      "playerDamage",
      30,
      80,
      settings.playerDamage,
      true,
      5
    );
    yPos += 80;

    // Dégâts du boss
    this.createSlider(
      x + 20,
      yPos,
      controlWidth,
      "Dégâts du boss",
      "bossDamage",
      10,
      40,
      settings.bossDamage,
      true,
      5
    );
    yPos += 80;

    // Objets de soin
    this.createSlider(
      x + 20,
      yPos,
      controlWidth,
      "Objets de soin",
      "healingItems",
      0,
      5,
      settings.healingItems,
      true
    );
  }

  createSlider(
    x,
    y,
    width,
    label,
    key,
    min,
    max,
    defaultValue,
    isInteger = false,
    step = 1
  ) {
    // Groupe pour ce slider
    const sliderGroup = this.add.group();

    // Label
    const labelText = this.add.text(x, y, label, {
      fontSize: "18px",
      fontFamily: "Arial",
      color: "#ffffff",
    });
    sliderGroup.add(labelText);

    // Fond du slider
    const sliderTrack = this.add
      .rectangle(x, y + 30, width, 8, 0x95a5a6)
      .setOrigin(0, 0.5);
    sliderGroup.add(sliderTrack);

    // Bouton du slider
    const range = max - min;
    const initialPos = (defaultValue - min) / range;
    const sliderButton = this.add
      .circle(x + initialPos * width, y + 30, 15, 0x3498db)
      .setStrokeStyle(2, 0x2980b9)
      .setInteractive({ draggable: true });
    sliderGroup.add(sliderButton);

    // Valeur actuelle
    const valueText = this.add
      .text(x + width + 15, y + 30, `${defaultValue}`, {
        fontSize: "16px",
        fontFamily: "Arial",
        color: "#ffffff",
      })
      .setOrigin(0, 0.5);
    sliderGroup.add(valueText);

    // Stocker la valeur initiale
    this.sliderValues[key] = defaultValue;

    // Gestion du glissement
    sliderButton.on("drag", (pointer, dragX) => {
      // Limiter la position au slider
      const boundedX = Phaser.Math.Clamp(dragX, x, x + width);
      sliderButton.x = boundedX;

      // Calculer la valeur
      const progress = (boundedX - x) / width;
      let value = min + progress * range;

      // Arrondir si nécessaire
      if (isInteger) {
        value = Math.round(value / step) * step;
      } else {
        value = Math.round(value * 10) / 10;
      }

      // Mettre à jour l'affichage
      valueText.setText(`${value}`);

      // Stocker la nouvelle valeur
      this.sliderValues[key] = value;
      this.currentSettings[key] = value;
    });

    // Ajouter à la liste des sliders pour les références futures
    this.sliders.push({
      group: sliderGroup,
      button: sliderButton,
      key: key,
      min: min,
      max: max,
      track: sliderTrack,
      value: valueText,
      isInteger: isInteger,
      step: step,
    });
  }

  createButtons() {
    const { width, height } = this.cameras.main;

    // Bouton de réinitialisation
    const resetButton = this.add
      .text(width / 2 - 150, height - 50, "RÉINITIALISER", {
        fontSize: "20px",
        fontFamily: "Arial",
        color: "#ffffff",
        backgroundColor: "#e67e22",
        padding: { x: 15, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    resetButton
      .on("pointerover", () => resetButton.setScale(1.05))
      .on("pointerout", () => resetButton.setScale(1))
      .on("pointerdown", () => this.resetSettings());

    // Bouton de test
    const testButton = this.add
      .text(width / 2, height - 50, "TESTER", {
        fontSize: "20px",
        fontFamily: "Arial",
        color: "#ffffff",
        backgroundColor: "#2ecc71",
        padding: { x: 15, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    testButton.on("pointerover", () => testButton.setScale(1.05));
    testButton.on("pointerout", () => testButton.setScale(1));
    testButton.on("pointerdown", () => this.testLevel());

    // Bouton d'annulation
    const cancelButton = this.add
      .text(width / 2 + 150, height - 50, "ANNULER", {
        fontSize: "20px",
        fontFamily: "Arial",
        color: "#ffffff",
        backgroundColor: "#e74c3c",
        padding: { x: 15, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    cancelButton.on("pointerover", () => cancelButton.setScale(1.05));
    cancelButton.on("pointerout", () => cancelButton.setScale(1));
    cancelButton.on("pointerdown", () => this.scene.start("FeedbackScene"));
  }

  resetSettings() {
    // Réinitialiser tous les paramètres à leurs valeurs d'origine
    this.currentSettings = JSON.parse(JSON.stringify(this.originalSettings));

    // Mettre à jour les sliders
    this.sliders.forEach((slider) => {
      const key = slider.key;
      const value = this.currentSettings[key];

      // Calculer la nouvelle position
      const pos = (value - slider.min) / (slider.max - slider.min);
      const x = slider.track.x + pos * slider.track.width;

      // Mettre à jour le bouton du slider
      slider.button.x = x;

      // Mettre à jour le texte de la valeur
      slider.value.setText(`${value}`);

      // Mettre à jour la valeur stockée
      this.sliderValues[key] = value;
    });

    // Effet visuel de réinitialisation
    // this.cameras.main.flash(300, 255, 255, 255);
  }

  testLevel() {
    // Appliquer les modifications aux données du niveau
    this.levelData.settings = JSON.parse(JSON.stringify(this.currentSettings));

    // Réinitialiser le statut de complétion et d'équilibre
    this.levelData.completed = false;
    this.levelData.balanced = false;
    this.levelData.playerFeedback = "";

    // Animation de transition
    this.cameras.main.fade(500, 0, 0, 0);
    this.time.delayedCall(500, () => {
      this.scene.start("GameScene");
    });
  }
}
