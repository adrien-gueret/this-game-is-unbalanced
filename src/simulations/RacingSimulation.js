// TODO: https://phaser.io/examples/v3.85.0/physics/arcade/view/racecar
/**
 * RacingSimulation - Simulation d'un niveau de course
 *
 * Cette classe gère la visualisation et la simulation des niveaux de type course.
 */
class RacingSimulation {
  constructor(scene) {
    this.scene = scene;
    this.simulationTimer = null;
    this.simulationComplete = false;
  }

  /**
   * Démarre le niveau de course
   */
  async startLevel(level) {
    this.levelData = level;
    this.settings = level.settings || {};

    // Créer la visualisation
    this.createVisualization();

    // Ajouter des collisions avec les limites de la zone de jeu
    this.scene.addGameAreaCollider(this.virtualPlayer);

    // Pour les groupes d'objets, on ajoute les collisions individuellement
    this.opponents.forEach((opponent) => {
      this.scene.addGameAreaCollider(opponent);
    });

    // Démarrer la simulation
    this.startSimulation();
  }

  /**
   * Crée la visualisation du niveau de course
   */
  createVisualization() {
    const { width, height } = this.scene.cameras.main;
    const settings = this.settings;

    // Piste de course
    this.track = this.scene.add
      .rectangle(width / 2, height / 2, width - 100, height / 2, 0x95a5a6)
      .setStrokeStyle(4, 0x7f8c8d);

    // Appliquer le masque
    this.scene.applyGameMask(this.track);

    // Ligne de départ/arrivée
    this.startLine = this.scene.add.rectangle(
      width / 4,
      height / 2,
      10,
      height / 2,
      0xffffff
    );
    this.finishLine = this.scene.add.rectangle(
      (width * 3) / 4,
      height / 2,
      10,
      height / 2,
      0xf1c40f
    );

    // Appliquer le masque
    this.scene.applyGameMask(this.startLine);
    this.scene.applyGameMask(this.finishLine);

    // Zone de course effective (pour délimiter les mouvements)
    const trackTop = height / 2 - height / 5;
    const trackBottom = height / 2 + height / 5;
    const trackHeight = trackBottom - trackTop;

    // Voiture du joueur fictif
    this.virtualPlayer = this.scene.add
      .rectangle(width / 4, height / 2 - 20, 40, 20, 0xe74c3c)
      .setStrokeStyle(2, 0xc0392b);

    // Appliquer le masque
    this.scene.applyGameMask(this.virtualPlayer);

    // Trajectoire aléatoire pour la voiture du joueur
    // Générer des points de contrôle pour la trajectoire sinusoïdale
    this.playerPath = [];
    const pathSegments = 12; // Plus de segments pour plus de variation

    for (let i = 0; i <= pathSegments; i++) {
      const pathX = width / 4 + (width / 2) * (i / pathSegments);
      // Variation verticale aléatoire pour créer une trajectoire non linéaire
      const variance = Math.random() * trackHeight * 0.6 - trackHeight * 0.3; // Plus de variation
      const pathY = height / 2 + variance;
      this.playerPath.push({ x: pathX, y: pathY });
    }

    // Trajectoire actuelle (index du point de contrôle courant)
    this.currentPathIndex = 0;

    // Adversaires
    this.opponents = [];
    const opponentCount = settings.opponentCount;

    for (let i = 0; i < opponentCount; i++) {
      const opponent = this.scene.add
        .rectangle(width / 4, height / 2 + 20 + i * 20, 40, 20, 0x3498db)
        .setStrokeStyle(2, 0x2980b9);

      // Appliquer le masque
      this.scene.applyGameMask(opponent);

      this.opponents.push(opponent);

      // Créer des trajectoires aléatoires pour chaque adversaire
      opponent.path = [];
      for (let j = 0; j <= pathSegments; j++) {
        const pathX = width / 4 + (width / 2) * (j / pathSegments);
        // Variation verticale plus importante pour les adversaires
        const variance = Math.random() * trackHeight * 0.7 - trackHeight * 0.35;
        const pathY = height / 2 + variance;
        opponent.path.push({ x: pathX, y: pathY });
      }
      opponent.currentPathIndex = 0;
      opponent.speed = 1; // Facteur de vitesse normal
      opponent.slowDuration = 0; // Durée de ralentissement
    }

    // Boosts (représentés par des étoiles) - Mieux répartis
    this.boosts = [];
    const boostCount = settings.boostCount;

    // Créer des zones pour mieux répartir les boosts
    const zoneWidth = width / 2 / 3; // Diviser la piste en 3 zones

    for (let i = 0; i < boostCount; i++) {
      // Déterminer dans quelle zone horizontale placer ce boost
      const zone = i % 3; // 0, 1 ou 2

      // Position X dans la zone (avec marge)
      const zoneStart = width / 4 + zone * zoneWidth + zoneWidth * 0.2;
      const zoneEnd = width / 4 + (zone + 1) * zoneWidth - zoneWidth * 0.2;
      const x = zoneStart + Math.random() * (zoneEnd - zoneStart);

      // Position Y aléatoire (avec marge de sécurité pour rester sur la piste)
      const y = trackTop + Math.random() * trackHeight;

      const boost = this.scene.add
        .star(x, y, 5, 5, 15, 0xf1c40f)
        .setStrokeStyle(2, 0xf39c12);

      // Appliquer le masque
      this.scene.applyGameMask(boost);

      this.boosts.push(boost);
    }

    // Obstacles (nouveau)
    this.obstacles = [];
    const obstacleCount = Math.max(1, Math.floor(settings.trackLength / 1500)); // 1 obstacle tous les 1500 unités de longueur

    for (let i = 0; i < obstacleCount; i++) {
      // Répartir les obstacles de manière équilibrée
      const segmentWidth = width / 2 / obstacleCount;
      const x =
        width / 4 +
        i * segmentWidth +
        segmentWidth * 0.5 +
        Math.random() * segmentWidth * 0.4 -
        segmentWidth * 0.2;
      const y = trackTop + Math.random() * trackHeight;

      const obstacle = this.scene.add
        .rectangle(x, y, 30, 30, 0xe74c3c, 0.7)
        .setStrokeStyle(2, 0xc0392b);

      // Appliquer le masque
      this.scene.applyGameMask(obstacle);

      // Ajouter une icône d'avertissement
      const warningIcon = this.scene.add
        .text(x, y, "⚠️", {
          fontSize: "20px",
        })
        .setOrigin(0.5);

      // Appliquer le masque
      this.scene.applyGameMask(warningIcon);

      this.obstacles.push(obstacle);
    }

    // Progression
    this.progressText = this.scene.add
      .text(width / 2, 100, `0%`, {
        fontSize: "24px",
        fontFamily: "Arial",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    // Position
    this.positionText = this.scene.add
      .text(width / 2, 140, `Position: 1/${opponentCount + 1}`, {
        fontSize: "20px",
        fontFamily: "Arial",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);
  }

  /**
   * Démarre la simulation du niveau de course
   */
  startSimulation() {
    const settings = this.settings;
    const { width } = this.scene.cameras.main;

    // Variables de la simulation
    let progress = 0;
    const trackLength = settings.trackLength;
    const playerSpeed = settings.carSpeed;
    const opponentBaseSpeed = settings.opponentSpeed;
    let playerPosition = 1;
    let hasGottenBoosts = 0;
    let hitObstacles = 0;

    // Facteur de vitesse actuel du joueur (peut être modifié par les obstacles)
    let playerSpeedFactor = 1;
    let playerSlowDuration = 0;

    // Chance de réussite pour attraper un boost (dépend de la difficulté)
    const boostSuccessRate =
      settings.difficulty === "easy"
        ? 0.6
        : settings.difficulty === "hard"
        ? 0.4
        : 0.5;

    // Position de départ des concurrents
    const opponentPositions = this.opponents.map(() => 0);

    // Timer pour mettre à jour la simulation
    this.simulationTimer = this.scene.time.addEvent({
      delay: 16.6, // ~60 fps
      callback: () => {
        // Gérer le ralentissement du joueur
        if (playerSlowDuration > 0) {
          playerSlowDuration -= 0.016 * this.scene.simulationSpeed;
          if (playerSlowDuration <= 0) {
            playerSpeedFactor = 1; // Rétablir la vitesse normale
          }
        }

        // Avancer le joueur
        progress +=
          ((playerSpeed * playerSpeedFactor) / trackLength) *
          0.016 *
          this.scene.simulationSpeed *
          100;

        // Position horizontale (progression) sur la piste
        const progressRatio = Math.min(progress / 100, 1);
        const targetPathIndex = Math.floor(
          progressRatio * this.playerPath.length
        );

        if (targetPathIndex > this.currentPathIndex) {
          this.currentPathIndex = targetPathIndex;
        }

        // Interpolation entre les points de contrôle pour un mouvement fluide
        let targetX, targetY;

        if (this.currentPathIndex < this.playerPath.length - 1) {
          const pointA = this.playerPath[this.currentPathIndex];
          const pointB = this.playerPath[this.currentPathIndex + 1];
          const subProgress =
            progressRatio * this.playerPath.length - this.currentPathIndex;

          targetX = pointA.x + (pointB.x - pointA.x) * subProgress;
          targetY = pointA.y + (pointB.y - pointA.y) * subProgress;
        } else {
          // Dernier point de contrôle
          targetX = this.playerPath[this.playerPath.length - 1].x;
          targetY = this.playerPath[this.playerPath.length - 1].y;
        }

        // Déplacement progressif de la voiture (avec une légère inertie)
        this.virtualPlayer.x +=
          (targetX - this.virtualPlayer.x) * 0.1 * this.scene.simulationSpeed;
        this.virtualPlayer.y +=
          (targetY - this.virtualPlayer.y) * 0.1 * this.scene.simulationSpeed;

        // Vérifier les collisions avec les obstacles
        this.obstacles.forEach((obstacle) => {
          if (
            obstacle.visible &&
            Math.abs(this.virtualPlayer.x - obstacle.x) < 35 &&
            Math.abs(this.virtualPlayer.y - obstacle.y) < 35
          ) {
            // Collision avec un obstacle
            hitObstacles++;

            // Ralentir la voiture
            playerSpeedFactor = 0.6;
            playerSlowDuration = 2; // Ralenti pendant 2 secondes

            // Animation de collision
            this.scene.tweens.add({
              targets: this.virtualPlayer,
              angle: 10,
              duration: 100,
              yoyo: true,
              repeat: 3,
            });

            this.scene.tweens.add({
              targets: obstacle,
              alpha: 0,
              duration: 300,
              onComplete: () => (obstacle.visible = false),
            });

            // Animation de fumée (effet de particules)
            for (let i = 0; i < 10; i++) {
              const smoke = this.scene.add.circle(
                this.virtualPlayer.x,
                this.virtualPlayer.y,
                5 + Math.random() * 5,
                0x666666,
                0.7
              );

              this.scene.tweens.add({
                targets: smoke,
                x: smoke.x + (Math.random() * 40 - 20),
                y: smoke.y + (Math.random() * 40 - 20),
                alpha: 0,
                scale: 0.5,
                duration: 500,
                onComplete: () => smoke.destroy(),
              });
            }
          }
        });

        // Vérifier les boosts avec une chance de les rater
        this.boosts.forEach((boost, index) => {
          if (
            boost.visible &&
            Math.abs(this.virtualPlayer.x - boost.x) < 30 &&
            Math.abs(this.virtualPlayer.y - boost.y) < 30
          ) {
            // Chance aléatoire d'attraper le boost basée sur la difficulté
            // La chance baisse si la voiture est ralentie
            const actualBoostRate =
              playerSpeedFactor < 1 ? boostSuccessRate * 0.7 : boostSuccessRate;

            if (Math.random() < actualBoostRate) {
              boost.visible = false;
              hasGottenBoosts++;

              // Bonus de vitesse temporaire et boost de progression
              progress += 2.5;
              playerSpeedFactor = Math.min(1.2, playerSpeedFactor + 0.2);

              // Animation de boost réussi
              this.scene.tweens.add({
                targets: this.virtualPlayer,
                scaleX: 1.3,
                duration: 300,
                yoyo: true,
              });

              // Effet de particules pour le boost
              for (let i = 0; i < 8; i++) {
                const particle = this.scene.add.star(
                  boost.x,
                  boost.y,
                  5,
                  2,
                  4,
                  0xffff00,
                  0.8
                );

                this.scene.tweens.add({
                  targets: particle,
                  x: particle.x + (Math.random() * 60 - 30),
                  y: particle.y + (Math.random() * 60 - 30),
                  scale: 0.1,
                  alpha: 0,
                  duration: 400,
                  onComplete: () => particle.destroy(),
                });
              }
            } else {
              // Animation de boost raté
              this.scene.tweens.add({
                targets: boost,
                alpha: 0,
                duration: 200,
                onComplete: () => (boost.visible = false),
              });

              // Effet visuel de ratage
              const missText = this.scene.add
                .text(boost.x, boost.y, "Raté!", {
                  fontSize: "14px",
                  fontFamily: "Arial",
                  color: "#ffffff",
                })
                .setOrigin(0.5);

              this.scene.tweens.add({
                targets: missText,
                y: missText.y - 20,
                alpha: 0,
                duration: 700,
                onComplete: () => missText.destroy(),
              });
            }
          }
        });

        // Mettre à jour les adversaires avec leurs propres trajectoires
        this.opponents.forEach((opponent, index) => {
          // Gérer le ralentissement des adversaires
          if (opponent.slowDuration > 0) {
            opponent.slowDuration -= 0.016 * this.scene.simulationSpeed;
            if (opponent.slowDuration <= 0) {
              opponent.speed = 1; // Rétablir la vitesse normale
            }
          }

          // Vitesse basée sur la difficulté et l'aléatoire
          const difficultyFactor =
            settings.difficulty === "easy"
              ? 0.8
              : settings.difficulty === "hard"
              ? 1.15
              : 1;

          // Vitesse légèrement aléatoire
          const opponentSpeed =
            opponentBaseSpeed *
            difficultyFactor *
            opponent.speed *
            (0.9 + Math.random() * 0.2);

          // Avancer l'adversaire
          opponentPositions[index] +=
            (opponentSpeed / trackLength) *
            0.016 *
            this.scene.simulationSpeed *
            100;

          // Position sur la trajectoire
          const opProgressRatio = Math.min(opponentPositions[index] / 100, 1);
          const opTargetPathIndex = Math.floor(
            opProgressRatio * opponent.path.length
          );

          if (opTargetPathIndex > opponent.currentPathIndex) {
            opponent.currentPathIndex = opTargetPathIndex;
          }

          // Interpolation entre les points de contrôle
          let opTargetX, opTargetY;

          if (opponent.currentPathIndex < opponent.path.length - 1) {
            const pointA = opponent.path[opponent.currentPathIndex];
            const pointB = opponent.path[opponent.currentPathIndex + 1];
            const subProgress =
              opProgressRatio * opponent.path.length -
              opponent.currentPathIndex;

            opTargetX = pointA.x + (pointB.x - pointA.x) * subProgress;
            opTargetY = pointA.y + (pointB.y - pointA.y) * subProgress;
          } else {
            // Dernier point
            opTargetX = opponent.path[opponent.path.length - 1].x;
            opTargetY = opponent.path[opponent.path.length - 1].y;
          }

          // Déplacement progressif de la voiture
          opponent.x +=
            (opTargetX - opponent.x) * 0.1 * this.scene.simulationSpeed;
          opponent.y +=
            (opTargetY - opponent.y) * 0.1 * this.scene.simulationSpeed;

          // Vérifier les collisions des adversaires avec les obstacles
          this.obstacles.forEach((obstacle) => {
            if (
              obstacle.visible &&
              Math.abs(opponent.x - obstacle.x) < 35 &&
              Math.abs(opponent.y - obstacle.y) < 35
            ) {
              // Ralentir l'adversaire
              opponent.speed = 0.7;
              opponent.slowDuration = 1.5; // Ralenti pendant 1.5 secondes

              // Animation de collision pour l'adversaire
              this.scene.tweens.add({
                targets: opponent,
                angle: 10,
                duration: 100,
                yoyo: true,
                repeat: 2,
              });
            }
          });
        });

        // Calculer la position du joueur
        playerPosition = 1;
        opponentPositions.forEach((pos) => {
          if (pos > progress) playerPosition++;
        });

        // Mettre à jour l'affichage
        this.progressText.setText(`${Math.min(100, Math.floor(progress))}%`);
        this.positionText.setText(
          `Position: ${playerPosition}/${this.opponents.length + 1}`
        );

        // Vérifier si la course est terminée
        if (progress >= 100) {
          // Déterminer le feedback selon la position d'arrivée, les boosts attrapés et les obstacles heurtés
          const totalBoosts = settings.boostCount;
          const boostRatio = hasGottenBoosts / totalBoosts;

          if (playerPosition === 1) {
            if (boostRatio > 0.7 && hitObstacles === 0) {
              this.levelData.playerFeedback =
                "Cette course était trop facile ! J'ai gagné sans effort, j'ai attrapé beaucoup de boosts et j'ai évité tous les obstacles. Il faudrait augmenter la difficulté.";
            } else if (hitObstacles === 0 && boostRatio > 0.5) {
              this.levelData.playerFeedback =
                "J'ai bien réussi cette course ! J'ai attrapé pas mal de boosts et évité les obstacles. Un bon défi mais peut-être un peu trop facile.";
            } else if (hitObstacles > 0 && boostRatio > 0.3) {
              this.levelData.playerFeedback =
                "C'était une course équilibrée ! J'ai réussi à gagner malgré quelques collisions, et j'ai attrapé assez de boosts.";
              this.levelData.balanced = true;
            } else {
              this.levelData.playerFeedback =
                "J'ai réussi à gagner mais c'était juste ! J'ai raté plusieurs boosts et heurté des obstacles. Le niveau est bien équilibré et stimulant.";
              this.levelData.balanced = true;
            }
          } else if (
            playerPosition <= Math.ceil((this.opponents.length + 1) / 2)
          ) {
            if (hitObstacles > 1 && boostRatio < 0.3) {
              this.levelData.playerFeedback =
                "Cette course était assez difficile ! J'ai heurté des obstacles et raté plusieurs boosts, ce qui m'a coûté la victoire. Un bon défi néanmoins.";
              this.levelData.balanced = true;
            } else if (boostRatio > 0.5) {
              this.levelData.playerFeedback =
                "J'ai terminé en milieu de peloton malgré avoir attrapé pas mal de boosts. La course avait un bon équilibre.";
              this.levelData.balanced = true;
            } else {
              this.levelData.playerFeedback =
                "J'ai fini à une place correcte. La difficulté était équilibrée même si j'ai raté beaucoup de boosts.";
              this.levelData.balanced = true;
            }
          } else {
            if (hitObstacles > 2 && boostRatio < 0.25) {
              this.levelData.playerFeedback =
                "Cette course est trop difficile ! J'ai heurté trop d'obstacles et je n'ai presque pas réussi à attraper de boosts. Résultat: dernières places...";
            } else if (boostRatio < 0.3) {
              this.levelData.playerFeedback =
                "La course est trop compliquée ! Les boosts sont trop difficiles à attraper et les adversaires trop rapides.";
            } else {
              this.levelData.playerFeedback =
                "J'ai terminé loin derrière. Les obstacles sont bien placés mais les adversaires sont peut-être trop rapides pour le nombre de boosts disponibles.";
            }
          }

          this.levelData.completed = true;
          this.completeSimulation(playerPosition === 1);
        }
      },
      callbackScope: this,
      loop: true,
    });
  }

  /**
   * Termine la simulation
   * @param {boolean} success - Indique si le niveau a été terminé avec succès
   */
  completeSimulation(success = true) {
    if (this.simulationComplete) return;
    this.simulationComplete = true;

    if (this.simulationTimer) {
      this.simulationTimer.remove();
    }

    // Signaler à la scène principale que la simulation est terminée
    this.scene.onSimulationComplete(success);
  }

  /**
   * Arrête proprement la simulation
   */
  destroy() {
    if (this.simulationTimer) {
      this.simulationTimer.remove();
    }
  }
}
