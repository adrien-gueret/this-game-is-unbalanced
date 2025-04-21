/**
 * BossSimulation - Simulation d'un niveau de boss
 *
 * Cette classe gère la simulation des niveaux de type boss avec un combat au tour par tour.
 */
class BossSimulation {
  constructor(scene) {
    this.scene = scene;
    this.messageQueue = [];
    this.isAnimatingMessage = false;
    this.logBackGrounds = null;
    this.logTextObjects = [];
  }

  async startLevel(level) {
    const { width, height } = this.scene.cameras.main;

    // Enregistrer les animations via AnimationManager
    AnimationManager.registerAnimations(this.scene);

    // Initialiser le joueur et le boss
    const { player, ennemy } = this.setupFighters(level);

    // Afficher l'interface de combat
    this.createBattleUI({ width, height, player, ennemy });

    showMessage(
      this.scene,
      window.i18n.get("watchInstruction"),
      "#ffffff",
      () => {
        this.logBackGrounds.setAlpha(1);
        this.processTurn({ level, player, ennemy, isPlayerTurn: true });
      },
      window.i18n.get("clickToStart")
    );
  }

  setupFighters(level) {
    const { width, height } = this.scene.cameras.main;

    const playerX = width * 0.29;
    const playerY = height * 0.72;

    const bossX = width * 0.73;
    const bossY = height * 0.68;

    // Créer le joueur
    const player = {
      name: "Potimonstre",
      sprite: this.scene.add
        .sprite(playerX, playerY, "player-boss", 0)
        .setScale(3),
      life: level.settings.playerLife.value,
      maxLife: level.settings.playerLife.value,
      type: "player",
    };

    player.sprite.anims.play("player-idle", true);

    // Créer l'ennemi
    const ennemy = {
      name: "Potiblob",
      sprite: this.scene.add.sprite(bossX, bossY, "slime-boss", 0).setScale(3),
      life: level.settings.bossLife.value,
      maxLife: level.settings.bossLife.value,
      type: "ennemy",
    };

    ennemy.sprite.anims.play("blob-idle", true);

    return { player, ennemy };
  }

  createBattleUI({ width, height, player, ennemy }) {
    // Fond semi-transparent pour le log de combat
    const logBackGrounds = this.scene.add.graphics();
    logBackGrounds
      .fillStyle(0x000000, 0.7)
      .fillRoundedRect(width * 0.05, 90, width * 0.9, height * 0.17, 8);

    logBackGrounds.setAlpha(0);

    this.logBackGrounds = logBackGrounds;

    const logAreaTop = 90;
    const logAreaHeight = height * 0.2;
    const lineHeight = 25;
    const totalTextHeight = 4 * lineHeight;
    const verticalOffset = lineHeight + 6;
    const startY =
      logAreaTop +
      (logAreaHeight - totalTextHeight) / 2 -
      verticalOffset +
      lineHeight / 2;

    for (let i = 0; i < 4; i++) {
      const logLine = this.scene.add
        .text(width * 0.1, startY + i * lineHeight, "", {
          fontSize: "18px",
          fontFamily: "Arial",
          color: "#ffffff",
          wordWrap: { width: width * 0.8 },
        })
        .setAlpha(0);

      this.logTextObjects.push(logLine);
    }

    // Barre de vie du joueur
    this.createHealthBar(player);

    // Barre de vie du boss
    this.createHealthBar(ennemy);
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

      const ratio = character.life / character.maxLife;
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
      .text(
        x,
        y,
        `${character.name} - ${character.life}/${character.maxLife}`,
        {
          fontSize: "16px",
          fontFamily: "Arial, sans-serif",
          fontWeight: "bold",
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 4,
          align: "center",
        }
      )
      .setOrigin(0.5, 0.5);
    healthBarGroup.add(healthText);

    // Stocker les références pour mise à jour
    character.healthBar = {
      group: healthBarGroup,
      bar: healthBar,
      text: healthText,
      currentValue: character.life,
      update: () => {
        // Animation lors d'une perte de points de vie
        if (character.life < character.healthBar.currentValue) {
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
          currentValue: character.life,
          duration: 300,
          ease: "Power2",
          onUpdate: () => {
            updateHealthBar();
            // Mettre à jour le texte
            healthText.setText(
              `${character.name} - ${Math.ceil(
                character.healthBar.currentValue
              )}/${character.maxLife}`
            );
          },
        });
      },
    };

