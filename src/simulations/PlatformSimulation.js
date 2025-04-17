// Example: https://phaser.io/examples/v3.85.0/physics/arcade/view/direct-control-platforms
/**
 * PlatformSimulation - Simulation d'un niveau de plateforme
 *
 * Cette classe gère la visualisation et la simulation des niveaux de type plateforme.
 */
class PlatformSimulation {
  constructor(scene) {
    this.scene = scene;
    this.timerValue = 0;
    this.simulationTimer = null;
  }

  async startLevel(level) {
    // Activer la physique
    this.scene.physics.world.enable(this.scene);

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

    this.scene.anims.create({
      key: "right",
      frames: this.scene.anims.generateFrameNumbers("player-platforms", {
        start: 4,
        end: 5,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "hello",
      frames: this.scene.anims.generateFrameNumbers("player-platforms", {
        start: 2,
        end: 3,
      }),
      frameRate: 3,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "happy",
      frames: this.scene.anims.generateFrameNumbers("player-platforms", {
        start: 0,
        end: 1,
      }),
      frameRate: 3,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "sad",
      frames: this.scene.anims.generateFrameNumbers("player-platforms", {
        start: 16,
        end: 17,
      }),
      frameRate: 2,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "water",
      frames: [
        { key: "tiles-platforms", frame: 7 },
        { key: "tiles-platforms", frame: 10 },
      ],
      frameRate: 2,
      repeat: -1,
    });

    player.anims.play("hello", true);

    // Groupes de physique
    const platformsGroup = this.scene.physics.add.staticGroup();
    const obstaclesGroup = this.scene.physics.add.staticGroup();
    const finishGroup = this.scene.physics.add.staticGroup();
    const waterGroup = this.scene.add.group();

    // Configurer les collisions
    this.scene.physics.add.collider(player, platformsGroup);

    // Observer les collisions avec les obstacles et le drapeau
    this.scene.physics.add.overlap(
      player,
      obstaclesGroup,
      this.handleObstacleCollision,
      null,
      this
    );

    this.flagCollider = this.scene.physics.add.overlap(
      player,
      finishGroup,
      this.handleFinishFlag,
      null,
      this
    );

    await level.onStart({
      scene: this.scene,
      player,
      platformsGroup,
      obstaclesGroup,
      finishGroup,
      waterGroup, // Ajouter waterGroup aux paramètres
    });

    // Appliquer le masque aux éléments créés par level.onStart
    // Pour platformsGroup
    platformsGroup.getChildren().forEach((child) => {
      this.scene.applyGameMask(child);
    });

    // Pour obstaclesGroup
    obstaclesGroup.getChildren().forEach((child) => {
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

    const { height, width } = this.scene.cameras.main;

    const instructionsText = this.scene.add
        .text(width / 2, height / 2, "Regardez le monstre jouer au niveau !", {
          fontSize: "32px",
          fontFamily: "Arial",
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 4,
        })
        .setOrigin(0.5);

    this.scene.time.delayedCall(2000, () => {
      this.scene.tweens.add({
        targets: instructionsText,
        alpha: 0,           // Faire disparaître le texte
        duration: 500,      // Durée de l'animation en ms
        ease: 'Power2',     // Type d'animation (plus doux)
        onComplete: () => {
          instructionsText.destroy();
         
        }
      });

      this.startSimulation(player, platformsGroup);
    });
  }

    /**
   * Démarre la simulation du niveau de plateforme
   */
    startSimulation(player, platformsGroup) {
      const settings = {
        playerSpeed: 200,
        playerGravity: 300,
        jumpHeight: 300,
        timeLimit: 15, // secondes
      };
  
      player.body.setGravityY(settings.playerGravity);
  
      player.anims.play("right", true);
  
      const { height, width } = this.scene.cameras.main;
  
      const timerText = this.scene.add
        .text(width - 40, 100, window.i18n.get("timer")(0, settings.timeLimit), {
          fontSize: "24px",
          fontFamily: "Arial",
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 4,
        })
        .setOrigin(1, 0.5);
  
      player.setVelocityX(settings.playerSpeed);
  
      let isMovingBack = false;
      let failingJumps = 0;
  
      const failingJumpsLimit = 3;
  
      this.simulationTimer = this.scene.time.addEvent({
        delay: 16.6, // ~60 fps
        callback: () => {
          this.timerValue += 0.016;
          timerText.setText(
            window.i18n.get("timer")(
              Math.floor(this.timerValue),
              settings.timeLimit
            )
          );
  
          let hasReachedFailingJumpsLimit = failingJumps >= failingJumpsLimit;
  
          if (hasReachedFailingJumpsLimit) {
            if (player.body.touching.down) {
              player.setVelocityX(0);
              player.anims.stop();
              player.setFrame(7);

              this.completeSimulation('PLAYER_BLOCKED');
              return;
            }
          } else if(player.y >=height ) {
            this.completeSimulation('FALL_IN_HOLE');
            return;
          } else {
            if (player.body.blocked.right) {
              failingJumps++;
  
              hasReachedFailingJumpsLimit = failingJumps >= failingJumpsLimit;
  
              player.setVelocityX(-50);
              isMovingBack = true;
            } else if (player.body.touching.down) {
              if (isMovingBack) {
                player.setVelocityX(-settings.playerSpeed);
                player.setFlipX(true);
  
                this.scene.time.delayedCall(400, () => {
                  player.setVelocityX(settings.playerSpeed);
                  player.setFlipX(false);
                  isMovingBack = false;
                });
              } else {
                player.setVelocityX(settings.playerSpeed);
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
                  this.makePlayerJump(player, settings.jumpHeight);
                }
              } else {
                // Changer la frame à la frame 20 pendant le saut
                player.anims.stop();
                player.setFrame(20);
              }
            }
          }
  
          if (this.timerValue >= settings.timeLimit) {
            player.setVelocityX(0);
            player.anims.play("sad", true);
           
            this.completeSimulation('TIMEOUT');
            return;
          }
        },
        callbackScope: this,
        loop: true,
      });
    }
  

  /**
   * Gère la collision avec un obstacle
   */
  handleObstacleCollision(player) {
    return;

    if (!this.hasCollided) {
      this.hasCollided = true;
      // Ralentir le joueur mais ne pas l'arrêter complètement
      player.setVelocityX(this.settings.playerSpeed * 0.5);

      // Animation de collision
      this.scene.tweens.add({
        targets: player,
        alpha: 0.5,
        yoyo: true,
        duration: 200,
        repeat: 3,
      });
    }
  }

  /**
   * Gère l'arrivée au drapeau
   */
  handleFinishFlag(player, flag) {
    this.simulationTimer.remove();

    if (player.x > flag.x) {
      player.setVelocityX(0);
      player.anims.play("happy", true);

      // Remove the overlap detection with the finish flag
      this.flagCollider.destroy();

      this.completeSimulation('WIN');
    }

    return;
    if (!this.reachedEnd) {
      this.reachedEnd = true;

      // Arrêter le joueur
      player.setVelocity(0, 0);

      // Déterminer si le niveau était équilibré
      const timeRatio = this.timer / this.settings.timeLimit;

      // Logique d'équilibrage améliorée
      if (timeRatio < 0.4) {
        // Trop facile - moins de 40% du temps utilisé
        this.levelData.playerFeedback =
          "Ce niveau est beaucoup trop facile ! J'ai terminé en un rien de temps. Tu devrais augmenter la difficulté en ajoutant plus d'obstacles ou en réduisant la vitesse du joueur.";
      } else if (timeRatio > 0.85 && this.hasCollided) {
        // Trop difficile - près du temps limite ET collision
        this.levelData.playerFeedback =
          "Ce niveau est trop difficile ! J'ai à peine réussi à le terminer et j'ai percuté des obstacles. Tu pourrais réduire le nombre d'obstacles ou augmenter la hauteur de saut.";
      } else if (this.hasCollided && this.settings.obstacleCount > 3) {
        // Difficile mais jouable
        this.levelData.playerFeedback =
          "Le niveau est assez difficile avec tous ces obstacles ! J'ai réussi mais j'ai percuté quelque chose. C'était stimulant mais peut-être un peu trop.";
      } else if (timeRatio > 0.75) {
        // Bon équilibre - temps correct
        this.levelData.playerFeedback =
          "C'était un niveau bien équilibré ! Un bon défi qui m'a fait utiliser mon temps de manière efficace.";
        this.levelData.balanced = true;
      } else {
        // Bon équilibre - ni trop facile, ni trop difficile
        this.levelData.playerFeedback =
          "C'était un niveau parfaitement équilibré ! Juste assez difficile pour être stimulant, mais pas frustrant.";
        this.levelData.balanced = true;
      }

      this.levelData.completed = true;

      // Terminer la simulation après une courte pause
      this.scene.time.delayedCall(1000, () => {
        this.completeSimulation(true);
      });
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

  makePlayerJump(player, jumpHeight) {
    player.setVelocityY(-jumpHeight);
  }

  /**
   * Termine la simulation
   * @param {string} finishReason - PLAYER_BLOCKED, TIMEOUT, FAILURE
   */
  completeSimulation(finishReason) {
    this.simulationTimer.remove();

    console.log({ finishReason })

    // Signaler à la scène principale que la simulation est terminée
    // TODO: this.scene.onSimulationComplete(success);
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
