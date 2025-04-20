/**
 * BossSimulation - Simulation d'un niveau de boss
 *
 * Cette classe gère la simulation des niveaux de type boss avec un combat au tour par tour.
 */
class BossSimulation {
  constructor(scene) {
    this.scene = scene;
    this.timerValue = 0;
    this.simulationTimer = null;
    this.player = null;
    this.boss = null;
    this.isPlayerTurn = true;
    this.turnCount = 0;
    this.actionDelay = 1000; // Délai entre les actions en ms
    this.battleLog = [];
    this.battleLogText = null;
    this.playerHealthBar = null;
    this.bossHealthBar = null;
  }

  async startLevel(level) {
    const { width, height } = this.scene.cameras.main;

    // Initialiser le joueur et le boss
    this.setupCombatants(level);

    // Afficher l'interface de combat
    this.createBattleUI(width, height);

    level.start({
      scene: this.scene,
    });

    showMessage(
      this.scene,
      "Observe le combat au tour par tour!",
      "#ffffff",
      () => {
        this.startSimulation(level);
      },
      "Cliquer pour commencer"
    );
  }

  /**
   * Configure le joueur et le boss avec leurs statistiques
   */
  setupCombatants(level) {
    const { width, height } = this.scene.cameras.main;

    const playerX = width * 0.29;
    const playerY = height * 0.72;

    const bossX = width * 0.73;
    const bossY = height * 0.64;
    // Créer le joueur
    this.player = {
      name: "Potimonstre",
      sprite: this.scene.add
        .sprite(playerX, playerY, "player-platforms", 0)
        .setScale(3),
      maxHp: 100,
      hp: 100,
      attack: 20,
      defense: 10,
      speed: 15,
      specialAttackChance: 0.3,
      specialAttackPower: 2,
      criticalHitChance: 0.1,
      criticalHitMultiplier: 1.5,
    };

    // Créer le boss
    this.boss = {
      name: "Gromonstre",
      sprite: this.scene.add.sprite(bossX, bossY, "boss", 0).setScale(4),
      maxHp: 200,
      hp: 200,
      attack: 15,
      defense: 8,
      speed: 10,
      specialAttackChance: 0.25,
      specialAttackPower: 2.2,
      enrageThreshold: 0.3, // S'enrage à 30% de vie
      isEnraged: false,
    };
  }

  /**
   * Crée l'interface utilisateur du combat
   */
  createBattleUI(width, height) {
    // Fond semi-transparent pour le log de combat
    const logBackGrounds = this.scene.add.graphics();
    logBackGrounds
      .fillStyle(0x000000, 0.7)
      .fillRoundedRect(width * 0.05, 90, width * 0.9, height * 0.2, 8);

    // Texte pour le log de combat
    this.battleLogText = this.scene.add.text(
      width * 0.1,
      height * 0.18,
      "Le combat commence!",
      {
        fontSize: "18px",
        fontFamily: "Arial",
        color: "#ffffff",
        wordWrap: { width: width * 0.8 },
      }
    );

    // Barre de vie du joueur
    this.createHealthBar(this.player);

    // Barre de vie du boss
    this.createHealthBar(this.boss);
  }