    return character.healthBar;
  }

  /**
   * Gère la logique d'un tour de combat
   */
  async processTurn({ level, player, ennemy, isPlayerTurn = true }) {
    await this.performAttack({
      player,
      ennemy,
      isPlayerTurn,
      level,
    });

    if (player.life <= 0) {
      this.completeSimulation("DEFEAT", {
        player,
        ennemy,
        level,
      });
      return;
    }

    if (ennemy.life <= 0) {
      this.completeSimulation("SUCCESS", {
        player,
        ennemy,
        level,
      });
      return;
    }

    this.scene.time.delayedCall(1000, () => {
      this.processTurn({ level, player, ennemy, isPlayerTurn: !isPlayerTurn });
    });
  }

  /**
   * Effectue une attaque
   */
  performAttack({ player, ennemy, isPlayerTurn, level }) {
    const attacker = isPlayerTurn ? player : ennemy;
    const target = isPlayerTurn ? ennemy : player;

    // Vérifier si coup critique
    const criticalChance =
      attacker.type === "player"
        ? level.settings.playerCriticalChance.value / 100
        : level.settings.bossCriticalChance.value / 100;

    const isCritical = Math.random() < criticalChance;

    const attack =
      attacker.type === "player"
        ? level.settings.playerAttack.value
        : level.settings.bossAttack.value;

    const defense =
      target.type === "player"
        ? level.settings.playerDefense.value
        : level.settings.bossDefense.value;

    // Calculer les dégâts
    let damage = attack - (attack * defense) / 100;
    damage = Math.max(1, Math.floor(damage)); // Minimum 1 dégât

    if (isCritical) {
      damage *= 2; // Dégâts doublés pour un coup critique
      this.addToBattleLog(`${attacker.name} porte un coup critique !`);
    }

    return new Promise((resolve) => {
      const moveDistance = 30; // Pixels à se déplacer

      // Animer l'attaquant qui se déplace pour attaquer
      this.scene.tweens.add({
        targets: attacker.sprite,
        x:
          attacker.sprite.x +
          moveDistance * (attacker.type === "player" ? 1 : -1),
        duration: 100,
        ease: "Cubic.easeOut", // Mouvement rapide vers l'avant
        yoyo: true, // Retour à la position originale
        hold: 50, // Pause brève en position d'attaque
        yoyoEase: "Cubic.easeIn", // Retour plus lent pour un mouvement naturel
        onComplete: () => {
          // Appliquer les dégâts après l'animation
          this.inflictDamage(attacker, target, damage);
          resolve();
        },
      });
    });
  }

  /**
   * Inflige des dégâts à une cible
   */
  inflictDamage(attacker, target, damage) {
    // Appliquer les dégâts
    target.life = Math.max(0, target.life - damage);

    // Mettre à jour la barre de vie
    target.healthBar.update();

    // Ajouter l'action au log de combat
    this.addToBattleLog(
      `${attacker.name} inflige ${damage} points de dégâts à ${target.name}!`
    );

    const idleAnimation =
      target.type === "player" ? "player-idle" : "blob-idle";

    // Affiche la frame 2 (blessé)
    target.sprite.setFrame(2);

    // Ne revenir à l'animation idle que si la cible n'est pas vaincue
    if (target.life > 0) {
      this.scene.time.delayedCall(500, () => {
        if (target.life > 0) {
          // Double vérification, la cible est toujours vivante
          target.sprite.anims.play(idleAnimation, true);
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
    // Ajouter le message à la file d'attente
    this.messageQueue.push(message);

    // Si aucune animation n'est en cours, démarrer l'animation
    if (!this.isAnimatingMessage) {
      this.processNextMessage();
    }
  }

  /**
   * Traiter le prochain message dans la file d'attente
   */
  processNextMessage() {
    if (this.messageQueue.length === 0) {
      this.isAnimatingMessage = false;
      return;
    }

    this.isAnimatingMessage = true;
    const message = this.messageQueue.shift();

    // Calculer la hauteur d'une ligne
    const lineHeight =
      this.logTextObjects.length > 1
        ? this.logTextObjects[1].y - this.logTextObjects[0].y
        : 25;

    // Sauvegarder les positions Y de base (pour éviter le cumul d'erreurs d'arrondi)
    if (!this._logBaseYs) {
      this._logBaseYs = this.logTextObjects.map((obj) => obj.y);
    }

    // 1. Préparer la nouvelle ligne tout en bas, hors de la zone
    const lastIdx = this.logTextObjects.length - 1;
    const lastTextObj = this.logTextObjects[lastIdx];
    lastTextObj.setText(message);
    lastTextObj.setAlpha(1);
    lastTextObj.y = this._logBaseYs[lastIdx] + lineHeight;

    // 2. Animer toutes les lignes vers le haut, en utilisant les positions de base
    for (let i = 0; i < this.logTextObjects.length; i++) {
      const textObj = this.logTextObjects[i];
      const targetY = this._logBaseYs[i];
      this.scene.tweens.add({
        targets: textObj,
        y: targetY,
        alpha: i === 0 ? 0 : 1,
        duration: 350,
        ease: "Power2",
        onComplete:
          i === 0
            ? () => {
                // Après animation, effacer le texte et replacer tout en bas pour le prochain cycle
                textObj.setText("");
                textObj.y = this._logBaseYs[lastIdx] + lineHeight;
                textObj.setAlpha(1);
              }
            : undefined,
      });
    }

    // 3. Décaler le tableau pour que l'ordre logique corresponde à l'affichage
    const firstObj = this.logTextObjects.shift();
    this.logTextObjects.push(firstObj);

    // 5. Attendre la fin de l'animation avant de traiter le message suivant
    this.scene.time.delayedCall(370, () => {
      if (this.messageQueue.length > 0) {
        this.processNextMessage();
      } else {
        this.isAnimatingMessage = false;
      }
    });
  }

  /**
   * Termine la simulation
   */
  completeSimulation(finishReason, { player, ennemy, level }) {
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

        // Afficher la frame 3 du boss (défaite)
        ennemy.sprite.anims.stop();
        ennemy.sprite.setFrame(3);

        // Jouer l'animation de victoire pour le joueur
        player.sprite.anims.play("player-happy", true);

        // Décider si c'était équilibré basé sur le temps et la santé restante
        const healthRatio = player.life / player.maxLife;

        switch (level.getDifficulty()) {
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

        // Afficher la frame 3 du joueur (défaite)
        player.sprite.anims.stop();
        player.sprite.setFrame(3);

        // Jouer l'animation d'idle pour le boss victorieux
        ennemy.sprite.anims.play("blob-happy", true);
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
