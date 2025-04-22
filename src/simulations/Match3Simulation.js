/**
 * Match3Simulation - Simulation d'un niveau de match3
 *
 * Cette classe gère la simulation des niveaux de type match 3.
 */

const MATCH_3_GRID_COLUMNS = 8;
const MATCH_3_GRID_ROWS = 6;
const MATCH_3_TILE_SIZE = 64; // Réduire la taille des tuiles pour éviter les débordements
const MATCH_3_COLORS = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "brown",
  "white",
  "black",
];

class Match3Simulation {
  constructor(scene) {
    this.scene = scene;
    this.simulationTimer = null;
    this.grid = [];
    this.score = 0;
    this.isSimulating = false;
    this.simulationSpeed = 1000; // ms entre les moves
    this.movesCount = 0; // Nombre de coups effectués
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
      brown: 30, // 7ème ligne (index 30)
      white: 35, // 8ème ligne (index 35)
      black: 40, // 9ème ligne (index 40)
    };

    // Propriétés pour la main du joueur
    this.playerHand = null;
    this.handSpeed = 400; // Vitesse de déplacement de la main en pixels par seconde
    this.isHandMoving = false;
    this.lastHandPosition = { x: 0, y: 0 }; // Propriété pour stocker la dernière position
  }

  async startLevel(level) {
    const { width, height } = this.scene.cameras.main;

    // Limiter les couleurs utilisées selon les paramètres du niveau
    const totalColors =
      level.settings.totalColors?.value || MATCH_3_COLORS.length;
    this.activeColors = MATCH_3_COLORS.slice(
      0,
      Math.min(Math.max(3, totalColors), MATCH_3_COLORS.length)
    );

    // Créer le conteneur de la grille avec un positionnement ajusté
    this.gridContainer = this.scene.add.container(
      width / 2 - (MATCH_3_GRID_COLUMNS * MATCH_3_TILE_SIZE) / 2,
      height / 2 - (MATCH_3_GRID_ROWS * MATCH_3_TILE_SIZE) / 2 + 50
    );

    // Initialiser la grille
    this.initializeGrid();

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
      .text(
        40,
        110,
        window.i18n.get("match3Score")(
          this.score,
          level.settings.targetScore.value
        ),
        {
          fontSize: "28px",
          fontFamily: "Arial",
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 4,
        }
      )
      .setOrigin(0, 0.5);

    // Afficher le compteur de coups dès le début
    this.movesText = this.scene.add
      .text(
        width - 40,
        110,
        window.i18n.get("match3Moves")(
          this.movesCount,
          level.settings.movesLimit.value
        ),
        {
          fontSize: "24px",
          fontFamily: "Arial",
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 4,
        }
      )
      .setOrigin(1, 0.5); // Aligné à droite

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
    for (let row = 0; row < MATCH_3_GRID_ROWS; row++) {
      this.grid[row] = [];
      for (let col = 0; col < MATCH_3_GRID_COLUMNS; col++) {
        // Sélectionner une couleur aléatoire parmi les couleurs actives
        const colorIndex = Math.floor(Math.random() * this.activeColors.length);
        const color = this.activeColors[colorIndex];
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
      for (let row = 0; row < MATCH_3_GRID_ROWS; row++) {
        for (let col = 0; col < MATCH_3_GRID_COLUMNS; col++) {
          // Vérifier horizontalement
          if (col < MATCH_3_GRID_COLUMNS - 2) {
            if (
              this.grid[row][col].color === this.grid[row][col + 1].color &&
              this.grid[row][col].color === this.grid[row][col + 2].color
            ) {
              const newColorIndex = Math.floor(
                Math.random() * this.activeColors.length
              );
              const newColor = this.activeColors[newColorIndex];
              // S'assurer que la nouvelle couleur est différente
              if (newColor === this.grid[row][col].color) {
                const nextIndex =
                  (newColorIndex + 1) % this.activeColors.length;
                this.grid[row][col + 2].setColor(this.activeColors[nextIndex]);
              } else {
                this.grid[row][col + 2].setColor(newColor);
              }
              hasMatches = true;
            }
          }
          // Vérifier verticalement
          if (row < MATCH_3_GRID_ROWS - 2) {
            if (
              this.grid[row][col].color === this.grid[row + 1][col].color &&
              this.grid[row][col].color === this.grid[row + 2][col].color
            ) {
              const newColorIndex = Math.floor(
                Math.random() * this.activeColors.length
              );
              const newColor = this.activeColors[newColorIndex];
              // S'assurer que la nouvelle couleur est différente
              if (newColor === this.grid[row][col].color) {
                const nextIndex =
                  (newColorIndex + 1) % this.activeColors.length;
                this.grid[row + 2][col].setColor(this.activeColors[nextIndex]);
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
    const x = col * MATCH_3_TILE_SIZE + MATCH_3_TILE_SIZE / 2;
    const y = row * MATCH_3_TILE_SIZE + MATCH_3_TILE_SIZE / 2;

    // Utiliser la spritesheet "tiles-match3" avec la frame correspondant à la couleur
    // La frame 1 de chaque couleur (+0 car index de la première frame = 0)
    const frameIndex = this.colorToFrame[color] + 0;

    // Créer le sprite
    const sprite = this.scene.add.sprite(0, 0, "tiles-match3", frameIndex);

    // Ajuster la taille du sprite pour correspondre à la taille de tuile désirée
    const scale = (MATCH_3_TILE_SIZE - 12) / 32; // 32px = taille originale du sprite
    sprite.setScale(scale);

    // Créer un conteneur pour le sprite
    const container = this.scene.add.container(x, y, [sprite]);
    const tileWidth = MATCH_3_TILE_SIZE - 12;
    const tileHeight = MATCH_3_TILE_SIZE - 12;
    container.setSize(tileWidth, tileHeight);

    // Ajouter au conteneur de la grille
    this.gridContainer.add(container);

    // Propriétés additionnelles
    container.row = row;
    container.col = col;
    container.color = color;
    container.sprite = sprite; // Référence au sprite pour pouvoir changer la frame

    // Configurer l'animation "idle"
    this.setupIdleAnimation(container);

    // Méthode pour changer la couleur de la tuile
    container.setColor = (newColor) => {
      container.color = newColor;
      // Mettre à jour le sprite avec la nouvelle couleur
      const newFrameIndex = this.colorToFrame[newColor] + 0;
      sprite.setFrame(newFrameIndex);

      // Arrêter l'animation en cours si elle existe
      if (container.idleTimer) {
        container.idleTimer.remove();
      }

      // Configurer la nouvelle animation idle
      this.setupIdleAnimation(container);
    };

    this.scene.applyGameMask(container);

    return container;
  }

  /**
   * Configure l'animation "idle" pour une tuile
   */
  setupIdleAnimation(tile) {
    // Variables pour stocker l'état d'animation
    tile.idleState = 0; // 0: Frame 1, 1: Frame 2, 2: Frame 1, 3: Frame 3

    // Créer un timer pour l'animation
    tile.idleTimer = this.scene.time.addEvent({
      delay: this.getDelayForIdleState(tile.idleState),
      callback: () => {
        // Passer à l'état suivant
        tile.idleState = (tile.idleState + 1) % 4;

        // Mapping des états aux indices de frame
        const frameOffsets = [0, 1, 0, 2]; // Frame 1, 2, 1, 3
        const frameIndex =
          this.colorToFrame[tile.color] + frameOffsets[tile.idleState];

        // Changer la frame
        tile.sprite.setFrame(frameIndex);

        // Mettre à jour le délai pour le prochain changement
        tile.idleTimer.delay = this.getDelayForIdleState(tile.idleState);
        // Réinitialiser le timer
        tile.idleTimer.reset({
          delay: tile.idleTimer.delay,
          callback: tile.idleTimer.callback,
          callbackScope: tile.idleTimer.callbackScope,
          repeat: tile.idleTimer.repeat,
        });
      },
      callbackScope: this,
      loop: true,
    });
  }

  /**
   * Renvoie le délai approprié pour chaque état de l'animation idle
   */
  getDelayForIdleState(state) {
    // Les états 1 et 3 (transitions aux frames 2 et 3) sont plus rapides
    switch (state) {
      case 0: // Frame 1 vers Frame 2
        return 2000 + Math.random() * 2000; // 2-4 secondes pour la frame principale
      case 1: // Frame 2 vers Frame 1
        return 500 + Math.random() * 1000; // 2-4 secondes pour la frame principale
      case 2: // Frame 1 vers Frame 3
        return 2000 + Math.random() * 2000; // 2-4 secondes pour la frame principale
      case 3: // Frame 3 vers Frame 1
        return 500 + Math.random() * 1000; // 2-4 secondes pour la frame principale
      default:
        return 2000;
    }
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
        this.movesText.setText(
          window.i18n.get("match3Moves")(
            this.movesCount,
            level.settings.movesLimit.value
          )
        );
        // Vérifier si le nombre de coups a atteint la limite
        if (this.movesCount >= level.settings.movesLimit.value) {
          // Ajouter un délai pour laisser l'animation se terminer
          if (!this.isEndingSimulation) {
            this.isEndingSimulation = true;
            // Attendre 1 seconde avant d'afficher le message de fin
            this.scene.time.delayedCall(1000, () => {
              this.completeSimulation("MOVES_DEPLETED", level);
            });
          }
          return;
        }
        // Vérifier si le score a atteint la cible
        if (this.score >= level.settings.targetScore.value) {
          this.completeSimulation("SUCCESS", level);
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
      // Si aucun mouvement trouvé, afficher un message avant de mélanger la grille
      const { width, height } = this.scene.cameras.main;
      const messageText = this.scene.add
        .text(width / 2, height / 2, window.i18n.get("match3Blocked"), {
          fontSize: "28px",
          fontFamily: "Arial",
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 4,
          backgroundColor: "#00000080",
          padding: { x: 20, y: 10 },
        })
        .setOrigin(0.5)
        .setDepth(1000);

      // Ajouter un effet de pulsation au texte
      this.scene.tweens.add({
        targets: messageText,
        scale: 1.1,
        duration: 500,
        yoyo: true,
        repeat: 1,
      });

      // Attendre 1 seconde avant de mélanger et faire disparaître le message
      this.scene.time.delayedCall(1000, () => {
        // Faire disparaître le message avec animation
        this.scene.tweens.add({
          targets: messageText,
          alpha: 0,
          duration: 300,
          onComplete: () => messageText.destroy(),
        });

        // Mélanger la grille
        this.shuffleGrid();

        // Continuer la simulation après un délai
        this.scene.time.delayedCall(this.simulationSpeed, () => {
          this.simulateAIMove(level);
        });
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
      x:
        this.gridContainer.x + col1 * MATCH_3_TILE_SIZE + MATCH_3_TILE_SIZE / 2,
      y:
        this.gridContainer.y + row1 * MATCH_3_TILE_SIZE + MATCH_3_TILE_SIZE / 2,
    };

    // Ajouter un décalage pour que la main "tienne" la tuile depuis son centre
    // Au lieu d'être directement sur la tuile
    const handOffset = {
      x: MATCH_3_TILE_SIZE / 2, // Décalage horizontal (vers la droite)
      y: MATCH_3_TILE_SIZE / 2 - 8, // Décalage vertical (vers le bas)
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
            x:
              this.gridContainer.x +
              col2 * MATCH_3_TILE_SIZE +
              MATCH_3_TILE_SIZE / 2,
            y:
              this.gridContainer.y +
              row2 * MATCH_3_TILE_SIZE +
              MATCH_3_TILE_SIZE / 2,
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

    const moveFrame = this.colorToFrame[tile.color] + 3;
    tile.sprite.setFrame(moveFrame);

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

    // Créer une grille simulée pour tester les mouvements
    const createSimulatedGrid = () => {
      const simGrid = [];
      for (let r = 0; r < MATCH_3_GRID_ROWS; r++) {
        simGrid[r] = [];
        for (let c = 0; c < MATCH_3_GRID_COLUMNS; c++) {
          simGrid[r][c] = { color: this.grid[r][c].color, row: r, col: c };
        }
      }
      return simGrid;
    };

    // Évaluer un échange et trouver les correspondances potentielles
    const evaluateSwap = (grid, r1, c1, r2, c2) => {
      // Échanger les couleurs dans la grille simulée
      const temp = grid[r1][c1].color;
      grid[r1][c1].color = grid[r2][c2].color;
      grid[r2][c2].color = temp;

      // Vérifier les correspondances horizontales
      const horizontalMatches = [];
      for (let row = 0; row < MATCH_3_GRID_ROWS; row++) {
        let col = 0;
        while (col < MATCH_3_GRID_COLUMNS - 2) {
          const color = grid[row][col].color;
          let matchLength = 1;

          while (
            col + matchLength < MATCH_3_GRID_COLUMNS &&
            grid[row][col + matchLength].color === color
          ) {
            matchLength++;
          }

          if (matchLength >= 3) {
            horizontalMatches.push({
              row,
              col,
              length: matchLength,
              tiles: Array.from({ length: matchLength }, (_, i) => ({
                row,
                col: col + i,
              })),
            });
            col += matchLength;
          } else {
            col++;
          }
        }
      }

      // Vérifier les correspondances verticales
      const verticalMatches = [];
      for (let col = 0; col < MATCH_3_GRID_COLUMNS; col++) {
        let row = 0;
        while (row < MATCH_3_GRID_ROWS - 2) {
          const color = grid[row][col].color;
          let matchLength = 1;

          while (
            row + matchLength < MATCH_3_GRID_ROWS &&
            grid[row + matchLength][col].color === color
          ) {
            matchLength++;
          }

          if (matchLength >= 3) {
            verticalMatches.push({
              row,
              col,
              length: matchLength,
              tiles: Array.from({ length: matchLength }, (_, i) => ({
                row: row + i,
                col,
              })),
            });
            row += matchLength;
          } else {
            row++;
          }
        }
      }

      // Calculer le score total en donnant un bonus aux correspondances plus longues
      let score = 0;
      const allMatches = [...horizontalMatches, ...verticalMatches];

      for (const match of allMatches) {
        // Bonus exponentiel pour les correspondances de plus de 3 tuiles
        if (match.length > 3) {
          score += match.length * match.length; // carré du nombre de tuiles
        } else {
          score += match.length;
        }
      }

      // Bonus supplémentaire pour les mouvements qui créent plusieurs correspondances
      if (allMatches.length > 1) {
        score *= 1.5; // 50% de bonus pour les combos immédiats
      }

      return {
        score,
        matches: allMatches,
        swap: { row1: r1, col1: c1, row2: r2, c2: c2 },
      };
    };

    // Tester tous les échanges horizontaux possibles
    for (let row = 0; row < MATCH_3_GRID_ROWS; row++) {
      for (let col = 0; col < MATCH_3_GRID_COLUMNS - 1; col++) {
        const simGrid = createSimulatedGrid();
        const result = evaluateSwap(simGrid, row, col, row, col + 1);

        if (result.score > 0) {
          possibleMoves.push({
            row1: row,
            col1: col,
            row2: row,
            col2: col + 1,
            score: result.score,
            matchCount: result.matches.length,
            matchSizes: result.matches.map((m) => m.length),
          });
        }
      }
    }

    // Tester tous les échanges verticaux possibles
    for (let row = 0; row < MATCH_3_GRID_ROWS - 1; row++) {
      for (let col = 0; col < MATCH_3_GRID_COLUMNS; col++) {
        const simGrid = createSimulatedGrid();
        const result = evaluateSwap(simGrid, row, col, row + 1, col);

        if (result.score > 0) {
          possibleMoves.push({
            row1: row,
            col1: col,
            row2: row + 1,
            col2: col,
            score: result.score,
            matchCount: result.matches.length,
            matchSizes: result.matches.map((m) => m.length),
          });
        }
      }
    }

    // Trier les mouvements par score (du plus élevé au plus bas)
    possibleMoves.sort((a, b) => b.score - a.score);

    // Retourner le meilleur mouvement ou null si aucun mouvement possible
    return possibleMoves.length > 0 ? possibleMoves[0] : null;
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

    // Arrêter les animations d'idle
    if (tile1.idleTimer) tile1.idleTimer.paused = true;
    if (tile2.idleTimer) tile2.idleTimer.paused = true;

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
        // Réactiver l'animation d'idle
        if (tile1.idleTimer) {
          tile1.idleState = 0;
          tile1.idleTimer.paused = false;
        }
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
        // Réactiver l'animation d'idle
        if (tile2.idleTimer) {
          tile2.idleState = 0;
          tile2.idleTimer.paused = false;
        }
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
    for (let row = 0; row < MATCH_3_GRID_ROWS; row++) {
      let col = 0;
      while (col < MATCH_3_GRID_COLUMNS - 2) {
        const color = this.grid[row][col].color;
        let matchLength = 1;
        // Compter les tuiles consécutives de même couleur
        while (
          col + matchLength < MATCH_3_GRID_COLUMNS &&
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
    for (let col = 0; col < MATCH_3_GRID_COLUMNS; col++) {
      let row = 0;
      while (row < MATCH_3_GRID_ROWS - 2) {
        const color = this.grid[row][col].color;
        let matchLength = 1;
        // Compter les tuiles consécutives de même couleur
        while (
          row + matchLength < MATCH_3_GRID_ROWS &&
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

    // Points à ajouter
    let pointsToAdd = 0;

    // Si c'est un combo (résolution de correspondances en chaîne), augmenter le multiplicateur
    if (this.isCombo) {
      this.comboMultiplier += level.settings.comboMultiplier.value; // Augmenter le multiplicateur à chaque combo
    } else {
      this.comboMultiplier = 1; // Réinitialiser le multiplicateur s'il ne s'agit pas d'un combo
      // Incrémenter le compteur de coups ici après que des correspondances ont été trouvées
      this.movesCount++;
    }

    // Calculer la position moyenne des tuiles qui vont disparaître pour l'affichage du score
    let avgX = 0;
    let avgY = 0;
    let tileCount = 0;

    // Pour chaque correspondance
    for (const match of matches) {
      // Points basés sur la taille de la correspondance avec multiplicateur de combo
      const matchPoints = Math.floor(
        match.tiles.length *
          level.settings.scorePerTile.value *
          this.comboMultiplier
      );
      pointsToAdd += matchPoints;

      // Calculer la position pour l'affichage du score
      for (const tile of match.tiles) {
        // Ajouter la position globale de cette tuile à la moyenne
        const tileX =
          this.gridContainer.x +
          tile.col * MATCH_3_TILE_SIZE +
          MATCH_3_TILE_SIZE / 2;
        const tileY =
          this.gridContainer.y +
          tile.row * MATCH_3_TILE_SIZE +
          MATCH_3_TILE_SIZE / 2;
        avgX += tileX;
        avgY += tileY;
        tileCount++;

        // Animer la suppression des tuiles
        // Arrêter l'animation d'idle
        if (tile.idleTimer) {
          tile.idleTimer.remove();
          tile.idleTimer = null;
        }

        // Utiliser la frame 5 (index 4) pour l'animation de disparition
        const disappearFrame = this.colorToFrame[tile.color] + 4;
        tile.sprite.setFrame(disappearFrame);

        // Animation de disparition depuis le centre
        this.scene.tweens.add({
          targets: tile,
          scale: 0,
          alpha: 0,
          duration: 400,
          onComplete: () => {
            // Supprimer le conteneur de la tuile
            tile.removeAll(true);
            tile.destroy();
          },
        });
      }
    }

    // Calculer la position moyenne
    if (tileCount > 0) {
      avgX /= tileCount;
      avgY /= tileCount;
    } else {
      // Position par défaut au centre de l'écran (cas peu probable)
      const { width, height } = this.scene.cameras.main;
      avgX = width / 2;
      avgY = height / 3;
    }

    // Mettre à jour le score et afficher les points aux coordonnées calculées
    this.updateScore(pointsToAdd, level.settings.targetScore.value, avgX, avgY);

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
   * Met à jour le score avec animation
   */
  updateScore(points, targetScore, x, y) {
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
          window.i18n.get("match3Score")(currentScore, targetScore)
        );
      });
    }

    // Créer le texte de points à la position fournie
    const pointsText = this.scene.add
      .text(x, y, `${points > 0 ? "+" : ""}${points}`, {
        fontSize: "36px",
        fontFamily: "Arial",
        color: points < 0 ? "#ff0000" : "#00ff00",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5, 0.5)
      .setDepth(1000); // S'assurer que le texte est au-dessus des tuiles

    // Animer le texte des points
    this.scene.tweens.add({
      targets: pointsText,
      y: y - 50,
      alpha: 0,
      scale: 1.5,
      duration: 700,
      onComplete: () => pointsText.destroy(),
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
    for (let col = 0; col < MATCH_3_GRID_COLUMNS; col++) {
      let emptySpaces = 0;
      // Parcourir la colonne de bas en haut
      for (let row = MATCH_3_GRID_ROWS - 1; row >= 0; row--) {
        if (tilesToRemove.has(`${row},${col}`)) {
          // Incrémenter le compteur d'espaces vides
          emptySpaces++;
          // Marquer l'emplacement comme null
          this.grid[row][col] = null;
        } else if (emptySpaces > 0 && this.grid[row][col]) {
          // Déplacer la tuile vers le bas
          const tile = this.grid[row][col];
          const newRow = row + emptySpaces;

          // Arrêter l'animation d'idle
          if (tile.idleTimer) tile.idleTimer.paused = true;

          // Changer la frame pour l'animation de déplacement (frame 4)
          const moveFrame = this.colorToFrame[tile.color] + 3;
          tile.sprite.setFrame(moveFrame);

          // Animer le déplacement
          this.scene.tweens.add({
            targets: tile,
            y: newRow * MATCH_3_TILE_SIZE + MATCH_3_TILE_SIZE / 2,
            duration: 300,
            ease: "Bounce.easeOut",
            onComplete: () => {
              // Revenir à la frame normale après le déplacement
              const normalFrame = this.colorToFrame[tile.color] + 0;
              tile.sprite.setFrame(normalFrame);
              // Réactiver l'animation d'idle
              if (tile.idleTimer) {
                tile.idleState = 0;
                tile.idleTimer.paused = false;
              }
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
    for (let col = 0; col < MATCH_3_GRID_COLUMNS; col++) {
      let emptySpaces = 0;
      // Compter les espaces vides dans la colonne
      for (let row = 0; row < MATCH_3_GRID_ROWS; row++) {
        if (this.grid[row][col] === null) {
          emptySpaces++;
        }
      }
      // Si pas d'espaces vides, passer à la colonne suivante
      if (emptySpaces === 0) continue;
      // Créer de nouvelles tuiles pour les espaces vides
      for (let i = 0; i < emptySpaces; i++) {
        const row = i;
        const startY = -MATCH_3_TILE_SIZE * (emptySpaces - i);
        // Sélectionner une couleur aléatoire parmi les couleurs actives
        const colorIndex = Math.floor(Math.random() * this.activeColors.length);
        const color = this.activeColors[colorIndex];
        // Créer une tuile
        const tile = this.createTile(row, col, color);
        tile.y = startY + MATCH_3_TILE_SIZE / 2;

        // Définir la frame d'animation de mouvement (frame 4)
        const moveFrame = this.colorToFrame[color] + 3;
        tile.sprite.setFrame(moveFrame);

        // Pauser l'animation d'idle si elle existe
        if (tile.idleTimer) tile.idleTimer.paused = true;

        // Animer l'entrée de la tuile
        this.scene.tweens.add({
          targets: tile,
          y: row * MATCH_3_TILE_SIZE + MATCH_3_TILE_SIZE / 2,
          duration: 500,
          ease: "Bounce.easeOut",
          onComplete: () => {
            // Revenir à la frame normale après le déplacement
            const normalFrame = this.colorToFrame[color] + 0;
            tile.sprite.setFrame(normalFrame);
            // Réactiver l'animation d'idle
            if (tile.idleTimer) {
              tile.idleState = 0;
              tile.idleTimer.paused = false;
            }
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
    // Créer un effet flash pour indiquer que le mélange commence
    const flashOverlay = this.scene.add
      .rectangle(
        this.gridContainer.x + (MATCH_3_GRID_COLUMNS * MATCH_3_TILE_SIZE) / 2,
        this.gridContainer.y + (MATCH_3_GRID_ROWS * MATCH_3_TILE_SIZE) / 2,
        MATCH_3_GRID_COLUMNS * MATCH_3_TILE_SIZE + 20,
        MATCH_3_GRID_ROWS * MATCH_3_TILE_SIZE + 20,
        0xffffff
      )
      .setAlpha(0);

    // Animation de flash
    this.scene.tweens.add({
      targets: flashOverlay,
      alpha: 0.7,
      duration: 150,
      yoyo: true,
      repeat: 0,
      onComplete: () => flashOverlay.destroy(),
    });

    // Pour chaque tuile, on va l'animer individuellement
    for (let row = 0; row < MATCH_3_GRID_ROWS; row++) {
      for (let col = 0; col < MATCH_3_GRID_COLUMNS; col++) {
        const tile = this.grid[row][col];

        // Stocker la position originale pour revenir après
        const originalPos = { x: tile.x, y: tile.y };
        const originalScale = tile.scale;

        // Pause de l'animation idle
        if (tile.idleTimer) tile.idleTimer.paused = true;

        // Animation de shake aléatoire pour chaque tuile
        this.scene.tweens.add({
          targets: tile,
          x: originalPos.x + (Math.random() - 0.5) * 20,
          y: originalPos.y + (Math.random() - 0.5) * 20,
          scale: originalScale * (0.8 + Math.random() * 0.4),
          rotation: (Math.random() - 0.5) * 0.2,
          duration: 300,
          ease: "Sine.easeInOut",
          onComplete: () => {
            // Animation de retour à la position d'origine
            this.scene.tweens.add({
              targets: tile,
              x: originalPos.x,
              y: originalPos.y,
              scale: originalScale,
              rotation: 0,
              duration: 200,
              ease: "Back.easeOut",
            });
          },
        });
      }
    }

    // Attendre que les animations terminent avant de mélanger les couleurs
    this.scene.time.delayedCall(550, () => {
      // Mélanger les couleurs des tuiles existantes
      const colors = [];

      // Collecter toutes les couleurs
      for (let row = 0; row < MATCH_3_GRID_ROWS; row++) {
        for (let col = 0; col < MATCH_3_GRID_COLUMNS; col++) {
          colors.push(this.grid[row][col].color);
        }
      }

      // Mélanger les couleurs
      for (let i = colors.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [colors[i], colors[j]] = [colors[j], colors[i]];
      }

      // Réattribuer les couleurs avec une animation
      let colorIndex = 0;
      for (let row = 0; row < MATCH_3_GRID_ROWS; row++) {
        for (let col = 0; col < MATCH_3_GRID_COLUMNS; col++) {
          const tile = this.grid[row][col];
          const newColor = colors[colorIndex];

          // Animation de changement de couleur
          if (tile.idleTimer) tile.idleTimer.paused = true;

          // Séquence d'images rapide pour simuler un changement de couleur
          this.scene.time.delayedCall(50 * (row + col), () => {
            tile.sprite.setFrame(this.colorToFrame.white + 0);

            this.scene.time.delayedCall(100, () => {
              // Changer la couleur
              tile.setColor(newColor);

              // Réactiver l'animation idle
              if (tile.idleTimer) {
                tile.idleState = 0;
                tile.idleTimer.paused = false;
              }
            });
          });

          colorIndex++;
        }
      }

      // S'assurer qu'il n'y a pas de correspondances initiales après un court délai
      this.scene.time.delayedCall(800, () => {
        this.resolveInitialMatches();
      });
    });
  }

  /**
   * Termine la simulation
   */
  completeSimulation(finishReason, level) {
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

    const movesLimit = level.settings.movesLimit.value;

    switch (finishReason) {
      case "SUCCESS":
        message = window.i18n.get("match3Success");
        messageColor = "#7CFC00";

        const movesRatio = Math.floor((this.movesCount / movesLimit) * 100);

        const difficulty = (() => {
          if (
            level.settings.moveLimit > 20 &&
            level.settings.totalColors < 5 &&
            level.settings.targetScore < 500
          ) {
            return "easy";
          }

          if (
            level.settings.moveLimit < 15 &&
            level.settings.totalColors > 6 &&
            level.settings.targetScore > 600
          ) {
            return "hard";
          }

          return "medium";
        })();

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
            if (movesRatio <= 60) {
              feedback = window.i18n.get("match3FeedbackTooFast");
              monsterAnimation = "oopsy";
            } else {
              feedback = window.i18n.get("gameFeedbackBalanced");
              monsterAnimation = "happy";
              isBalanced = true;
            }
            break;
        }
        break;
      case "MOVES_DEPLETED":
        message = window.i18n.get("match3MovesDepleted");
        messageColor = "#FF6347";
        feedback = window.i18n.get("match3MovesDepletedFeedback");
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