  /**
   * Crée une barre de vie pour un combattant
   */
  createHealthBar(character) {
    const barWidth = 200;
    const barHeight = 25; // Hauteur augmentée pour plus de visibilité
    const x = character.sprite.x;
    const y = character.sprite.y + character.sprite.displayHeight;

    // Groupe pour contenir tous les éléments de la barre de vie
    const healthBarGroup = this.scene.add.group();

    // Ombre portée
    const shadow = this.scene.add
      .rectangle(x + 4, y + 4, barWidth + 6, barHeight + 6, 0x000000, 0.3)
      .setOrigin(0.5, 0.5);
    healthBarGroup.add(shadow);

    // Bordure extérieure - même couleur pour tous
    const border = this.scene.add
      .rectangle(x, y, barWidth + 6, barHeight + 6, 0x333333)
      .setOrigin(0.5, 0.5);
    healthBarGroup.add(border);

    // Fond de la barre de vie (noir avec opacité)
    const background = this.scene.add
      .rectangle(x, y, barWidth, barHeight, 0x000000, 0.7)
      .setOrigin(0.5, 0.5);
    healthBarGroup.add(background);

    // Barre de vie avec dégradé
    const healthBar = this.scene.add.graphics();
    const updateHealthBar = () => {
      healthBar.clear();

      const ratio = character.hp / character.maxHp;
      const currentWidth = barWidth * ratio;

      // Définir les couleurs en fonction du pourcentage de vie
      let color;
      if (ratio > 0.6) {
        // Vert pour beaucoup de vie
        color = 0x00ff00;
      } else if (ratio > 0.3) {
        // Jaune/Orange pour vie moyenne
        color = 0xffcc00;
      } else {
        // Rouge pour peu de vie
        color = 0xff0000;
      }

      // Dessiner la barre de vie
      healthBar.fillStyle(color);
      healthBar.fillRect(
        x - barWidth / 2,
        y - barHeight / 2,
        currentWidth,
        barHeight
      );

      // Ajouter un effet de brillance
      healthBar.fillStyle(0xffffff, 0.3);
      healthBar.fillRect(
        x - barWidth / 2,
        y - barHeight / 2,
        currentWidth,
        barHeight / 4
      );
    };

    updateHealthBar();
    healthBarGroup.add(healthBar);

    // Texte du nom et HP avec un style amélioré
    const healthText = this.scene.add
      .text(x, y, `${character.name} - ${character.hp}/${character.maxHp}`, {
        fontSize: "16px",
        fontFamily: "Arial, sans-serif",
        fontWeight: "bold",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
        align: "center",
      })
      .setOrigin(0.5, 0.5);
    healthBarGroup.add(healthText);

    // Stocker les références pour mise à jour
    character.healthBar = {
      group: healthBarGroup,
      bar: healthBar,
      text: healthText,
      currentValue: character.hp,
      update: () => {
        // Animation lors d'une perte de points de vie
        if (character.hp < character.healthBar.currentValue) {
          // Flash rouge sur le personnage
          this.scene.tweens.add({
            targets: character.sprite,
            alpha: 0.6,
            duration: 50,
            yoyo: true,
            repeat: 2,
          });
        }

        // Mise à jour progressive de la barre
        this.scene.tweens.add({
          targets: character.healthBar,
          currentValue: character.hp,
          duration: 300,
          ease: "Power2",
          onUpdate: () => {
            updateHealthBar();
            // Mettre à jour le texte
            healthText.setText(
              `${character.name} - ${Math.ceil(
                character.healthBar.currentValue
              )}/${character.maxHp}`
            );
          },
        });
      },
    };

    return character.healthBar;
  }

  /**
   * Démarre la simulation du combat de boss
   */
  startSimulation(level) {
    const { height, width } = this.scene.cameras.main;

    // Définir une limite de temps par défaut si non spécifiée

    if (this.simulationTimer) {
      this.simulationTimer.remove();
    }

    // Minuteur de la simulation
    this.simulationTimer = this.scene.time.addEvent({
      delay: 16.6, // ~60 fps
      callback: () => {
        // TODO
      },
      callbackScope: this,
      loop: true,
    });

    // Démarrer le premier tour
    this.processTurn();
  }

  /**
   * Gère la logique d'un tour de combat
   */
  processTurn() {
    this.turnCount++;

    if (this.isPlayerTurn) {
      this.playerTurn();
    } else {
      this.bossTurn();
    }

    // Vérifier les conditions de fin de combat
    if (this.player.hp <= 0) {
      this.completeSimulation("DEFEAT", null, "medium");
      return;
    } else if (this.boss.hp <= 0) {
      this.completeSimulation("SUCCESS", null, "medium");
      return;
    }

    // Passer au tour suivant après un délai
    this.isPlayerTurn = !this.isPlayerTurn;
    this.scene.time.delayedCall(this.actionDelay, () => {
      this.processTurn();
    });
  }

