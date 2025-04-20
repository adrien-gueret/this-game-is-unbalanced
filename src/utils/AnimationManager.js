class AnimationManager {
  static registerAnimations(scene) {
    // Vérifie si les animations sont déjà enregistrées pour éviter les doublons
    if (scene.anims.exists("happy")) return;

    scene.anims.create({
      key: "right",
      frames: scene.anims.generateFrameNumbers("player-platforms", {
        start: 4,
        end: 5,
      }),
      frameRate: 5,
      repeat: -1,
    });

    scene.anims.create({
      key: "hello",
      frames: scene.anims.generateFrameNumbers("player-platforms", {
        start: 2,
        end: 3,
      }),
      frameRate: 3,
      repeat: -1,
    });

    scene.anims.create({
      key: "happy",
      frames: scene.anims.generateFrameNumbers("player-platforms", {
        start: 0,
        end: 1,
      }),
      frameRate: 3,
      repeat: -1,
    });

    scene.anims.create({
      key: "sad",
      frames: scene.anims.generateFrameNumbers("player-platforms", {
        start: 16,
        end: 17,
      }),
      frameRate: 2,
      repeat: -1,
    });

    scene.anims.create({
      key: "oopsy",
      frames: scene.anims.generateFrameNumbers("player-platforms", {
        start: 10,
        end: 11,
      }),
      frameRate: 2,
      repeat: -1,
    });

    scene.anims.create({
      key: "speaking",
      frames: scene.anims.generateFrameNumbers("player-platforms", {
        start: 12,
        end: 13,
      }),
      frameRate: 2,
      repeat: -1,
    });

    scene.anims.create({
      key: "angry",
      frames: scene.anims.generateFrameNumbers("player-platforms", {
        start: 14,
        end: 15,
      }),
      frameRate: 2,
      repeat: -1,
    });

    scene.anims.create({
      key: "water",
      frames: [
        { key: "tiles-platforms", frame: 7 },
        { key: "tiles-platforms", frame: 10 },
      ],
      frameRate: 2,
      repeat: -1,
    });

    scene.anims.create({
      key: "blob-idle",
      frames: scene.anims.generateFrameNumbers("slime-boss", {
        start: 0,
        end: 1,
      }),
      frameRate: 2,
      repeat: -1,
    });

    scene.anims.create({
      key: "blob-happy",
      frames: scene.anims.generateFrameNumbers("slime-boss", {
        start: 4,
        end: 5,
      }),
      frameRate: 2,
      repeat: -1,
    });

    scene.anims.create({
      key: "player-idle",
      frames: scene.anims.generateFrameNumbers("player-boss", {
        start: 0,
        end: 1,
      }),
      frameRate: 2,
      repeat: -1,
    });

    scene.anims.create({
      key: "player-happy",
      frames: scene.anims.generateFrameNumbers("player-boss", {
        start: 4,
        end: 5,
      }),
      frameRate: 2,
      repeat: -1,
    });
  }
}
