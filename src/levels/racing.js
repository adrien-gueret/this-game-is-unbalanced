Level.addLevels([
  new RacingLevel(
    ({ scene, player, platformsGroup, obstactleGroup, finishGroup }) => {
      console.log("Level 1 started!");
    }
  ),
  new RacingLevel(
    ({ scene, player, platformsGroup, obstactleGroup, finishGroup }) => {
      console.log("Level 2 started!");
    }
  ),
  new RacingLevel(
    ({ scene, player, platformsGroup, obstactleGroup, finishGroup }) => {
      console.log("Level 3 started!");
    }
  ),
]);
