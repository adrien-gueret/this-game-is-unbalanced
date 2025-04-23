/**
 * PlatformSimulation - Simulation d'un niveau de plateforme
 *
 * Cette classe gère la simulation des niveaux de type plateforme.
 */
class PlatformSimulation {
  constructor(scene) {
    this.scene = scene;
    this.timerValue = 0;
    this.simulationTimer = null;
  }

  async startLevel(level) {
    // Joueur fictif avec physique
    const player = this.scene.physics.add
      .sprite(0, 0, "player-platforms", 4)
      .setCollideWorldBounds(false)
      .setDepth(100);

    player.setScale(2);

    // Réduire la taille de la hitbox (70% de la largeur, 90% de la hauteur)
    player.body.setSize(player.width * 0.8, player.height * 0.8);
    // Centrer la hitbox dans le sprite
    player.body.setOffset(player.width * 0.1, player.height * 0.2);

    /*
    // Activer le debug pour voir les hitboxes
    this.scene.physics.world.createDebugGraphic();
    this.scene.physics.world.debugGraphic.visible = true;
    
    // Configuration optionnelle des couleurs du debug
    this.scene.physics.world.defaults.debugShowBody = true;
    this.scene.physics.world.defaults.bodyDebugColor = 0xff00ff; // Rose vif pour mieux voir
    */

    // Appliquer le masque au joueur
    this.scene.applyGameMask(player);

    // Enregistrer les animations via AnimationManager
    AnimationManager.registerAnimations(this.scene);

    player.anims.play("hello", true);

    // Groupes de physique
    const platformsGroup = this.scene.physics.add.staticGroup();
    const finishGroup = this.scene.physics.add.staticGroup();
    const waterGroup = this.scene.add.group();

    // Configurer les collisions
    this.scene.physics.add.collider(player, platformsGroup);

    // Observer les collisions avec le drapeau
    this.flagCollider = this.scene.physics.add.overlap(
      player,
      finishGroup,
      (player, flag) => this.handleFinishFlag(player, flag, level),
      null,
      this
    );

    level.start({
      scene: this.scene,
      player,
      platformsGroup,
      finishGroup,
      waterGroup,
    });

    // Appliquer le masque aux éléments créés par level.start
    // Pour platformsGroup
    platformsGroup.getChildren().forEach((child) => {
      this.scene.applyGameMask(child);
    });

    // Pour finishGroup
    finishGroup.getChildren().forEach((child) => {
      this.scene.applyGameMask(child);
    });

    // Appliquer le masque aux tuiles d'eau
    waterGroup.getChildren().forEach((child) => {
      this.scene.applyGameMask(child);
    });

    showMessage(
      this.scene,
      window.i18n.get("watchInstruction"),
      "#ffffff",
      () => {
        this.startSimulation(player, platformsGroup, level);
      },
      window.i18n.get("clickToStart")
    );
  }

  /**
   * Démarre la simulation du niveau de plateforme
   */
  startSimulation(player, platformsGroup, level) {
    this.isSimulationEnd = false;
    player.body.setGravityY(level.settings.playerGravity.value);

    player.anims.play("right", true);

    const { height, width } = this.scene.cameras.main;

    const timerText = this.scene.add
      .text(
        width - 40,
        100,
        window.i18n.get("timer")(0, level.settings.timeLimit.value),
        {
          fontSize: "24px",
          fontFamily: "Arial",
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 4,
        }
      )
      .setOrigin(1, 0.5);

    player.setVelocityX(level.settings.playerSpeed.value);

    let isMovingBack = false;
    let failingJumps = 0;

    const failingJumpsLimit = 3;

    if (this.simulationTimer) {
      this.simulationTimer.remove();
    }

    this.simulationTimer = this.scene.time.addEvent({
      delay: 16.6, // ~60 fps
      callback: () => {
        this.timerValue += 0.016;
        timerText.setText(
          window.i18n.get("timer")(
            Math.floor(this.timerValue),
            level.settings.timeLimit.value
          )
        );

        let hasReachedFailingJumpsLimit = failingJumps >= failingJumpsLimit;

        if (hasReachedFailingJumpsLimit) {
          if (player.body.touching.down) {
            player.setVelocityX(0);
            player.anims.stop();
            player.setFrame(7);

            this.completeSimulation("PLAYER_BLOCKED", level);
            return;
          }
        } else if (player.y >= height) {
          this.completeSimulation("FALL_IN_HOLE", level);
          return;
        } else {
          if (player.body.blocked.right) {
            failingJumps++;

            hasReachedFailingJumpsLimit = failingJumps >= failingJumpsLimit;

            player.setVelocityX(-50);
            isMovingBack = true;
          } else if (player.body.touching.down) {
            if (isMovingBack) {
              player.setVelocityX(-level.settings.playerSpeed.value);
              player.setFlipX(true);

              this.scene.time.delayedCall(400, () => {
                if (this.isSimulationEnd) {
                  return;
                }
                player.setVelocityX(level.settings.playerSpeed.value);
                player.setFlipX(false);
                isMovingBack = false;
              });
            } else {
              player.setVelocityX(level.settings.playerSpeed.value);
            }
          }

          if (!hasReachedFailingJumpsLimit) {
            // Vérifier si le joueur a touché le sol après un saut
            if (player.body.touching.down) {
              player.anims.play("right", true);

              // Vérifier s'il y a un mur devant ou un trou et faire sauter le joueur si nécessaire
              if (
                this.isWallAhead(player, platformsGroup) ||
                this.isHoleAhead(player, platformsGroup)
              ) {
                // Faire sauter le joueur
                this.scene.sound.play("jump");
                player.setVelocityY(-level.settings.jumpHeight.value);
              }
            } else {
              // Changer la frame à la frame 20 pendant le saut
              player.anims.stop();
              player.setFrame(20);
            }
          }
        }

        if (this.timerValue >= level.settings.timeLimit.value) {
          player.setVelocityX(0);
          player.anims.play("sad", true);

          this.completeSimulation("TIMEOUT", level);
          return;
        }
      },
      callbackScope: this,
      loop: true,
    });
  }

