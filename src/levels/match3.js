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
      value: 800,
      min: 100,
      max: 1500,
      step: 100,
      label: "match3TargetScoreSettings",
    },
    movesLimit: {
      value: 10,
      min: 5,
      max: 40,
      step: 5,
      label: "match3MaxMovesSettings",
    },
    scorePerTile: {
      value: 10,
    },
    comboMultiplier: {
      value: 0.5,
    },
  }),
  new Match3Level({
    totalColors: {
      value: 3,
    },
    targetScore: {
      value: 40000,
    },
    movesLimit: {
      value: 8,
      min: 4,
      max: 20,
      step: 2,
      label: "match3MaxMovesSettings",
    },
    scorePerTile: {
      value: 200,
      min: 20,
      max: 400,
      step: 20,
      label: "match3ScorePerTileSettings",
    },
    comboMultiplier: {
      value: 3,
      min: 0.5,
      max: 4,
      step: 0.5,
      label: "match3ComboMultiplierSettings",
    },
  }),
  new Match3Level({
    totalColors: {
      value: 3,
      min: 3,
      max: 9,
      step: 1,
      label: "match3TotalColorsSettings",
    },
    targetScore: {
      value: 400,
    },
    movesLimit: {
      value: 4,
      min: 4,
      max: 10,
      step: 1,
      label: "match3MaxMovesSettings",
    },
    scorePerTile: {
      value: 20,
      min: 2,
      max: 40,
      step: 2,
      label: "match3ScorePerTileSettings",
    },
    comboMultiplier: {
      value: -2,
      min: -2,
      max: -1,
      step: 0.5,
      label: "match3ComboMultiplierSettings",
    },
  }),
  new Match3Level({
    totalColors: {
      value: 4,
      min: 3,
      max: 9,
      step: 1,
      label: "match3TotalColorsSettings",
    },
    targetScore: {
      value: 1000,
      min: 100,
      max: 1500,
      step: 100,
      label: "match3TargetScoreSettings",
    },
    movesLimit: {
      value: 10,
      min: 5,
      max: 40,
      step: 5,
      label: "match3MaxMovesSettings",
    },
    scorePerTile: {
      value: 5,
      min: 5,
      max: 30,
      step: 5,
      label: "match3ScorePerTileSettings",
    },
    comboMultiplier: {
      value: 1,
      min: 0.5,
      max: 1.5,
      step: 0.5,
      label: "match3ComboMultiplierSettings",
    },
    minMatch: {
      value: 4,
      min: 4,
      max: 4,
      step: 0,
      label: "match3MinMatchSettings",
    },
  }),
]);
