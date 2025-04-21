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

  init({ level }) {
    this.level = level;
  }

  create() {
    const { width, height } = this.cameras.main;

    // Copier les paramètres originaux (pour pouvoir les réinitialiser)
    this.originalSettings = JSON.parse(JSON.stringify(this.level.settings));
    this.currentSettings = JSON.parse(JSON.stringify(this.level.settings));

    // Background
    this.add
      .image(width / 2, height / 2, "background-blue")
      .setDisplaySize(width, height);

    // Bandeau supérieur
    this.add.rectangle(0, 0, width, 60, 0x2c3e50, 0.95).setOrigin(0);

    this.add
      .text(
        width / 2,
        30,
        window.i18n.get("editorTitle")(this.level.getTitle()),
        {
          fontSize: "24px",
          fontFamily: "Arial",
          color: "#ffffff",
          fontStyle: "bold",
        }
      )
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

    // Zone d'édition des paramètres
    this.createParametersPanel();

    // Boutons d'action
    this.createButtons();

    // Animation d'entrée
    this.cameras.main.fadeIn(500);

    this.events.on("shutdown", this.destroy, this);
  }

  createParametersPanel() {
    const { width } = this.cameras.main;
    let startY = 100;
    const sliderBarWidth = 300;
    let index = 0;

    // Zone centrale pour aligner tous les widgets
    const centerX = width / 2;
    // Largeur réservée pour le label
    const labelWidth = 220;
    // Décalage horizontal entre label et slider
    const gap = 24;

    for (const [key, setting] of Object.entries(this.currentSettings)) {
      if (!setting.label) {
        continue;
      }
      const y = startY + index * 60;

      // Position du label (aligné à droite)
      const labelX = centerX - sliderBarWidth / 2 - gap;
      this.add
        .text(labelX, y + 7, window.i18n.get(setting.label), {
          fontSize: "22px",
          color: "#ffffff",
          wordWrap: { width: labelWidth, useAdvancedWrap: true },
          align: "right",
          fontFamily: "Arial",
          stroke: "#000000",
          strokeThickness: 2,
        })
        .setOrigin(1, 0.5);

      // Slider stylé
      const barX = centerX - sliderBarWidth / 2;
      const barY = y;
      const barGraphics = this.add.graphics();

      // Barre d'arrière-plan (ombre)
      barGraphics.fillStyle(0x1abc9c, 0.25);
      barGraphics.fillRoundedRect(barX, barY + 2, sliderBarWidth, 14, 7);

      // Barre de fond (inactive)
      barGraphics.fillStyle(0x2980b9, 0.7);
      barGraphics.fillRoundedRect(barX, barY, sliderBarWidth, 14, 7);

      // Barre de progression (active)
      const ratio = (setting.value - setting.min) / (setting.max - setting.min);
      barGraphics.fillStyle(0x00e6d8, 1);
      barGraphics.fillRoundedRect(barX, barY, sliderBarWidth * ratio, 14, 7);

      barGraphics.setInteractive(
        new Phaser.Geom.Rectangle(barX, barY, sliderBarWidth, 14),
        Phaser.Geom.Rectangle.Contains
      );

      // Knob stylé
      const knobX = barX + ratio * sliderBarWidth;
      const knob = this.add
        .circle(knobX, barY + 7, 13, 0x00e6d8)
        .setStrokeStyle(4, 0xffffff, 1)
        .setInteractive({ draggable: true });

      // Effet de survol sur le knob
      knob.on("pointerover", () => knob.setScale(1.15));
      knob.on("pointerout", () => knob.setScale(1));

      // Valeur à droite du slider
      const valueText = this.add
        .text(barX + sliderBarWidth + gap, barY + 7, setting.value.toString(), {
          fontSize: "22px",
          color: "#ffffff",
          fontFamily: "Arial",
          stroke: "#000000",
          strokeThickness: 2,
        })
        .setOrigin(0, 0.5);

      // Fonction utilitaire pour redessiner la barre de progression
      const updateBar = (value) => {
        const newRatio = (value - setting.min) / (setting.max - setting.min);
        barGraphics.clear();
        // Ombre
        barGraphics.fillStyle(0x1abc9c, 0.25);
        barGraphics.fillRoundedRect(barX, barY + 2, sliderBarWidth, 14, 7);
        // Fond
        barGraphics.fillStyle(0x2980b9, 0.7);
        barGraphics.fillRoundedRect(barX, barY, sliderBarWidth, 14, 7);
        // Progression
        barGraphics.fillStyle(0x00e6d8, 1);
        barGraphics.fillRoundedRect(
          barX,
          barY,
          sliderBarWidth * newRatio,
          14,
          7
        );
      };

      // Clic sur la barre
      barGraphics.on("pointerdown", (pointer) => {
        const clickX = Phaser.Math.Clamp(
          pointer.x,
          barX,
          barX + sliderBarWidth
        );
        const newRatio = (clickX - barX) / sliderBarWidth;
        let newValue = setting.min + newRatio * (setting.max - setting.min);
        newValue = Phaser.Math.Snap.To(newValue, setting.step);
        const snappedX =
          barX +
          ((newValue - setting.min) / (setting.max - setting.min)) *
            sliderBarWidth;
        knob.x = snappedX; // Aligner le knob
        this.sliderValues[key] = newValue;
        this.currentSettings[key].value = newValue;
        valueText.setText(newValue.toString());
        updateBar(newValue);
      });

      // Drag du knob
      knob.on("drag", (pointer, dragX) => {
        const clampedX = Phaser.Math.Clamp(dragX, barX, barX + sliderBarWidth);
        const newRatio = (clampedX - barX) / sliderBarWidth;
        let newValue = setting.min + newRatio * (setting.max - setting.min);
        newValue = Phaser.Math.Snap.To(newValue, setting.step);
        const snappedX =
          barX +
          ((newValue - setting.min) / (setting.max - setting.min)) *
            sliderBarWidth;
        knob.x = snappedX; // Aligner le knob
        this.sliderValues[key] = newValue;
        this.currentSettings[key].value = newValue;
        valueText.setText(newValue.toString());
        updateBar(newValue);
      });

      this.sliders.push({
        key,
        knob,
        barX,
        sliderBarWidth,
        valueText,
        updateBar,
        barGraphics,
      });
      index++;
    }
  }

  createButtons() {
    const { width, height } = this.cameras.main;

    // Bouton de test
    createButton(
      this,
      window.i18n.get("editorPlayButton"),
      width / 2,
      height - 50,
      () => {
        this.testLevel();
      },
      { color: "#2ecc71", size: "big" }
    );
  }

  testLevel() {
    // Appliquer les modifications aux données du niveau
    this.level.settings = JSON.parse(JSON.stringify(this.currentSettings));

    // Animation de transition
    this.cameras.main.fade(500, 0, 0, 0);
    this.time.delayedCall(500, () => {
      this.scene.start("GameScene", { level: this.level });
    });
  }

  destroy() {
    // Nettoyer tous les sliders et leurs objets associés
    if (this.sliders && this.sliders.length > 0) {
      this.sliders.forEach(({ knob, valueText, updateBar, barGraphics }) => {
        if (knob && knob.destroy) knob.destroy();
        if (valueText && valueText.destroy) valueText.destroy();
        if (barGraphics && barGraphics.destroy) barGraphics.destroy();
        // Ajoutez ici d'autres objets à détruire si besoin
      });
      this.sliders = [];
    }
    // Appeler le destroy parent si besoin
    if (super.destroy) super.destroy();
  }
}
