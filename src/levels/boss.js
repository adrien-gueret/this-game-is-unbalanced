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
    hasTimer: {
      value: true,
    },
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
  new BossLevel({
    playerLife: {
      value: 200,
    },
    bossLife: {
      value: 500,
    },
    playerAttack: {
      value: 100,
    },
    bossAttack: {
      value: 50,
    },
    playerDefense: {
      value: 0,
      min: 0,
      max: 20,
      step: 5,
      label: "bossPlayerDefenseSettings",
    },
    bossDefense: {
      value: 0,
      min: 0,
      max: 20,
      step: 5,
      label: "bossSlimeDefenseSettings",
    },
    playerCriticalChance: {
      value: 0,
      min: 0,
      max: 50,
      step: 5,
      label: "bossPlayerCriticalChanceSettings",
    },
    bossCriticalChance: {
      value: 0,
      min: 0,
      max: 50,
      step: 5,
      label: "bossSlimeCriticalChanceSettings",
    },
    potionQuantity: {
      value: 4,
      min: 1,
      max: 5,
      step: 1,
      label: "bossPotitionQuantitySettings",
    },
    potionEfficiency: {
      value: 100,
      min: 50,
      max: 100,
      step: 10,
      label: "bossPotitionEfficiencySettings",
    },
  }),
]);
