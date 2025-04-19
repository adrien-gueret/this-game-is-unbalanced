function showMessage(
  scene,
  message,
  messageColor,
  onNext,
  nextLabel = window.i18n.get("clickToContinue")
) {
  const { width, height } = scene.cameras.main;

  // Position fixe pour l'arrière-plan et le texte
  const textY = height / 2;
  const bgY = textY - 30;
  const padding = 20;
  const textHeight = 60;
  const gameWidth = width - 60;

  // Style commun pour tous les messages
  const messageStyle = {
    fontSize: "36px",
    fontFamily: "Arial",
    color: messageColor,
    stroke: "#000000",
    strokeThickness: 5,
    align: "center",
  };

  // Créer d'abord l'arrière-plan avec une profondeur inférieure
  const backgroundText = scene.add.graphics();
  backgroundText.setDepth(1000);
  backgroundText.fillStyle(0x000000, 0.7); // Noir avec 70% d'opacité
  backgroundText.fillRoundedRect(
    30, // Position x du bord gauche du container
    bgY - padding,
    gameWidth, // Largeur totale du container
    textHeight + padding * 2,
    0 // Coins arrondis
  );

  // Ensuite créer le texte au-dessus
  const messageText = scene.add
    .text(width / 2, textY, message, messageStyle)
    .setOrigin(0.5)
    .setDepth(1001); // Un niveau au-dessus du background

  // Les deux éléments commencent invisibles
  backgroundText.setAlpha(0);
  messageText.setAlpha(0);

  // Animation d'apparition sans déplacement vertical (pour éviter tout décalage)
  scene.tweens.add({
    targets: [backgroundText, messageText],
    alpha: 1,
    duration: 800,
    ease: "Power2",
  });

  // Changer le curseur en pointeur
  scene.input.setDefaultCursor("pointer");

  let continueText, backgroundContinueText;

  const next = () => {
    startTimer.remove();
    continueTimer.remove();
    scene.input.off("pointerdown", next);
    scene.input.setDefaultCursor("default");

    const targets = [messageText, backgroundText];

    if (continueText && backgroundContinueText) {
      targets.push(continueText, backgroundContinueText);
    }

    // Animer la disparition des textes
    scene.tweens.add({
      targets,
      alpha: 0,
      duration: 500,
      ease: "Power2",
      onComplete: () => {
        messageText.destroy();
        backgroundText.destroy();
        continueText?.destroy();
        backgroundContinueText?.destroy();
      },
    });

    onNext();
  };

  // Timer pour démarrer automatiquement
  const startTimer = scene.time.delayedCall(5000, next);
  // Ajouter l'écouteur de clic sur toute la scène
  scene.input.once("pointerdown", next);

  // Ajouter un message "Cliquez pour continuer" après un délai
  const continueTimer = scene.time.delayedCall(2500, () => {
    const continueStyle = {
      fontSize: "24px",
      fontFamily: "Arial",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 3,
    };

    // Créer l'arrière-plan pour le texte "Cliquez pour continuer"
    const continueY = textY + 80;
    const continueBgWidth = nextLabel.length * 13; // Estimation de la largeur basée sur le texte
    const continueBgHeight = 40;

    backgroundContinueText = scene.add.graphics();
    backgroundContinueText.setDepth(1000);
    backgroundContinueText.fillStyle(0x000000, 0.7);
    backgroundContinueText.fillRoundedRect(
      width / 2 - continueBgWidth / 2,
      continueY - continueBgHeight / 2,
      continueBgWidth,
      continueBgHeight,
      8 // Coins arrondis un peu plus petits
    );
    backgroundContinueText.setAlpha(0);

    // Ajouter le texte par-dessus
    continueText = scene.add
      .text(width / 2, continueY, nextLabel, continueStyle)
      .setOrigin(0.5)
      .setDepth(1001)
      .setAlpha(0);

    // Animation pour faire apparaître le fond et le texte
    scene.tweens.add({
      targets: [backgroundContinueText, continueText],
      alpha: 1,
      duration: 500,
    });
  });
}
