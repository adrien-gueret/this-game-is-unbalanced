function createButton(scene, label, x, y, onClick, styleOptions = {}) {
  const { color = "#3498db", size = "medium" } = styleOptions;

  // Créer un container pour le bouton
  const button = scene.add.container(x, y);

  // Créer le fond du bouton avec des bords arrondis
  const background = scene.add.graphics();
  background.fillStyle(parseInt(color.replace("#", "0x")), 1);

  // Déterminer la taille du texte et du padding en fonction de l'option size
  let fontSize = "24px";
  let padding = 20;
  let borderRadius = 10;

  switch (size) {
    case "small":
      fontSize = "18px";
      padding = 15;
      borderRadius = 8;
      break;
    case "big":
      fontSize = "32px";
      padding = 25;
      borderRadius = 12;
      break;
    case "medium":
    default:
      // Valeurs par défaut déjà définies
      break;
  }

  const buttonText = scene.add.text(0, 0, label, {
    fontFamily: "Arial",
    fontSize: fontSize,
    fill: "#ffffff",
  });
  buttonText.setOrigin(0.5);

  const width = buttonText.width + padding * 2;
  const height = buttonText.height + padding;

  // Dessiner le rectangle avec des bords arrondis
  background.fillRoundedRect(
    -width / 2,
    -height / 2,
    width,
    height,
    borderRadius
  );

  // Ajouter les éléments au container
  button.add(background);
  button.add(buttonText);

  // Rendre le bouton interactif
  button.setSize(width, height);
  button.setInteractive({ useHandCursor: true });

  // Ajouter les événements
  button.on("pointerover", () => {
    // Effet de surbrillance et légère augmentation
    scene.tweens.add({
      targets: button,
      scale: 1.05,
      duration: 150,
      ease: "Sine.Out",
    });

    // Créer un effet de contour lumineux avec anti-aliasing
    const glowColor = 0xffffff;
    background.clear();
    background.fillStyle(parseInt(color.replace("#", "0x")), 1);
    background.fillRoundedRect(
      -width / 2,
      -height / 2,
      width,
      height,
      borderRadius
    );

    // Ajouter un contour avec anti-aliasing
    background.lineStyle(1.5, glowColor, 0.8, 1); // Ajout du paramètre 1 pour l'anti-aliasing
    background.strokeRoundedRect(
      -width / 2,
      -height / 2,
      width,
      height,
      borderRadius
    );

    // Éclaircir légèrement le texte
    buttonText.setTint(0xffffff);
  });

  button.on("pointerout", () => {
    // Retour à la normale
    scene.tweens.add({
      targets: button,
      scale: 1,
      duration: 150,
      ease: "Sine.In",
    });

    // Effacer le contour en redessinnant le bouton
    background.clear();
    background.fillStyle(parseInt(color.replace("#", "0x")), 1);
    background.fillRoundedRect(
      -width / 2,
      -height / 2,
      width,
      height,
      borderRadius
    );

    // Remettre la couleur du texte
    buttonText.clearTint();
  });

  button.on("pointerdown", () => {
    scene.sound.play("click");
    onClick();
  });

  return button;
}

function createToggleSoundButton(
  scene,
  { fadeInDelay = 0, y = 40, deltaX = 0 } = {}
) {
  // Position en haut à droite
  const x = scene.cameras.main.width - 40 - deltaX;

  // Créer un container pour le bouton
  const button = scene.add.container(x, y);

  // Créer l'icône du son en utilisant la spritesheet
  const soundIconFrame = scene.sound.mute ? 3 : 2; // Index 2 pour son actif, 3 pour son coupé
  const soundIcon = scene.add.sprite(0, 0, "ui", soundIconFrame);
  soundIcon.setOrigin(0.5);

  // Ajouter l'icône au container
  button.add(soundIcon);

  // Rendre le bouton interactif
  button.setSize(soundIcon.width, soundIcon.height);
  button.setInteractive({ useHandCursor: true });

  // Ajouter les événements
  button.on("pointerover", () => {
    // Effet de surbrillance et légère augmentation
    scene.tweens.add({
      targets: button,
      scale: 1.2,
      duration: 150,
      ease: "Sine.Out",
    });

    // Ajouter un léger effet de luminosité au survol
    soundIcon.setTint(0xffffff);
  });

  button.on("pointerout", () => {
    // Retour à la normale
    scene.tweens.add({
      targets: button,
      scale: 1,
      duration: 150,
      ease: "Sine.In",
    });

    // Rétablir la couleur normale
    soundIcon.clearTint();
  });

  button.on("pointerdown", () => {
    scene.sound.play("click");

    // Toggle l'état du son (inversé de l'état actuel)
    const newMuteState = !scene.sound.mute;

    // Mettre à jour l'état du son
    scene.sound.setMute(newMuteState);

    // Mettre à jour l'icône du son
    soundIcon.setFrame(newMuteState ? 3 : 2);
  });

  if (fadeInDelay > 0) {
    button.setAlpha(0);

    scene.tweens.add({
      targets: button,
      alpha: 1,
      duration: 500,
      ease: "Cubic.easeIn",
      delay: fadeInDelay,
    });
  }

  // Mettre le bouton en haut de la pile d'affichage
  button.setDepth(100);

  return button;
}
