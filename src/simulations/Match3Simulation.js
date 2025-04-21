/**
 * Match3Simulation - Simulation d'un niveau de match3
 *
 * Cette classe gère la simulation des niveaux de type match 3.
 */
class Match3Simulation {
  constructor(scene) {
    this.scene = scene;
    this.timerValue = 0;
    this.simulationTimer = null;
    this.grid = [];
    this.gridSize = { rows: 8, cols: 8 };
    this.tileSize = 55; // Réduire la taille des tuiles pour éviter les débordements
    this.colors = ["red", "blue", "green", "yellow", "purple", "orange"];
    this.score = 0;
    this.targetScore = 0;
    this.matchesMade = 0;
    this.isSimulating = false;
    this.simulationSpeed = 1000; // ms entre les moves
    this.movesCount = 0; // Nombre de coups effectués
    this.movesLimit = 0; // Limite de coups autorisés
    this.comboMultiplier = 1; // Multiplicateur de combo initial
    this.isCombo = false; // Indique si un combo est en cours

    // Mappage des couleurs aux lignes de la spritesheet
    this.colorToFrame = {
      yellow: 0, // 1ère ligne (index 0)
      green: 5, // 2ème ligne (index 5)
      red: 10, // 3ème ligne (index 10)
      blue: 15, // 4ème ligne (index 15)
      purple: 20, // 5ème ligne (index 20)
      orange: 25, // 6ème ligne (index 25)
      // "marron": 30, // 7ème ligne (index 30) - non utilisée pour le moment
      // "blanc": 35,  // 8ème ligne (index 35) - non utilisée pour le moment
      // "noir": 40    // 9ème ligne (index 40) - non utilisée pour le moment
    };

    // Propriétés pour la main du joueur
    this.playerHand = null;
    this.handSpeed = 400; // Vitesse de déplacement de la main en pixels par seconde
    this.handSize = 32; // Taille ajustée à la taille du sprite (32px)
    this.isHandMoving = false;
    this.lastHandPosition = { x: 0, y: 0 }; // Propriété pour stocker la dernière position
  }

