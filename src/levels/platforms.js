/**
 * Crée une tuile d'eau animée
 * @param {Phaser.GameObjects.Group} waterGroup - Le groupe pour stocker les tuiles d'eau
 * @param {number} x - Position X de la tuile
 * @param {number} y - Position Y de la tuile
 * @param {string} texture - Texture à utiliser
 * @returns {Phaser.GameObjects.Sprite} - La tuile d'eau créée
 */
function createAnimatedWaterTile(
  scene,
  waterGroup,
  x,
  y,
  texture = "tiles-platforms"
) {
  // Créer la tuile d'eau
  const waterTile = scene.add.sprite(x, y, texture, 7).setDepth(200);

  // Démarrer l'animation
  waterTile.play("water");

  // Ajouter au groupe
  waterGroup.add(waterTile);

  return waterTile;
}

Level.addLevels([
  new PlatformsLevel(
    {
      playerSpeed: {
        value: 120,
      },
      playerGravity: {
        value: 50,
      },
      timeLimit: {
        value: 10,
      },
      wallHeight: {
        value: 1,
        min: 0,
        max: 10,
        step: 1,
        label: "platforms1WallHeightSettings",
      },
    },
    function () {
      const wallHeight = this.settings.wallHeight.value;

      if (wallHeight <= 3) {
        return "easy";
      }

      if (wallHeight >= 8) {
        return "hard";
      }

      return "medium";
    },
    function ({ scene, player, platformsGroup, finishGroup }) {
      const { width, height } = scene.cameras.main;

      const tileSize = 32;
      const groundY = height - tileSize;

      const wallX = 384;
      const wallHeight = this.settings.wallHeight.value;

      if (wallHeight > 0) {
        for (let i = 1; i <= wallHeight - 1; i++) {
          platformsGroup.create(
            wallX,
            groundY - tileSize * i,
            "tiles-platforms",
            3
          );
          platformsGroup.create(
            wallX + tileSize,
            groundY - tileSize * i,
            "tiles-platforms",
            5
          );
        }

        platformsGroup.create(
          wallX,
          groundY - tileSize * wallHeight,
          "tiles-platforms",
          0
        );
        platformsGroup.create(
          wallX + tileSize,
          groundY - tileSize * wallHeight,
          "tiles-platforms",
          2
        );
      }

      for (let x = 0; x < width; x += tileSize) {
        const tileIndex = (() => {
          if (wallHeight === 0) {
            return 1;
          }

          switch (x) {
            case wallX:
              return 6;

            case wallX + tileSize:
              return 8;

            default:
              return 1;
          }
        })();

        if (!tileIndex) {
          continue;
        }

        platformsGroup.create(x, groundY, "tiles-platforms", tileIndex);
      }

      finishGroup.create(width - 72, groundY - 32, "tiles-platforms", 11);

      player
        .setX(70)
        .setY(groundY - 48)
        .refreshBody();
    }
  ),
  new PlatformsLevel(
    {
      playerSpeed: {
        value: 80,
        min: 50,
        max: 400,
        step: 10,
        label: "platformsPlayerSpeedSettings",
      },
      jumpHeight: {
        value: 500,
        min: 50,
        max: 600,
        step: 50,
        label: "platformsJumpHeightSettings",
      },
      playerGravity: {
        value: 300,
      },
      timeLimit: {
        value: 5,
      },
      waterLength: {
        value: 10,
        min: 2,
        max: 10,
        step: 1,
        label: "platforms2WaterLengthSettings",
      },
    },
    function () {
      const waterLength = this.settings.waterLength.value;

      if (waterLength <= 3) {
        return "easy";
      }

      if (waterLength >= 8) {
        return "hard";
      }

      return "medium";
    },
    function ({ scene, player, platformsGroup, waterGroup, finishGroup }) {
      const waterLength = this.settings.waterLength.value;

      const { width, height } = scene.cameras.main;

      const tileSize = 32;
      const groundY = height - tileSize;

      const waterEndX = 576;

      for (let x = 0; x < width; x += tileSize) {
        const tileIndex = (() => {
          if (waterLength === 0) {
            return 1;
          }

          if (x <= waterEndX && x > waterEndX - tileSize * waterLength) {
            return 7;
          }

          if (x === waterEndX - tileSize * waterLength) {
            return 2;
          }

          if (x === waterEndX + tileSize) {
            return 0;
          }

          return 1;
        })();

        if (tileIndex === 7) {
          createAnimatedWaterTile(scene, waterGroup, x, groundY);
          continue;
        }

        platformsGroup.create(x, groundY, "tiles-platforms", tileIndex);
      }

      const ceilX = width - 192;
      const ceilY = groundY - 160;

      for (let rowIndex = 10; rowIndex >= 0; rowIndex--) {
        platformsGroup.create(
          ceilX,
          ceilY - tileSize * rowIndex,
          "tiles-platforms",
          rowIndex === 0 ? 9 : 3
        );

        for (let columnIndex = 1; columnIndex < 6; columnIndex++) {
          platformsGroup.create(
            ceilX + tileSize * columnIndex,
            ceilY - tileSize * rowIndex,
            "tiles-platforms",
            rowIndex === 0 ? 12 : 4
          );
        }
      }

      finishGroup.create(width - 72, groundY - 32, "tiles-platforms", 11);

      player
        .setX(70)
        .setY(groundY - 48)
        .refreshBody();
    }
  ),
  new PlatformsLevel(
    {
      playerSpeed: {
        value: 300,
        min: 50,
        max: 400,
        step: 20,
        label: "platformsPlayerSpeedSettings",
      },
      playerGravity: {
        value: 300,
        min: 100,
        max: 1500,
        step: 50,
        label: "platformsPlayerGravitySettings",
      },
      timeLimit: {
        value: 10,
        min: 2,
        max: 20,
        step: 2,
        label: "platformsTimeLimitSettings",
        unitLabel: "platformsTimeLimitSettingsUnit",
      },
      platformLength: {
        value: 7,
        min: 2,
        max: 7,
        step: 1,
        label: "platforms3PlatformLengthSettings",
      },
    },
    function () {
      const waterLength = 9 - this.settings.platformLength.value;

      if (waterLength <= 4) {
        return "easy";
      }

      if (waterLength >= 7) {
        return "hard";
      }

      return "medium";
    },
    function ({ scene, player, platformsGroup, waterGroup, finishGroup }) {
      const waterLength = 9 - this.settings.platformLength.value;

      const { width } = scene.cameras.main;

      const tileSize = 32;
      const startGroundY = tileSize * 5 + 20;
      const bottomY = startGroundY + tileSize * 12;

      for (let y = startGroundY; y <= bottomY; y += tileSize) {
        const firstLine = y === startGroundY;
        const mainTileIndex = firstLine ? 1 : 4;

        platformsGroup.create(tileSize, y, "tiles-platforms", mainTileIndex);
        platformsGroup.create(
          tileSize * 2,
          y,
          "tiles-platforms",
          mainTileIndex
        );
        platformsGroup.create(
          tileSize * 3,
          y,
          "tiles-platforms",
          mainTileIndex
        );
        platformsGroup.create(
          tileSize * 4,
          y,
          "tiles-platforms",
          firstLine ? 2 : y === bottomY && waterLength === 0 ? 8 : 5
        );
      }

      const flagX = tileSize * 12;
      const startGroundX = tileSize * 5;

      for (let x = startGroundX; x < width; x += tileSize) {
        const tileIndex = (() => {
          if (waterLength > 0) {
            if (x < startGroundX + waterLength * tileSize) {
              return 7;
            }

            if (x === startGroundX + waterLength * tileSize) {
              return 0;
            }
          }

          if (x === flagX + tileSize) {
            return 2;
          }
          if (x > flagX) {
            return 7;
          }

          return 1;
        })();

        if (tileIndex === 7) {
          createAnimatedWaterTile(scene, waterGroup, x, bottomY);
          continue;
        }

        platformsGroup.create(x, bottomY, "tiles-platforms", tileIndex);
      }

      finishGroup.create(flagX, bottomY - tileSize, "tiles-platforms", 11);

      player
        .setX(70)
        .setY(startGroundY - 48)
        .refreshBody();
    }
  ),
  new PlatformsLevel(
    {
      playerSpeed: {
        value: 120,
      },
      playerGravity: {
        value: 200,
        min: 50,
        max: 500,
        step: 50,
        label: "platformsPlayerGravitySettings",
      },
      jumpHeight: {
        value: 300,
      },
      timeLimit: {
        value: 10,
      },
      platformsTotal: {
        value: 2,
        min: 2,
        max: 4,
        step: 1,
        label: "platforms4PlatformsTotalSettings",
      },
      platformsWidth: {
        value: 5,
        min: 2,
        max: 5,
        step: 1,
        label: "platforms4PlatformsWidthSettings",
      },
      holesWidth: {
        value: 6,
        min: 2,
        max: 6,
        step: 1,
        label: "platforms4HolesWidthSettings",
      },
    },
    function () {
      const startGroundWidth = 3;

      const totalGround =
        startGroundWidth +
        this.settings.platformsTotal.value * this.settings.platformsWidth.value;

      const totalWater =
        this.settings.holesWidth.value * this.settings.platformsTotal.value;

      const ratio = totalWater / totalGround;

      if (ratio < 0.9) {
        return "easy";
      }

      if (ratio > 1.4) {
        return "hard";
      }

      return "medium";
    },
    function ({ scene, player, platformsGroup, waterGroup, finishGroup }) {
      const { width } = scene.cameras.main;

      const tileSize = 32;
      const startGroundY = tileSize * 12;
      const startWaterY = startGroundY + tileSize * 3;
      const bottomY = startGroundY + tileSize * 6;

      const holeSize = this.settings.holesWidth.value;
      const platformWidth = this.settings.platformsWidth.value;
      const totalPlatforms = this.settings.platformsTotal.value;

      let flagX = 0;

      for (let y = startGroundY; y <= bottomY; y += tileSize) {
        const firstLine = y === startGroundY;
        const mainTileIndex = firstLine ? 1 : 4;

        // Start column
        platformsGroup.create(tileSize, y, "tiles-platforms", mainTileIndex);
        platformsGroup.create(
          tileSize * 2,
          y,
          "tiles-platforms",
          mainTileIndex
        );
        platformsGroup.create(
          tileSize * 3,
          y,
          "tiles-platforms",
          mainTileIndex
        );
        platformsGroup.create(
          tileSize * 4,
          y,
          "tiles-platforms",
          firstLine ? 2 : 5
        );

        let lastPlatformEnd = tileSize * 4;

        for (
          let platformIndex = 0;
          platformIndex < totalPlatforms;
          platformIndex++
        ) {
          let startPlatformX = lastPlatformEnd + holeSize * tileSize;

          if (y >= startWaterY) {
            for (
              let i = lastPlatformEnd + tileSize;
              i <= startPlatformX;
              i += tileSize
            ) {
              if (y === startWaterY) {
                createAnimatedWaterTile(scene, waterGroup, i, y);
              } else {
                waterGroup.add(
                  scene.add.sprite(i, y, "tiles-platforms", 14).setDepth(200)
                );
              }
            }
          }

          for (let i = 0; i < platformWidth; i++) {
            const leftTile = i === 0;
            const rightTile = i === platformWidth - 1;

            platformsGroup.create(
              startPlatformX + tileSize * (i + 1),
              y,
              "tiles-platforms",
              leftTile
                ? firstLine
                  ? 0
                  : 3
                : rightTile
                ? firstLine
                  ? 2
                  : 5
                : mainTileIndex
            );
          }

          if (startPlatformX + tileSize * 2 < 768) {
            flagX = startPlatformX + tileSize * 2;
          } else if (startPlatformX + tileSize < 768) {
            flagX = startPlatformX + tileSize;
          }

          lastPlatformEnd = startPlatformX + tileSize * platformWidth;
        }

        if (y >= startWaterY) {
          for (let i = lastPlatformEnd + tileSize; i <= width; i += tileSize) {
            if (y === startWaterY) {
              createAnimatedWaterTile(scene, waterGroup, i, y);
            } else {
              waterGroup.add(
                scene.add.sprite(i, y, "tiles-platforms", 14).setDepth(200)
              );
            }
          }
        }
      }

      finishGroup.create(flagX, startGroundY - tileSize, "tiles-platforms", 11);

      player
        .setX(70)
        .setY(startGroundY - 48)
        .refreshBody();
    }
  ),
]);