  /**
   * Gère le tour du joueur
   */
  playerTurn() {
    // Vérifier si une attaque spéciale doit être utilisée
    const useSpecial = Math.random() < this.player.specialAttackChance;

    if (useSpecial) {
      this.performSpecialAttack(this.player, this.boss);
    } else {
      this.performBasicAttack(this.player, this.boss);
    }
  }

  /**
   * Gère le tour du boss
   */
  bossTurn() {
    // Vérifier si le boss doit s'enrager
    if (
      !this.boss.isEnraged &&
      this.boss.hp / this.boss.maxHp <= this.boss.enrageThreshold
    ) {
      this.boss.isEnraged = true;
      this.boss.attack *= 1.5;
      this.addToBattleLog("Le Boss s'enrage! Sa puissance augmente!");

      // Animation d'enrage si disponible
      if (this.scene.anims.exists("boss-enrage")) {
        this.boss.sprite.anims.play("boss-enrage", true);
        this.scene.time.delayedCall(500, () => {
          if (this.scene.anims.exists("boss-enraged-idle")) {
            this.boss.sprite.anims.play("boss-enraged-idle", true);
          }
        });
      }
      return;
    }

    // Choix de l'attaque
    const useSpecial =
      Math.random() <
      (this.boss.isEnraged
        ? this.boss.specialAttackChance * 1.5
        : this.boss.specialAttackChance);

    if (useSpecial) {
      this.performSpecialAttack(this.boss, this.player);
    } else {
      this.performBasicAttack(this.boss, this.player);
    }
  }

  /**
   * Effectue une attaque de base
   */
  performBasicAttack(attacker, target) {
    // Vérifier si coup critique
    const isCritical =
      attacker === this.player && Math.random() < attacker.criticalHitChance;

    // Calculer les dégâts
    let damage = attacker.attack - target.defense / 2;
    damage = Math.max(1, Math.floor(damage)); // Minimum 1 dégât

    if (isCritical) {
      damage = Math.floor(damage * attacker.criticalHitMultiplier);
      this.addToBattleLog(`${attacker.name} porte un coup critique!`);
    }

    this.inflictDamage(attacker, target, damage);

    // Animation d'attaque si disponible
    const animKey = attacker === this.player ? "player-attack" : "boss-attack";
    const idleAnimKey = attacker === this.player ? "player-idle" : "boss-idle";

    if (this.scene.anims.exists(animKey)) {
      attacker.sprite.anims.play(animKey, true);
      this.scene.time.delayedCall(500, () => {
        if (this.scene.anims.exists(idleAnimKey)) {
          attacker.sprite.anims.play(idleAnimKey, true);
        }
      });
    }
  }

  /**
   * Effectue une attaque spéciale
   */
  performSpecialAttack(attacker, target) {
    // Calculer les dégâts
    let damage =
      attacker.attack * attacker.specialAttackPower - target.defense / 3;
    damage = Math.max(5, Math.floor(damage)); // Minimum 5 dégâts

    if (attacker === this.player) {
      this.addToBattleLog(
        `${attacker.name} utilise une attaque spéciale puissante!`
      );
    } else {
      this.addToBattleLog(`${attacker.name} lance une attaque dévastatrice!`);
    }

    this.inflictDamage(attacker, target, damage);

    // Animation d'attaque spéciale si disponible
    const specialAnimKey =
      attacker === this.player ? "player-special" : "boss-special";
    const idleAnimKey =
      attacker === this.player
        ? "player-idle"
        : this.boss.isEnraged
        ? "boss-enraged-idle"
        : "boss-idle";

    if (this.scene.anims.exists(specialAnimKey)) {
      attacker.sprite.anims.play(specialAnimKey, true);
      this.scene.time.delayedCall(800, () => {
        if (this.scene.anims.exists(idleAnimKey)) {
          attacker.sprite.anims.play(idleAnimKey, true);
        }
      });
    }
  }

