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
  new BossLevel({
    playerLife: {
      value: 500,
    },
    bossLife: {
      value: 500,
    },
    playerAttack: {
      value: 50,
    },
    bossAttack: {
      value: 50,
    },
    playerDefense: {
      value: 10,
      min: 0,
      max: 80,
      step: 5,
      label: "bossPlayerDefenseSettings",
    },
    bossDefense: {
      value: 20,
      min: 0,
      max: 80,
      step: 5,
      label: "bossSlimeDefenseSettings",
    },
    playerCriticalChance: {
      value: 0,
      min: 0,
      max: 100,
      step: 10,
      label: "bossPlayerCriticalChanceSettings",
    },
    bossCriticalChance: {
      value: 70,
      min: 0,
      max: 100,
      step: 10,
      label: "bossSlimeCriticalChanceSettings",
    },
  }),
]);
