Level.addLevels([
  new Match3Level({
    totalColors: {
      value: 3,
      min: 3,
      max: 9,
      step: 1,
      label: "match3TotalColorsSettings",
    },
    targetScore: {
      value: 1000,
      min: 100,
      max: 1000,
      step: 50,
      label: "match3TargetScoreSettings",
    },
    movesLimit: {
      value: 10,
      min: 5,
      max: 40,
      step: 5,
      label: "match3MaxMovesSettings",
    },
    comboMultiplier: {
      value: 0.5,
    },
  }),
]);
