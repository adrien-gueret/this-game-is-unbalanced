/**
 * BossSimulation - Simulation d'un niveau de combat de boss
 *
 * Cette classe gère la visualisation et la simulation des niveaux de type combat de boss.
 */
class BossSimulation {
  constructor(scene) {
    this.scene = scene;
    this.simulationTimer = null;
    this.simulationComplete = false;
  }

  /**
   * Démarre le niveau de combat de boss
   */
  async startLevel(level) {
    this.levelData = level;
    this.settings = level.settings || {};

    // Créer la visualisation
    this.createVisualization();

    // Ajouter des collisions avec les limites de la zone de jeu
    // Pour le joueur
    this.scene.addGameAreaCollider(this.player);
    // Pour le boss
    this.scene.addGameAreaCollider(this.boss);

    // Démarrer la simulation
    this.startSimulation();
  }

  /**
   * Crée la visualisation du niveau de combat de boss
   */
  createVisualization() {
    const { width, height } = this.scene.cameras.main;
    const settings = this.settings;

    // Arène de combat
    this.arena = this.scene.add
      .rectangle(width / 2, height / 2, width - 100, height / 2, 0x000000, 0.3)
      .setStrokeStyle(4, 0xe74c3c);

    // Appliquer le masque
    this.scene.applyGameMask(this.arena);

    // Personnage du joueur
    this.player = this.scene.add
      .rectangle(width / 4, height / 2, 30, 50, 0x3498db)
      .setStrokeStyle(2, 0x2980b9);

    // Appliquer le masque
    this.scene.applyGameMask(this.player);

    // Animations du personnage (indice visuel qu'il est actif)
    this.scene.tweens.add({
      targets: this.player,
      y: this.player.y - 5,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Boss
    const bossSize = Math.min(150, width / 4);
    this.boss = this.scene.add
      .rectangle((width * 3) / 4, height / 2, bossSize, bossSize, 0xe74c3c)
      .setStrokeStyle(4, 0xc0392b);

    // Appliquer le masque
    this.scene.applyGameMask(this.boss);

    // Ajouter un aspect menaçant au boss
    const bossEye1 = this.scene.add.circle(
      this.boss.x - bossSize / 4,
      this.boss.y - bossSize / 6,
      8,
      0x000000
    );

    // Appliquer le masque
    this.scene.applyGameMask(bossEye1);

    const bossEye2 = this.scene.add.circle(
      this.boss.x + bossSize / 4,
      this.boss.y - bossSize / 6,
      8,
      0x000000
    );

    // Appliquer le masque
    this.scene.applyGameMask(bossEye2);

    const bossMouth = this.scene.add.rectangle(
      this.boss.x,
      this.boss.y + bossSize / 5,
      bossSize / 2,
      bossSize / 8,
      0x000000
    );

    // Appliquer le masque
    this.scene.applyGameMask(bossMouth);

    // Animation du boss (respiration)
    this.scene.tweens.add({
      targets: this.boss,
      scaleX: 1.05,
      scaleY: 0.95,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Barres de vie
    // Joueur
    this.playerHealthBg = this.scene.add
      .rectangle(width / 4, height / 2 - 50, 100, 10, 0x000000)
      .setOrigin(0.5);

    // Appliquer le masque
    this.scene.applyGameMask(this.playerHealthBg);

    this.playerHealthBar = this.scene.add
      .rectangle(width / 4, height / 2 - 50, 100, 10, 0x2ecc71)
      .setOrigin(0.5);

    // Appliquer le masque
    this.scene.applyGameMask(this.playerHealthBar);

    // Boss
    const bossHealthWidth = Math.max(100, bossSize);
    this.bossHealthBg = this.scene.add
      .rectangle(
        (width * 3) / 4,
        height / 2 - bossSize / 2 - 20,
        bossHealthWidth,
        15,
        0x000000
      )
      .setOrigin(0.5);

    // Appliquer le masque
    this.scene.applyGameMask(this.bossHealthBg);

    this.bossHealthBar = this.scene.add
      .rectangle(
        (width * 3) / 4,
        height / 2 - bossSize / 2 - 20,
        bossHealthWidth,
        15,
        0xe74c3c
      )
      .setOrigin(0.5);

    // Appliquer le masque
    this.scene.applyGameMask(this.bossHealthBar);

    // Texte d'info
    this.infoText = this.scene.add
      .text(width / 2, 100, "", {
        fontSize: "20px",
        fontFamily: "Arial",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    // Timer de combat
    this.timeText = this.scene.add
      .text(width / 2, 140, `Temps: 0s`, {
        fontSize: "18px",
        fontFamily: "Arial",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Statistiques du combat
    this.statsText = this.scene.add
      .text(width / 2, height - 60, "", {
        fontSize: "16px",
        fontFamily: "Arial",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    // Particules et effets
    this.particles = this.scene.add.particles();

    // Emetteur pour les attaques du joueur
    this.attackEmitter = this.particles.createEmitter({
      speed: { min: 200, max: 400 },
      angle: { min: -30, max: 30 },
      scale: { start: 0.6, end: 0 },
      blendMode: "ADD",
      on: false,
      lifespan: 200,
      tint: 0x3498db,
    });

    // Emetteur pour les attaques du boss
    this.bossAttackEmitter = this.particles.createEmitter({
      speed: { min: 150, max: 250 },
      scale: { start: 0.4, end: 0 },
      blendMode: "ADD",
      on: false,
      lifespan: 300,
      tint: 0xe74c3c,
    });

    // Créer des particules génériques à utiliser
    const particles = [];
    for (let i = 0; i < 20; i++) {
      particles.push(this.scene.add.circle(0, 0, 5, 0xffffff));
    }

    this.attackEmitter.setParticles(particles);
    this.bossAttackEmitter.setParticles(particles);
  }

  /**
   * Démarre la simulation du niveau de combat de boss
   */
  startSimulation() {
    const settings = this.settings;
    const { width, height } = this.scene.cameras.main;

    // Variables du combat
    let playerHealth = 100;
    let bossHealth = settings.bossHealth || 1000;
    const maxBossHealth = bossHealth;
    const playerAttack = settings.playerAttack || 20;
    const bossAttack = settings.bossAttack || 15;
    let simulationTime = 0;
    let attackCount = 0;
    let dodgeCount = 0;
    let specialAttackCount = 0;

    // Chances de réussite d'attaque et d'esquive (basées sur la difficulté)
    const attackHitRate =
      settings.difficulty === "easy"
        ? 0.8
        : settings.difficulty === "hard"
        ? 0.6
        : 0.7;

    const dodgeRate =
      settings.difficulty === "easy"
        ? 0.6
        : settings.difficulty === "hard"
        ? 0.3
        : 0.45;

    // Chance de faire une attaque spéciale (dégâts x2)
    const specialAttackRate =
      settings.difficulty === "easy"
        ? 0.3
        : settings.difficulty === "hard"
        ? 0.15
        : 0.2;

    // Est-ce que le boss est dans sa phase enragée? (active quand sa santé est basse)
    let bossEnraged = false;

    // Timer pour mettre à jour la simulation
    this.simulationTimer = this.scene.time.addEvent({
      delay: 16.6, // ~60 fps
      callback: () => {
        simulationTime += 0.0166 * this.scene.simulationSpeed;

        // Mettre à jour l'affichage du temps
        this.timeText.setText(`Temps: ${Math.floor(simulationTime)}s`);

        // Logique de mise à jour de la simulation toutes les secondes
        if (Math.floor(simulationTime * 10) % 10 === 0) {
          // Est-ce que le joueur va attaquer ce tour?
          const willAttack = Math.random() < 0.7;

          if (willAttack) {
            attackCount++;

            // Est-ce une attaque spéciale?
            const isSpecialAttack = Math.random() < specialAttackRate;

            if (isSpecialAttack) {
              specialAttackCount++;

              // Animation d'attaque spéciale (plus grande)
              this.scene.tweens.add({
                targets: this.player,
                x: this.player.x + 100,
                duration: 300,
                yoyo: true,
                ease: "Power1",
                onStart: () => {
                  // Effet de particules plus intenses
                  this.attackEmitter.setPosition(
                    this.player.x + 20,
                    this.player.y
                  );
                  this.attackEmitter.setAngle({ min: -20, max: 20 });
                  this.attackEmitter.setSpeed({ min: 300, max: 500 });
                  this.attackEmitter.setScale({ start: 1, end: 0 });
                  this.attackEmitter.explode(20);

                  // Texte flottant "CRITICAL!"
                  const critText = this.scene.add
                    .text(this.player.x + 50, this.player.y - 30, "CRITIQUE!", {
                      fontSize: "18px",
                      fontFamily: "Arial",
                      color: "#f39c12",
                      stroke: "#000000",
                      strokeThickness: 3,
                    })
                    .setOrigin(0.5);

                  this.scene.tweens.add({
                    targets: critText,
                    y: critText.y - 30,
                    alpha: 0,
                    duration: 1000,
                    onComplete: () => critText.destroy(),
                  });
                },
              });

              // Est-ce que l'attaque spéciale touche?
              if (Math.random() < attackHitRate * 0.9) {
                // Attaques spéciales légèrement moins précises
                // Calculer les dégâts (doublés pour l'attaque spéciale)
                const damage = playerAttack * 2 * (0.9 + Math.random() * 0.2);
                bossHealth -= damage;

                // Affichage des dégâts
                this.showDamageNumber(
                  this.boss.x,
                  this.boss.y,
                  Math.floor(damage),
                  0xf39c12
                );

                // Recul du boss
                this.scene.tweens.add({
                  targets: this.boss,
                  x: this.boss.x + 20,
                  angle: 5,
                  duration: 100,
                  yoyo: true,
                  repeat: 1,
                });
              } else {
                // Attaque spéciale manquée
                this.showMissText(this.boss.x, this.boss.y);
              }
            } else {
              // Attaque normale
              this.scene.tweens.add({
                targets: this.player,
                x: this.player.x + 50,
                duration: 200,
                yoyo: true,
                ease: "Power1",
                onStart: () => {
                  // Effet de particules
                  this.attackEmitter.setPosition(
                    this.player.x + 20,
                    this.player.y
                  );
                  this.attackEmitter.explode(10);
                },
              });

              // Est-ce que l'attaque touche?
              if (Math.random() < attackHitRate) {
                // Calculer les dégâts
                const damage = playerAttack * (0.8 + Math.random() * 0.4);
                bossHealth -= damage;

                // Affichage des dégâts
                this.showDamageNumber(
                  this.boss.x,
                  this.boss.y,
                  Math.floor(damage)
                );

                // Léger recul du boss
                this.scene.tweens.add({
                  targets: this.boss,
                  x: this.boss.x + 10,
                  duration: 100,
                  yoyo: true,
                });
              } else {
                // Attaque manquée
                this.showMissText(this.boss.x, this.boss.y);
              }
            }
          }

          // Vérifier si le boss est entré en phase de rage
          if (!bossEnraged && bossHealth < maxBossHealth * 0.3) {
            bossEnraged = true;

            // Animation de rage
            this.infoText.setText("Le boss est enragé!");

            this.scene.tweens.add({
              targets: this.boss,
              tint: 0xff0000,
              scaleX: 1.2,
              scaleY: 1.2,
              duration: 500,
              onComplete: () => {
                this.scene.tweens.add({
                  targets: this.infoText,
                  alpha: 0,
                  duration: 1000,
                  delay: 1000,
                });
              },
            });

            // Effet de particules pour la rage
            const rageParticles = this.particles.createEmitter({
              speed: { min: 50, max: 100 },
              scale: { start: 0.4, end: 0 },
              blendMode: "ADD",
              tint: 0xff0000,
              lifespan: 1000,
              frequency: 50,
            });

            rageParticles.setPosition(this.boss.x, this.boss.y);
            rageParticles.setParticles(
              this.scene.add.circle(0, 0, 5, 0xffffff)
            );

            // Arrêter les particules après quelques secondes
            this.scene.time.delayedCall(3000, () => {
              rageParticles.stop();
            });
          }

          // Attaque du boss (plus fréquente si enragé)
          const bossWillAttack = bossEnraged
            ? Math.random() < 0.8
            : Math.random() < 0.6;

          if (bossWillAttack) {
            // Animation d'attaque du boss
            this.scene.tweens.add({
              targets: this.boss,
              x: this.boss.x - 70,
              duration: bossEnraged ? 300 : 400,
              yoyo: true,
              ease: "Back",
              onStart: () => {
                // Effet de particules pour l'attaque du boss
                this.bossAttackEmitter.setPosition(
                  this.boss.x - 30,
                  this.boss.y
                );
                this.bossAttackEmitter.setAngle({ min: 150, max: 210 });
                this.bossAttackEmitter.explode(bossEnraged ? 15 : 10);
              },
            });

            // Est-ce que le joueur esquive?
            if (Math.random() < dodgeRate) {
              dodgeCount++;

              // Animation d'esquive
              this.scene.tweens.add({
                targets: this.player,
                y: this.player.y + 50,
                duration: 200,
                yoyo: true,
                onComplete: () => {
                  // Texte "Esquivé!"
                  const dodgeText = this.scene.add
                    .text(this.player.x, this.player.y - 30, "Esquivé!", {
                      fontSize: "16px",
                      fontFamily: "Arial",
                      color: "#ffffff",
                    })
                    .setOrigin(0.5);

                  this.scene.tweens.add({
                    targets: dodgeText,
                    y: dodgeText.y - 20,
                    alpha: 0,
                    duration: 800,
                    onComplete: () => dodgeText.destroy(),
                  });
                },
              });
            } else {
              // Calculer les dégâts du boss (augmentés si enragé)
              const damage = bossEnraged
                ? bossAttack * 1.5 * (0.9 + Math.random() * 0.2)
                : bossAttack * (0.8 + Math.random() * 0.4);

              playerHealth -= damage;

              // Affichage des dégâts
              this.showDamageNumber(
                this.player.x,
                this.player.y,
                Math.floor(damage),
                0xe74c3c
              );

              // Animation d'impact
              this.scene.tweens.add({
                targets: this.player,
                angle: bossEnraged ? 20 : 10,
                duration: 100,
                yoyo: true,
                repeat: 1,
              });
            }
          }

          // Mettre à jour les barres de vie
          this.playerHealthBar.width = Math.max(0, playerHealth);
          this.bossHealthBar.width = Math.max(
            0,
            (bossHealth / maxBossHealth) * this.bossHealthBg.width
          );

          // Mettre à jour le texte des stats
          this.statsText.setText(
            `Attaques: ${attackCount} | Spéciales: ${specialAttackCount} | Esquives: ${dodgeCount}`
          );

          // Vérifier si le combat est terminé
          if (bossHealth <= 0) {
            // Victoire !
            this.infoText.setText("Victoire !");
            this.infoText.setAlpha(1);

            // Animation de défaite du boss
            this.scene.tweens.add({
              targets: this.boss,
              alpha: 0,
              angle: 90,
              y: this.boss.y + 50,
              duration: 1000,
              ease: "Power2",
              onComplete: () => {
                this.levelCompleted(true);
              },
            });

            // Effet de particules pour la victoire
            for (let i = 0; i < 5; i++) {
              this.scene.time.delayedCall(i * 200, () => {
                const explosion = this.particles.createEmitter({
                  x: this.boss.x + (Math.random() * 100 - 50),
                  y: this.boss.y + (Math.random() * 100 - 50),
                  speed: { min: 30, max: 80 },
                  angle: { min: 0, max: 360 },
                  scale: { start: 0.5, end: 0 },
                  blendMode: "SCREEN",
                  tint: [0xe74c3c, 0xf39c12, 0xf1c40f],
                  lifespan: 1000,
                });

                explosion.setParticles(
                  this.scene.add.circle(0, 0, 8, 0xffffff)
                );
                explosion.explode(20);
              });
            }

            // Arrêter la simulation
            this.simulationTimer.remove();
          } else if (playerHealth <= 0) {
            // Défaite
            this.infoText.setText("Défaite...");
            this.infoText.setAlpha(1);

            // Animation de défaite du joueur
            this.scene.tweens.add({
              targets: this.player,
              alpha: 0,
              angle: 90,
              y: this.player.y + 30,
              duration: 800,
              ease: "Power2",
              onComplete: () => {
                this.levelCompleted(false);
              },
            });

            // Arrêter la simulation
            this.simulationTimer.remove();
          }
        }
      },
      callbackScope: this,
      loop: true,
    });
  }

  /**
   * Affiche un nombre de dégâts à une position donnée
   * @param {number} x - Position X
   * @param {number} y - Position Y
   * @param {number} amount - Montant des dégâts
   * @param {number} color - Couleur du texte (optionnel)
   */
  showDamageNumber(x, y, amount, color = 0xffffff) {
    const damageText = this.scene.add
      .text(x, y, `-${amount}`, {
        fontSize: "18px",
        fontFamily: "Arial",
        color: color ? `#${color.toString(16)}` : "#ffffff",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    this.scene.tweens.add({
      targets: damageText,
      y: damageText.y - 40,
      alpha: 0,
      duration: 1000,
      onComplete: () => damageText.destroy(),
    });
  }

  /**
   * Affiche un texte "Raté" à une position donnée
   * @param {number} x - Position X
   * @param {number} y - Position Y
   */
  showMissText(x, y) {
    const missText = this.scene.add
      .text(x, y, "Raté!", {
        fontSize: "16px",
        fontFamily: "Arial",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.scene.tweens.add({
      targets: missText,
      y: missText.y - 20,
      alpha: 0,
      duration: 800,
      onComplete: () => missText.destroy(),
    });
  }

  /**
   * Finalise le niveau et génère le feedback du joueur
   * @param {boolean} victory - Si le joueur a gagné ou non
   */
  levelCompleted(victory) {
    if (victory) {
      const settings = this.settings;
      const difficultyRatio = settings.bossHealth / settings.playerAttack / 10;

      if (difficultyRatio < 3) {
        this.levelData.playerFeedback =
          "Ce boss était ridiculement facile ! Aucun challenge, je l'ai battu sans effort. Il lui faut beaucoup plus de vie ou d'attaque.";
      } else if (difficultyRatio < 4) {
        this.levelData.playerFeedback =
          "Le boss était assez facile, je n'ai jamais été en danger. Un peu plus de difficulté rendrait le combat plus intéressant.";
      } else if (difficultyRatio < 5) {
        this.levelData.playerFeedback =
          "Combat agréable mais un poil trop simple. Le boss pourrait être légèrement plus puissant.";
      } else if (difficultyRatio < 6.5) {
        this.levelData.playerFeedback =
          "Super combat ! Le boss était difficile mais pas impossible. Le niveau est parfaitement équilibré.";
        this.levelData.balanced = true;
      } else if (difficultyRatio < 8) {
        this.levelData.playerFeedback =
          "Un combat intense et équilibré ! J'ai dû utiliser toutes mes capacités pour vaincre ce boss.";
        this.levelData.balanced = true;
      } else if (difficultyRatio < 10) {
        this.levelData.playerFeedback =
          "Ce boss était vraiment difficile ! C'était un défi stimulant qui a testé mes limites, mais j'ai réussi.";
        this.levelData.balanced = true;
      } else {
        this.levelData.playerFeedback =
          "Ce boss était BEAUCOUP trop difficile ! J'ai eu de la chance de gagner. Il faudrait réduire sa vie ou augmenter les dégâts du joueur.";
      }
    } else {
      // Feedback en cas de défaite
      const settings = this.settings;
      const difficultyRatio =
        ((settings.bossAttack / 100) * settings.bossHealth) / 300;

      if (difficultyRatio > 5) {
        this.levelData.playerFeedback =
          "Ce boss est complètement impossible ! Il fait beaucoup trop de dégâts et a trop de vie. C'est frustrant et pas amusant.";
      } else if (difficultyRatio > 3.5) {
        this.levelData.playerFeedback =
          "Le boss est vraiment trop difficile. Il faudrait réduire un peu sa puissance ou sa vie pour que le combat soit jouable.";
      } else if (difficultyRatio > 2) {
        this.levelData.playerFeedback =
          "J'étais proche de réussir ! Le boss est difficile mais avec un peu d'entraînement je pourrais le battre. Bon équilibre.";
        this.levelData.balanced = true;
      } else {
        this.levelData.playerFeedback =
          "J'ai perdu, mais le combat était équilibré. Avec de meilleures esquives j'aurais pu gagner. C'est un bon niveau de difficulté.";
        this.levelData.balanced = true;
      }
    }

    this.levelData.completed = true;
    this.completeSimulation(victory);
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
