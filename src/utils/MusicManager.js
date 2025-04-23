class MusicManager {
  static currentMusic = null;

  static play(scene, musicKey) {
    let music = scene.sound.get(musicKey);

    if (!music) {
      music = scene.sound.add(musicKey, {
        volume: 0,
        loop: true,
      });
      music.stop();
    }

    if (music === MusicManager.currentMusic) {
      return;
    }

    if (MusicManager.currentMusic) {
      const previousMusic = MusicManager.currentMusic;

      scene.tweens.add({
        targets: previousMusic,
        volume: 0,
        duration: 1000,
        onComplete: () => {
          previousMusic.stop();
        },
      });
    }

    music.play();
    scene.tweens.add({
      targets: music,
      volume: 0.5,
      duration: 1000,
    });

    MusicManager.currentMusic = music;
  }

  static isPlaying() {
    return MusicManager?.currentMusic?.isPlaying;
  }
}
