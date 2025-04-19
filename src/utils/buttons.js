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

    // Créer un effet de contour lumineux
    const glowColor = 0xffffff;
    background.lineStyle(2, glowColor, 0.8);
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

  button.on("pointerdown", onClick);

  return button;
}