  /**
   * Inflige des dégâts à une cible
   */
  inflictDamage(attacker, target, damage) {
    // Appliquer les dégâts
    target.hp = Math.max(0, target.hp - damage);

    // Mettre à jour la barre de vie
    target.healthBar.update();

    // Ajouter l'action au log de combat
    this.addToBattleLog(
      `${attacker.name} inflige ${damage} points de dégâts à ${target.name}!`
    );

    // Animation de dégât si disponible
    const hurtAnimKey = target === this.player ? "player-hurt" : "boss-hurt";
    const idleAnimKey =
      target === this.player
        ? "player-idle"
        : this.boss.isEnraged
        ? "boss-enraged-idle"
        : "boss-idle";

    if (this.scene.anims.exists(hurtAnimKey)) {
      target.sprite.anims.play(hurtAnimKey, true);
      this.scene.time.delayedCall(300, () => {
        if (target.hp > 0 && this.scene.anims.exists(idleAnimKey)) {
          target.sprite.anims.play(idleAnimKey, true);
        }
      });
    }

    // Effet visuel de dégâts
    this.scene.tweens.add({
      targets: target.sprite,
      alpha: 0.5,
      duration: 100,
      yoyo: true,
    });
  }

  /**
   * Ajoute une entrée au log de combat
   */
  addToBattleLog(message) {
    this.battleLog.push(message);

    // Limiter la taille du log
    if (this.battleLog.length > 4) {
      this.battleLog.shift();
    }

    // Mettre à jour l'affichage du log
    this.battleLogText.setText(this.battleLog.join("\n"));
  }

  /**
   * Termine la simulation
   */
  completeSimulation(finishReason, timeLimit, difficulty = "medium") {
    if (this.simulationTimer) {
      this.simulationTimer.remove();
    }

    let isBalanced = false;
    let feedback = "";
    let monsterAnimation = undefined;
    let monsterStaticFrame = undefined;

    // Variable pour stocker le message à afficher
    let message = "";
    let messageColor = "#ffffff";

    switch (finishReason) {
      case "SUCCESS":
        message = "Victoire! Le Boss a été vaincu!";
        messageColor = "#7CFC00";

        // Décider si c'était équilibré basé sur le temps et la santé restante
        const healthRatio = this.player.hp / this.player.maxHp;

        switch (difficulty) {
          case "easy":
            feedback =
              "Ce combat était trop facile. Le joueur a à peine été touché.";
            monsterAnimation = "oopsy";
            break;

          case "hard":
            feedback =
              "Ce combat était trop difficile. Le joueur a eu beaucoup de chance de survivre.";
            monsterStaticFrame = 6;
            break;

          case "medium":
            if (healthRatio > 0.7) {
              feedback =
                "Le joueur a gagné trop facilement, rendez le Boss plus puissant.";
              monsterAnimation = "oopsy";
            } else if (healthRatio < 0.2) {
              feedback =
                "C'était une victoire de justesse, le Boss est presque trop fort.";
              monsterStaticFrame = 6;
            } else {
              feedback =
                "Combat parfaitement équilibré! Un défi intéressant mais juste.";
              monsterAnimation = "happy";
              isBalanced = true;
            }
            break;
        }
        break;

      case "DEFEAT":
        message = "Défaite! Le Héros a été vaincu!";
        messageColor = "#FF6347";
        feedback =
          "Le Boss est trop puissant. Réduisez sa force ou augmentez celle du Héros.";
        monsterAnimation = "angry";
        break;

      case "TIMEOUT":
        message = "Temps écoulé! Le combat s'éternise...";
        messageColor = "#FFA500";
        feedback =
          "Le combat est trop long. Augmentez les dégâts pour que ça se termine plus vite.";
        monsterAnimation = "sad";
        break;
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