  /**
   * Gère l'arrivée au drapeau
   */
  handleFinishFlag(player, flag, level) {
    this.simulationTimer.remove();

    if (player.x > flag.x) {
      player.setVelocityX(0);
      player.anims.play("happy", true);

      // Remove the overlap detection with the finish flag
      this.flagCollider.destroy();

      this.completeSimulation("SUCCESS", level);
    }
  }

  /**
   * Vérifie si un mur ou obstacle est présent devant le joueur
   * @param {Phaser.Physics.Arcade.Sprite} player - Le sprite du joueur
   * @param {number} detectionDistance - Distance de détection devant le joueur
   * @returns {boolean} - Vrai si un mur est détecté
   */
  isWallAhead(player, platformsGroup, detectionDistance = 64) {
    // Déterminer la position de détection (devant le joueur)
    const detectionX = player.x + player.width / 2 + detectionDistance;
    const detectionY = player.y;

    // Vérifier chaque plateforme pour voir si elle est dans la zone de détection
    for (const platform of platformsGroup.getChildren()) {
      // Vérifier si la plateforme est devant le joueur et à peu près à sa hauteur
      if (player.body.velocity.x > 0) {
        if (
          platform.x > player.x &&
          platform.x - platform.width / 2 <= detectionX &&
          Math.abs(platform.y - detectionY) < player.height
        ) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Vérifie si un trou ou de l'eau est présent devant le joueur
   * @param {Phaser.Physics.Arcade.Sprite} player - Le sprite du joueur
   * @param {number} detectionDistance - Distance de détection devant le joueur
   * @returns {boolean} - Vrai si un trou est détecté
   */
  isHoleAhead(player, platformsGroup, detectionDistance = 32) {
    // Déterminer la position de détection (devant le joueur)
    const detectionX = player.x + player.width / 2 + detectionDistance;
    const detectionY = player.y + player.height * 2 - player.height / 2;

    // Vérifier s'il y a une plateforme sous la zone de détection
    for (const platform of platformsGroup.getChildren()) {
      // Vérifier si la plateforme est sous la zone de détection
      if (
        platform.x > player.x &&
        platform.x - platform.width / 2 <= detectionX &&
        platform.y === detectionY
      ) {
        return false; // Il y a une plateforme, donc pas de trou
      }
    }

    // Si on arrive ici, c'est qu'on n'a pas trouvé de plateforme sous la trajectoire
    return true; // Il y a un trou ou de l'eau, il faut sauter
  }

  /**
   * Termine la simulation
   * @param {string} finishReason - PLAYER_BLOCKED, TIMEOUT, FAILURE
   */
  completeSimulation(finishReason, level) {
    this.simulationTimer.remove();
    this.isSimulationEnd = true;
    let isBalanced = false;
    let feedback = "";
    let monsterAnimation = undefined;
    let monsterStaticFrame = undefined;

    const difficulty = level.getDifficulty();
    const timeLimit = level.settings.timeLimit.value;

    // Variable pour stocker le message à afficher
    let message = "";
    let messageColor = "#ffffff";

    switch (finishReason) {
      case "SUCCESS":
        message = window.i18n.get("platformsSuccess");
        messageColor = "#7CFC00";

        const timerRatio = Math.floor((this.timerValue / timeLimit) * 100);

        switch (difficulty) {
          case "easy":
            feedback = window.i18n.get("platformsFeedbackTooEasy");
            monsterAnimation = "oopsy";
            break;

          case "hard":
            feedback = window.i18n.get("platformsFeedbackTooHard");
            monsterStaticFrame = 6;
            break;

          case "medium":
            const hasTimeLimitSettings = Boolean(
              level.settings.timeLimit.label
            );
            if (hasTimeLimitSettings && timerRatio <= 40) {
              feedback = window.i18n.get("platformsFeedbackTooFarLimit");
              monsterAnimation = "oopsy";
            } else if (hasTimeLimitSettings && timerRatio >= 80) {
              feedback = window.i18n.get("platformsFeedbackTooNearLimit");
              monsterStaticFrame = 6;
            } else {
              feedback = window.i18n.get("gameFeedbackBalanced");
              monsterAnimation = "happy";
              isBalanced = true;
            }

            break;
        }

        break;

      case "PLAYER_BLOCKED": {
        message = window.i18n.get("platformsBlocked");
        messageColor = "#FFA500";
        feedback = window.i18n.get("platformsFeedbackBlocked");
        monsterAnimation = "speaking";
        break;
      }

      case "TIMEOUT": {
        message = window.i18n.get("timeout");
        messageColor = "#FF6347";
        feedback = window.i18n.get("platformsFeedbackTimeout");
        monsterAnimation = "sad";
        break;
      }

      case "FALL_IN_HOLE": {
        message = window.i18n.get("platformsFailure");
        messageColor = "#FF6347";
        feedback = window.i18n.get("platformsFeedbackFailure");
        monsterAnimation = "angry";
        break;
      }
    }

    showMessage(this.scene, message, messageColor, () => {
      // Emit an event to notify the scene that the simulation is complete
      this.scene.events.emit("simulationComplete", {
        feedback,
        isBalanced,
        monsterAnimation,
        monsterStaticFrame,
      });
    });
  }
}
