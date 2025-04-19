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
        value: 150,
        min: 50,
        max: 400,
        step: 10,
        label: "platformsPlayerSpeedSettings",
      },
      playerGravity: {
        value: 500,
        min: 300,
        max: 800,
        step: 50,
        label: "platformsPlayerGravitySettings",
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

      const waterStartX = 288;

      for (let x = 0; x < width; x += tileSize) {
        const tileIndex = (() => {
          if (waterLength === 0) {
            return 1;
          }

          if (x >= waterStartX && x < waterStartX + tileSize * waterLength) {
            return 7;
          }

          if (x === waterStartX + tileSize * waterLength) {
            return 0;
          }

          if (x === waterStartX - tileSize) {
            return 2;
          }

          return 1;
        })();

        if (tileIndex === 7) {
          createAnimatedWaterTile(scene, waterGroup, x, groundY);
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
]);