  async startLevel(level) {
    const { width, height } = this.scene.cameras.main;

    // Créer le conteneur de la grille avec un positionnement ajusté
    this.gridContainer = this.scene.add.container(
      width / 2 - (this.gridSize.cols * this.tileSize) / 2,
      height / 2 - (this.gridSize.rows * this.tileSize) / 2 + 50
    );

    // Initialiser la grille
    this.initializeGrid();

    // Configurer le score cible
    this.targetScore = level.settings.targetScore.value;

    // Configurer la limite de coups (à la place de la limite de temps)
    this.movesLimit = level.settings.movesLimit?.value || 20; // Valeur par défaut de 20 coups si non définie
    this.movesCount = 0;

    // Créer la main du joueur en utilisant la spritesheet "player-match3"
    this.playerHand = this.scene.add.sprite(0, 0, "player-match3", 0);
    this.playerHand.setScale(2); // Scale x2 pour une meilleure visibilité
    this.playerHand.setOrigin(0.5, 0.5); // Centre l'image

    // Positionner la main en dehors de la grille au départ
    this.playerHand.x = width / 2;
    this.playerHand.y = height - 50;

    // Initialiser la dernière position connue
    this.lastHandPosition = {
      x: this.playerHand.x,
      y: this.playerHand.y,
    };

    // Afficher le score avec position ajustée
    this.scoreText = this.scene.add
      .text(40, 100, `Score: ${this.score} / ${this.targetScore}`, {
        fontSize: "28px",
        fontFamily: "Arial",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0, 0.5);

    // Afficher le compteur de coups dès le début
    this.movesText = this.scene.add
      .text(width - 40, 100, `Coups: ${this.movesCount}/${this.movesLimit}`, {
        fontSize: "24px",
        fontFamily: "Arial",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(1, 0.5); // Aligné à droite

    level.start({
      scene: this.scene,
    });

    showMessage(
      this.scene,
      window.i18n.get("watchInstruction"),
      "#ffffff",
      () => {
        this.startSimulation(level);
      },
      window.i18n.get("clickToStart")
    );
  }

  /**
   * Initialise la grille avec des tuiles aléatoires
   */
  initializeGrid() {
    this.grid = [];

    // Créer une grille initiale
    for (let row = 0; row < this.gridSize.rows; row++) {
      this.grid[row] = [];
      for (let col = 0; col < this.gridSize.cols; col++) {
        // Sélectionner une couleur aléatoire
        const colorIndex = Math.floor(Math.random() * this.colors.length);
        const color = this.colors[colorIndex];
        // Créer une tuile avec cette couleur
        const tile = this.createTile(row, col, color);
        this.grid[row][col] = tile;
      }
    }

    // Vérifier qu'il n'y a pas de correspondances au départ
    this.resolveInitialMatches();
  }

  /**
   * Résout les correspondances initiales pour commencer avec une grille sans correspondances
   */
  resolveInitialMatches() {
    let hasMatches = true;
    while (hasMatches) {
      hasMatches = false;
      // Vérifier les correspondances horizontales et verticales
      for (let row = 0; row < this.gridSize.rows; row++) {
        for (let col = 0; col < this.gridSize.cols; col++) {
          // Vérifier horizontalement
          if (col < this.gridSize.cols - 2) {
            if (
              this.grid[row][col].color === this.grid[row][col + 1].color &&
              this.grid[row][col].color === this.grid[row][col + 2].color
            ) {
              const newColorIndex = Math.floor(
                Math.random() * this.colors.length
              );
              const newColor = this.colors[newColorIndex];
              // S'assurer que la nouvelle couleur est différente
              if (newColor === this.grid[row][col].color) {
                const nextIndex = (newColorIndex + 1) % this.colors.length;
                this.grid[row][col + 2].setColor(this.colors[nextIndex]);
              } else {
                this.grid[row][col + 2].setColor(newColor);
              }
              hasMatches = true;
            }
          }
          // Vérifier verticalement
          if (row < this.gridSize.rows - 2) {
            if (
              this.grid[row][col].color === this.grid[row + 1][col].color &&
              this.grid[row][col].color === this.grid[row + 2][col].color
            ) {
              const newColorIndex = Math.floor(
                Math.random() * this.colors.length
              );
              const newColor = this.colors[newColorIndex];
              // S'assurer que la nouvelle couleur est différente
              if (newColor === this.grid[row][col].color) {
                const nextIndex = (newColorIndex + 1) % this.colors.length;
                this.grid[row + 2][col].setColor(this.colors[nextIndex]);
              } else {
                this.grid[row + 2][col].setColor(newColor);
              }
              hasMatches = true;
            }
          }
        }
      }
    }
  }

  /**
   * Crée une tuile à une position spécifique avec une couleur donnée
   */
  createTile(row, col, color) {
    const x = col * this.tileSize + this.tileSize / 2;
    const y = row * this.tileSize + this.tileSize / 2;

    // Utiliser la spritesheet "tiles-match3" avec la frame correspondant à la couleur
    // La frame 1 de chaque couleur (+0 car index de la première frame = 0)
    const frameIndex = this.colorToFrame[color] + 0;

    // Créer le sprite
    const sprite = this.scene.add.sprite(0, 0, "tiles-match3", frameIndex);

    // Ajuster la taille du sprite pour correspondre à la taille de tuile désirée
    const scale = (this.tileSize - 12) / 32; // 32px = taille originale du sprite
    sprite.setScale(scale);

    // Créer un conteneur pour le sprite
    const container = this.scene.add.container(x, y, [sprite]);
    const tileWidth = this.tileSize - 12;
    const tileHeight = this.tileSize - 12;
    container.setSize(tileWidth, tileHeight);

    // Ajouter au conteneur de la grille
    this.gridContainer.add(container);

    // Propriétés additionnelles
    container.row = row;
    container.col = col;
    container.color = color;
    container.sprite = sprite; // Référence au sprite pour pouvoir changer la frame

    // Méthode pour changer la couleur de la tuile
    container.setColor = (newColor) => {
      container.color = newColor;
      // Mettre à jour le sprite avec la nouvelle couleur
      const newFrameIndex = this.colorToFrame[newColor] + 0;
      sprite.setFrame(newFrameIndex);
    };

    this.scene.applyGameMask(container);

    return container;
  }

  /**
   * Convertit une couleur nommée en valeur hexadécimale
   */
  getColorValue(color) {
    const colorValues = {
      red: 0xff0000,
      blue: 0x0000ff,
      green: 0x00ff00,
      yellow: 0xffff00,
      purple: 0x800080,
      orange: 0xffa500,
    };
    return colorValues[color] || 0xffffff;
  }

  /**
   * Démarre la simulation du niveau de match 3
   */
  startSimulation(level) {
    // Utiliser le texte de coups déjà créé au lieu d'en créer un nouveau
    if (this.simulationTimer) {
      this.simulationTimer.remove();
    }

    this.isSimulating = true;
    this.simulationSpeed = 1000;
    this.simulationTimer = this.scene.time.addEvent({
      delay: 16.6, // ~60 fps
      callback: () => {
        // Mise à jour du texte de coups
        this.movesText.setText(`Coups: ${this.movesCount}/${this.movesLimit}`);
        // Vérifier si le nombre de coups a atteint la limite
        if (this.movesCount >= this.movesLimit) {
          // Ajouter un délai pour laisser l'animation se terminer
          if (!this.isEndingSimulation) {
            this.isEndingSimulation = true;
            // Attendre 1 seconde avant d'afficher le message de fin
            this.scene.time.delayedCall(1000, () => {
              this.completeSimulation(
                "MOVES_DEPLETED",
                this.movesLimit,
                level.getDifficulty()
              );
            });
          }
          return;
        }
        // Vérifier si le score a atteint la cible
        if (this.score >= this.targetScore) {
          this.completeSimulation(
            "SUCCESS",
            this.movesLimit,
            level.getDifficulty()
          );
          return;
        }
      },
      callbackScope: this,
      loop: true,
    });

    // Démarrer la simulation d'IA
    this.simulateAIMove(level);
  }

  /**
   * Simule un coup joué par l'IA
   */
  simulateAIMove(level) {
    if (!this.isSimulating || this.isHandMoving || this.isEndingSimulation)
      return;

    // Trouver un mouvement possible
    const move = this.findBestMove();
    if (move) {
      // Ne pas incrémenter le compteur de coups ici
      // L'incrémentation se fera après la résolution des correspondances

      // Utiliser la main pour effectuer le mouvement
      this.moveHandAndSwapTiles(
        move.row1,
        move.col1,
        move.row2,
        move.col2,
        level
      );
    } else {
      // Si aucun mouvement trouvé, mélanger la grille
      this.shuffleGrid();
      // Continuer la simulation
      this.scene.time.delayedCall(this.simulationSpeed, () => {
        this.simulateAIMove(level);
      });
    }
  }

  /**
   * Déplace la main du joueur et effectue l'échange de tuiles
   */
  moveHandAndSwapTiles(row1, col1, row2, col2, level) {
    this.isHandMoving = true;

    // Calculer les positions des tuiles à échanger
    const tile1 = this.grid[row1][col1];
    const tile2 = this.grid[row2][col2];

    // Position globale de la première tuile
    const tile1Position = {
      x: this.gridContainer.x + col1 * this.tileSize + this.tileSize / 2,
      y: this.gridContainer.y + row1 * this.tileSize + this.tileSize / 2,
    };

    // Ajouter un décalage pour que la main "tienne" la tuile depuis son centre
    // Au lieu d'être directement sur la tuile
    const handOffset = {
      x: this.tileSize / 2, // Décalage horizontal (vers la droite)
      y: this.tileSize / 2, // Décalage vertical (vers le bas)
    };

    // Calculer la distance entre la dernière position de la main et la première tuile (avec offset)
    const distanceToTile1 = Phaser.Math.Distance.Between(
      this.lastHandPosition.x,
      this.lastHandPosition.y,
      tile1Position.x + handOffset.x,
      tile1Position.y + handOffset.y
    );

    // Calculer le temps de déplacement en fonction de la distance et de la vitesse
    const timeToTile1 = (distanceToTile1 / this.handSpeed) * 1000;

    // Utiliser la frame 0 (main inactive) pendant le déplacement
    this.playerHand.setFrame(0);

    // Déplacer la main vers la première tuile (avec offset)
    this.scene.tweens.add({
      targets: this.playerHand,
      x: tile1Position.x + handOffset.x,
      y: tile1Position.y + handOffset.y,
      duration: timeToTile1,
      onComplete: () => {
        // Mettre à jour la dernière position connue de la main
        this.lastHandPosition.x = tile1Position.x + handOffset.x;
        this.lastHandPosition.y = tile1Position.y + handOffset.y;

        // Changer l'aspect de la main lorsqu'elle sélectionne la tuile (frame 1)
        this.playerHand.setFrame(1);

        // Marquer la première tuile comme "sélectionnée" (changement visuel)
        this.highlightTile(tile1);

        // Ajouter un petit délai pour voir l'effet de la main qui "attrape" la tuile
        this.scene.time.delayedCall(200, () => {
          // Position globale de la deuxième tuile
          const tile2Position = {
            x: this.gridContainer.x + col2 * this.tileSize + this.tileSize / 2,
            y: this.gridContainer.y + row2 * this.tileSize + this.tileSize / 2,
          };

          // Calculer la distance entre la main et la deuxième tuile (avec offset)
          const distanceToTile2 = Phaser.Math.Distance.Between(
            this.playerHand.x,
            this.playerHand.y,
            tile2Position.x + handOffset.x,
            tile2Position.y + handOffset.y
          );

          // Calculer le temps de déplacement vers la deuxième tuile
          const timeToTile2 = (distanceToTile2 / this.handSpeed) * 1000;

          // Déplacer la main vers la deuxième tuile (avec offset)
          this.scene.tweens.add({
            targets: this.playerHand,
            x: tile2Position.x + handOffset.x,
            y: tile2Position.y + handOffset.y,
            duration: timeToTile2,
            onComplete: () => {
              // Mettre à jour la dernière position connue de la main
              this.lastHandPosition.x = tile2Position.x + handOffset.x;
              this.lastHandPosition.y = tile2Position.y + handOffset.y;

              // Marquer la deuxième tuile comme "sélectionnée"
              this.highlightTile(tile2);

              // Effectuer l'échange des tuiles
              this.swapTiles(row1, col1, row2, col2);

              // Revenir à la frame 0 après avoir effectué le mouvement
              this.scene.time.delayedCall(100, () => {
                this.playerHand.setFrame(0);
              });

              // Enlever les surlignages
              this.scene.time.delayedCall(200, () => {
                this.unhighlightTile(tile1);
                this.unhighlightTile(tile2);

                // Attendre un moment avant de résoudre les correspondances
                this.scene.time.delayedCall(300, () => {
                  // Vérifier et résoudre les correspondances
                  const matches = this.checkMatches();

                  if (matches.length > 0) {
                    this.resolveMatches(matches, level);
                  } else {
                    // Si pas de correspondance, échanger à nouveau les tuiles
                    this.swapTiles(row1, col1, row2, col2);

                    // Décrémenter le compteur de coups car le mouvement n'était pas valide
                    this.movesCount--;

                    // Ne pas ramener la main à sa position initiale, juste la laisser où elle est
                    this.isHandMoving = false;
                    this.scene.time.delayedCall(
                      this.simulationSpeed / 2,
                      () => {
                        this.simulateAIMove(level);
                      }
                    );
                  }
                });
              });
            },
          });
        });
      },
    });
  }

  /**
   * Surligne une tuile pour indiquer qu'elle est sélectionnée
   */
  highlightTile(tile) {
    // Stocker la scale originale
    tile.originalScale = tile.scale;
    // Agrandir légèrement la tuile
    this.scene.tweens.add({
      targets: tile,
      scale: tile.originalScale * 1.1,
      duration: 100,
    });
  }

  /**
   * Enlève le surlignage d'une tuile
   */
  unhighlightTile(tile) {
    if (tile.originalScale) {
      this.scene.tweens.add({
        targets: tile,
        scale: tile.originalScale,
        duration: 100,
      });
    }
  }

  /**
   * Trouve le meilleur mouvement possible
   */
  findBestMove() {
    const possibleMoves = [];

    // Vérifier tous les échanges horizontaux possibles
    for (let row = 0; row < this.gridSize.rows; row++) {
      for (let col = 0; col < this.gridSize.cols - 1; col++) {
        // Échanger temporairement
        const temp = this.grid[row][col].color;
        this.grid[row][col].color = this.grid[row][col + 1].color;
        this.grid[row][col + 1].color = temp;
        // Vérifier s'il y a une correspondance après l'échange
        if (this.hasMatch(row, col) || this.hasMatch(row, col + 1)) {
          possibleMoves.push({
            row1: row,
            col1: col,
            row2: row,
            col2: col + 1,
            score: this.evaluateMove(row, col, row, col + 1),
          });
        }
        // Rétablir l'état d'origine
        this.grid[row][col + 1].color = this.grid[row][col].color;
        this.grid[row][col].color = temp;
      }
    }

    // Vérifier tous les échanges verticaux possibles
    for (let row = 0; row < this.gridSize.rows - 1; row++) {
      for (let col = 0; col < this.gridSize.cols; col++) {
        // Échanger temporairement
        const temp = this.grid[row][col].color;
        this.grid[row][col].color = this.grid[row + 1][col].color;
        this.grid[row + 1][col].color = temp;
        // Vérifier s'il y a une correspondance après l'échange
        if (this.hasMatch(row, col) || this.hasMatch(row + 1, col)) {
          possibleMoves.push({
            row1: row,
            col1: col,
            row2: row + 1,
            col2: col,
            score: this.evaluateMove(row, col, row + 1, col),
          });
        }
        // Rétablir l'état d'origine
        this.grid[row + 1][col].color = this.grid[row][col].color;
        this.grid[row][col].color = temp;
      }
    }

    // Trier les mouvements par score
    possibleMoves.sort((a, b) => b.score - a.score);

    // Retourner le meilleur mouvement ou null si aucun mouvement possible
    return possibleMoves.length > 0 ? possibleMoves[0] : null;
  }

  /**
   * Évalue la qualité d'un mouvement
   */
  evaluateMove(row1, col1, row2, col2) {
    // Échanger temporairement
    const temp = this.grid[row1][col1].color;
    this.grid[row1][col1].color = this.grid[row2][col2].color;
    this.grid[row2][col2].color = temp;
    // Calculer les correspondances
    const matches = this.checkMatches();
    // Rétablir l'état d'origine
    this.grid[row2][col2].color = this.grid[row1][col1].color;
    this.grid[row1][col1].color = temp;
    // Attribuer un score basé sur le nombre de tuiles dans les correspondances
    let score = 0;
    for (const match of matches) {
      score += match.tiles.length;
    }
    return score;
  }

  /**
   * Vérifie s'il y a une correspondance à partir d'une position
   */
  hasMatch(row, col) {
    const color = this.grid[row][col].color;
    // Vérifier horizontalement
    let count = 1;
    // Vérifier à gauche
    for (let c = col - 1; c >= 0 && this.grid[row][c].color === color; c--) {
      count++;
    }
    // Vérifier à droite
    for (
      let c = col + 1;
      c < this.gridSize.cols && this.grid[row][c].color === color;
      c++
    ) {
      count++;
    }
    if (count >= 3) return true;
    // Vérifier verticalement
    count = 1;
    // Vérifier en haut
    for (let r = row - 1; r >= 0 && this.grid[r][col].color === color; r--) {
      count++;
    }
    // Vérifier en bas
    for (
      let r = row + 1;
      r < this.gridSize.rows && this.grid[r][col].color === color;
      r++
    ) {
      count++;
    }
    if (count >= 3) return true;
    return false;
  }

  /**
   * Échange deux tuiles sur la grille
   */
  swapTiles(row1, col1, row2, col2) {
    const tile1 = this.grid[row1][col1];
    const tile2 = this.grid[row2][col2];
    // Stocker les positions initiales
    const x1 = tile1.x;
    const y1 = tile1.y;
    const x2 = tile2.x;
    const y2 = tile2.y;

    // Changer la frame des tuiles pour l'animation de déplacement (frame 4)
    const frame1 = this.colorToFrame[tile1.color] + 3; // +3 pour obtenir la frame 4 (index 3)
    const frame2 = this.colorToFrame[tile2.color] + 3;
    tile1.sprite.setFrame(frame1);
    tile2.sprite.setFrame(frame2);

    // Animer l'échange
    this.scene.tweens.add({
      targets: tile1,
      x: x2,
      y: y2,
      duration: 200,
      ease: "Cubic.easeOut",
      onComplete: () => {
        // Revenir à la frame normale (frame 1) après le déplacement
        const normalFrame1 = this.colorToFrame[tile1.color] + 0;
        tile1.sprite.setFrame(normalFrame1);
      },
    });

    this.scene.tweens.add({
      targets: tile2,
      x: x1,
      y: y1,
      duration: 200,
      ease: "Cubic.easeOut",
      onComplete: () => {
        // Revenir à la frame normale (frame 1) après le déplacement
        const normalFrame2 = this.colorToFrame[tile2.color] + 0;
        tile2.sprite.setFrame(normalFrame2);
      },
    });

    // Mettre à jour la grille
    this.grid[row1][col1] = tile2;
    this.grid[row2][col2] = tile1;
    // Mettre à jour les propriétés des tuiles
    tile1.row = row2;
    tile1.col = col2;
    tile2.row = row1;
    tile2.col = col1;
  }

  /**
   * Vérifie toutes les correspondances sur la grille
   */
  checkMatches() {
    const matches = [];

    // Vérifier les correspondances horizontales
    for (let row = 0; row < this.gridSize.rows; row++) {
      let col = 0;
      while (col < this.gridSize.cols - 2) {
        const color = this.grid[row][col].color;
        let matchLength = 1;
        // Compter les tuiles consécutives de même couleur
        while (
          col + matchLength < this.gridSize.cols &&
          this.grid[row][col + matchLength].color === color
        ) {
          matchLength++;
        }
        // Si correspondance de 3 ou plus
        if (matchLength >= 3) {
          const tiles = [];
          for (let i = 0; i < matchLength; i++) {
            tiles.push(this.grid[row][col + i]);
          }
          matches.push({ tiles, orientation: "horizontal" });
          col += matchLength;
        } else {
          col++;
        }
      }
    }

    // Vérifier les correspondances verticales
    for (let col = 0; col < this.gridSize.cols; col++) {
      let row = 0;
      while (row < this.gridSize.rows - 2) {
        const color = this.grid[row][col].color;
        let matchLength = 1;
        // Compter les tuiles consécutives de même couleur
        while (
          row + matchLength < this.gridSize.rows &&
          this.grid[row + matchLength][col].color === color
        ) {
          matchLength++;
        }
        // Si correspondance de 3 ou plus
        if (matchLength >= 3) {
          const tiles = [];
          for (let i = 0; i < matchLength; i++) {
            tiles.push(this.grid[row + i][col]);
          }
          matches.push({ tiles, orientation: "vertical" });
          row += matchLength;
        } else {
          row++;
        }
      }
    }

    return matches;
  }

  /**
   * Résout les correspondances trouvées
   */
  resolveMatches(matches, level) {
    if (!this.isSimulating) return;

    // Mettre à jour le nombre de correspondances
    this.matchesMade += matches.length;

    // Points à ajouter
    let pointsToAdd = 0;

    // Si c'est un combo (résolution de correspondances en chaîne), augmenter le multiplicateur
    if (this.isCombo) {
      this.comboMultiplier += 1; // Augmenter le multiplicateur de 0.5 à chaque combo
    } else {
      this.comboMultiplier = 1; // Réinitialiser le multiplicateur s'il ne s'agit pas d'un combo
      // Incrémenter le compteur de coups ici après que des correspondances ont été trouvées
      this.movesCount++;
    }

    // Pour chaque correspondance
    for (const match of matches) {
      // Points basés sur la taille de la correspondance avec multiplicateur de combo
      const matchPoints = Math.floor(
        match.tiles.length * 10 * this.comboMultiplier
      );
      pointsToAdd += matchPoints;

      // Animer la suppression des tuiles
      for (const tile of match.tiles) {
        // Utiliser la frame 5 (index 4) pour l'animation de disparition
        const disappearFrame = this.colorToFrame[tile.color] + 4;
        tile.sprite.setFrame(disappearFrame);

        // Animation de disparition depuis le centre
        this.scene.tweens.add({
          targets: tile,
          scale: 0,
          alpha: 0,
          duration: 200,
          onComplete: () => {
            // Supprimer le conteneur de la tuile
            tile.removeAll(true);
            tile.destroy();
          },
        });
      }
    }

    // Mettre à jour le score
    this.updateScore(pointsToAdd);

    // Attendre la fin des animations
    this.scene.time.delayedCall(250, () => {
      // Faire tomber les tuiles
      this.dropTiles(matches);
      // Créer de nouvelles tuiles
      this.scene.time.delayedCall(500, () => {
        this.fillEmptySpaces();

        // Vérifier s'il y a de nouvelles correspondances
        this.scene.time.delayedCall(300, () => {
          const newMatches = this.checkMatches();
          if (newMatches.length > 0) {
            // Marquer comme combo pour la prochaine résolution
            this.isCombo = true;
            // Résoudre les nouvelles correspondances
            this.resolveMatches(newMatches, level);
          } else {
            // Fin du combo
            this.isCombo = false;
            this.comboMultiplier = 1;

            // Revenir à la frame 0 pour l'état inactif
            this.playerHand.setFrame(0);

            // Ne pas ramener la main à sa position initiale
            // Garder la main où elle est et continuer la simulation
            this.isHandMoving = false;
            this.scene.time.delayedCall(this.simulationSpeed / 2, () => {
              this.simulateAIMove(level);
            });
          }
        });
      });
    });
  }

  /**
   * Fait tomber les tuiles après la suppression de correspondances
   */
  dropTiles(matches) {
    // Marquer les tuiles à supprimer
    const tilesToRemove = new Set();
    for (const match of matches) {
      for (const tile of match.tiles) {
        tilesToRemove.add(`${tile.row},${tile.col}`);
      }
    }

    // Pour chaque colonne
    for (let col = 0; col < this.gridSize.cols; col++) {
      let emptySpaces = 0;
      // Parcourir la colonne de bas en haut
      for (let row = this.gridSize.rows - 1; row >= 0; row--) {
        if (tilesToRemove.has(`${row},${col}`)) {
          // Incrémenter le compteur d'espaces vides
          emptySpaces++;
          // Marquer l'emplacement comme null
          this.grid[row][col] = null;
        } else if (emptySpaces > 0 && this.grid[row][col]) {
          // Déplacer la tuile vers le bas
          const tile = this.grid[row][col];
          const newRow = row + emptySpaces;

          // Changer la frame pour l'animation de déplacement (frame 4)
          const moveFrame = this.colorToFrame[tile.color] + 3;
          tile.sprite.setFrame(moveFrame);

          // Animer le déplacement
          this.scene.tweens.add({
            targets: tile,
            y: newRow * this.tileSize + this.tileSize / 2,
            duration: 300,
            ease: "Bounce.easeOut",
            onComplete: () => {
              // Revenir à la frame normale après le déplacement
              const normalFrame = this.colorToFrame[tile.color] + 0;
              tile.sprite.setFrame(normalFrame);
            },
          });
          // Mettre à jour la position de la tuile
          tile.row = newRow;
          // Mettre à jour la grille
          this.grid[newRow][col] = tile;
          this.grid[row][col] = null;
        }
      }
    }
  }

  /**
   * Remplit les espaces vides avec de nouvelles tuiles
   */
  fillEmptySpaces() {
    for (let col = 0; col < this.gridSize.cols; col++) {
      let emptySpaces = 0;
      // Compter les espaces vides dans la colonne
      for (let row = 0; row < this.gridSize.rows; row++) {
        if (this.grid[row][col] === null) {
          emptySpaces++;
        }
      }
      // Si pas d'espaces vides, passer à la colonne suivante
      if (emptySpaces === 0) continue;
      // Créer de nouvelles tuiles pour les espaces vides
      for (let i = 0; i < emptySpaces; i++) {
        const row = i;
        const startY = -this.tileSize * (emptySpaces - i);
        // Sélectionner une couleur aléatoire
        const colorIndex = Math.floor(Math.random() * this.colors.length);
        const color = this.colors[colorIndex];
        // Créer une tuile
        const tile = this.createTile(row, col, color);
        tile.y = startY + this.tileSize / 2;

        // Définir la frame d'animation de mouvement (frame 4)
        const moveFrame = this.colorToFrame[color] + 3;
        tile.sprite.setFrame(moveFrame);

        // Animer l'entrée de la tuile
        this.scene.tweens.add({
          targets: tile,
          y: row * this.tileSize + this.tileSize / 2,
          duration: 500,
          ease: "Bounce.easeOut",
          onComplete: () => {
            // Revenir à la frame normale après le déplacement
            const normalFrame = this.colorToFrame[color] + 0;
            tile.sprite.setFrame(normalFrame);
          },
        });
        // Mettre à jour la grille
        this.grid[row][col] = tile;
      }
    }
  }

  /**
   * Mélange la grille s'il n'y a plus de mouvements possibles
   */
  shuffleGrid() {
    // Animation de mélange
    this.scene.tweens.add({
      targets: this.gridContainer,
      alpha: 0.5,
      scale: 0.9,
      duration: 300,
      yoyo: true,
      onComplete: () => {
        // Mélanger les couleurs des tuiles existantes
        const colors = [];
        // Collecter toutes les couleurs
        for (let row = 0; row < this.gridSize.rows; row++) {
          for (let col = 0; col < this.gridSize.cols; col++) {
            colors.push(this.grid[row][col].color);
          }
        }
        // Mélanger les couleurs
        for (let i = colors.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [colors[i], colors[j]] = [colors[j], colors[i]];
        }
        // Réattribuer les couleurs
        let colorIndex = 0;
        for (let row = 0; row < this.gridSize.rows; row++) {
          for (let col = 0; col < this.gridSize.cols; col++) {
            this.grid[row][col].setColor(colors[colorIndex]);
            colorIndex++;
          }
        }
        // S'assurer qu'il n'y a pas de correspondances initiales
        this.resolveInitialMatches();
      },
    });
  }

  /**
   * Met à jour le score avec animation
   */
  updateScore(points) {
    const oldScore = this.score;
    this.score += points;
    // Animation d'incrémentation du score
    const duration = 500;
    const steps = 20;
    const increment = points / steps;
    const stepDuration = duration / steps;
    for (let i = 1; i <= steps; i++) {
      this.scene.time.delayedCall(i * stepDuration, () => {
        const currentScore = Math.min(oldScore + i * increment, this.score);
        this.scoreText.setText(
          `Score: ${Math.floor(currentScore)} / ${this.targetScore}`
          //window.i18n.get("score")(Math.floor(currentScore), this.targetScore)
        );
      });
    }

    // Afficher les points gagnés
    const { width, height } = this.scene.cameras.main;
    let pointsText;

    pointsText = this.scene.add
      .text(width / 2, height / 3, `+${points}`, {
        fontSize: "36px",
        fontFamily: "Arial",
        color: "#ffff00",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5, 0.5);

    // Animer le texte des points
    this.scene.tweens.add({
      targets: pointsText,
      y: pointsText.y - 50,
      alpha: 0,
      scale: 1.5,
      duration: 700,
      onComplete: () => pointsText.destroy(),
    });
  }

  /**
   * Termine la simulation
   */
  completeSimulation(finishReason, movesLimit, difficulty) {
    if (this.simulationTimer) {
      this.simulationTimer.remove();
    }

    this.isEndingSimulation = false; // Réinitialiser l'état de fin

    // Cacher la main du joueur
    if (this.playerHand) {
      this.playerHand.setVisible(false);
    }

    this.isSimulating = false;
    let isBalanced = false;
    let feedback = "";
    let monsterAnimation = undefined;
    let monsterStaticFrame = undefined;
    // Variable pour stocker le message à afficher
    let message = "";
    let messageColor = "#ffffff";

    switch (finishReason) {
      case "SUCCESS":
        message = window.i18n.get("match3Success");
        messageColor = "#7CFC00";
        // S'assurer que le dernier déplacement est compté si le score a été atteint
        const movesRatio = Math.floor((this.movesCount / movesLimit) * 100);
        const matchRate = this.matchesMade / this.movesCount; // Taux de correspondances par coup
        switch (difficulty) {
          case "easy":
            feedback = window.i18n.get("match3FeedbackTooEasy");
            monsterAnimation = "oopsy";
            break;
          case "hard":
            feedback = window.i18n.get("match3FeedbackTooHard");
            monsterStaticFrame = 6;
            break;
          case "medium":
            if (movesRatio <= 40) {
              feedback = window.i18n.get("match3FeedbackTooFast");
              monsterAnimation = "oopsy";
            } else if (movesRatio >= 80) {
              feedback = window.i18n.get("match3FeedbackTooSlow");
              monsterStaticFrame = 6;
            } else {
              feedback = window.i18n.get("gameFeedbackBalanced");
              monsterAnimation = "happy";
              isBalanced = true;
            }
            break;
        }
        break;
      case "MOVES_DEPLETED":
        message =
          window.i18n.get("movesDepletedMessage") ||
          "Plus de coups disponibles !";
        messageColor = "#FF6347";
        feedback =
          window.i18n.get("match3FeedbackMovesOut") ||
          "Vous avez épuisé tous vos coups disponibles.";
        monsterAnimation = "sad";
        break;
    }

    // Animation finale
    if (finishReason === "SUCCESS") {
      // Afficher des confettis pour une victoire
      const confetti = this.scene.add
        .image(
          this.scene.cameras.main.width / 2,
          this.scene.cameras.main.height / 2,
          "confettis"
        )
        .setAlpha(0)
        .setScale(0.5);
      this.scene.tweens.add({
        targets: confetti,
        alpha: 0.8,
        scale: 0.8,
        duration: 1000,
        ease: "Sine.easeOut",
      });
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
