Level.addLevels([
  new BossLevel({
    playerLife: {
      value: 400,
      min: 50,
      max: 500,
      step: 20,
      label: "bossPlayerLifeSettings",
    },
    playerAttack: {
      value: 90,
      min: 5,
      max: 100,
      step: 5,
      label: "bossPlayerAttackSettings",
    },
    playerDefense: {
      value: 60,
      min: 0,
      max: 80,
      step: 5,
      label: "bossPlayerDefenseSettings",
    },
    playerCriticalChance: {
      value: 0,
    },
    bossCriticalChance: {
      value: 0,
    },
  }),
]);
