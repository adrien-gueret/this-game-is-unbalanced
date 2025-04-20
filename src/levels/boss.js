Level.addLevels([
  new BossLevel(
    {},
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
    function ({ scene, player, platformsGroup, finishGroup }) {}
  ),
]);
