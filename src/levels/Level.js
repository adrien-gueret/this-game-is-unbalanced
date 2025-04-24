class Level {
  static levels = [];

  static addLevel(level) {
    const levelIndex =
      Level.levels.filter((l) => l.type === level.type).length + 1;

    level.id = `${level.type}_${levelIndex}`;
    Level.levels.push(level);
  }

  static addLevels(levels) {
    levels.forEach((level) => {
      Level.addLevel(level);
    });
  }

  constructor({ start, settings, getDifficulty, type }) {
    this.id = null;
    this.type = type;
    this.settings = settings;
    this.getDifficulty = getDifficulty ? getDifficulty.bind(this) : null;
    this.start = start ? start.bind(this) : null;
  }

  getTitle() {
    return window.i18n.get(`${this.id}_title`);
  }
}

class PlatformsLevel extends Level {
  constructor(settings, getDifficulty, start) {
    const commonSimulationsSettings = {
      playerSpeed: {
        value: 200,
        min: 50,
        max: 400,
        step: 10,
        label: "platformsPlayerSpeedSettings",
      },
      playerGravity: {
        value: 300,
        min: 300,
        max: 800,
        step: 50,
        label: "platformsPlayerGravitySettings",
      },
      jumpHeight: {
        value: 300,
        min: 50,
        max: 600,
        step: 50,
        label: "platformsJumpHeightSettings",
      },
      timeLimit: {
        value: 15,
        min: 5,
        max: 20,
        step: 1,
        label: "platformsTimeLimitSettings",
        unitLabel: "platformsTimeLimitSettingsUnit",
      },
    };

    super({
      start,
      settings: { ...commonSimulationsSettings, ...settings },
      getDifficulty,
      type: "platforms",
    });
  }
}

class BossLevel extends Level {
  constructor(settings) {
    const commonSimulationsSettings = {
      playerLife: {
        value: 200,
        min: 50,
        max: 500,
        step: 20,
        label: "bossPlayerLifeSettings",
      },
      playerAttack: {
        value: 50,
        min: 5,
        max: 100,
        step: 5,
        label: "bossPlayerAttackSettings",
      },
      playerDefense: {
        value: 20,
        min: 0,
        max: 80,
        step: 5,
        label: "bossPlayerDefenseSettings",
      },
      playerCriticalChance: {
        value: 10,
        min: 0,
        max: 100,
        step: 10,
        label: "bossPlayerCriticalChanceSettings",
      },
      bossLife: {
        value: 200,
        min: 50,
        max: 500,
        step: 20,
        label: "bossSlimeLifeSettings",
      },
      bossAttack: {
        value: 50,
        min: 5,
        max: 100,
        step: 5,
        label: "bossSlimeAttackSettings",
      },
      bossDefense: {
        value: 40,
        min: 0,
        max: 80,
        step: 5,
        label: "bossSlimeDefenseSettings",
      },
      bossCriticalChance: {
        value: 10,
        min: 0,
        max: 100,
        step: 10,
        label: "bossSlimeCriticalChanceSettings",
      },
      bossEnrageTrigger: {
        value: 0,
      },
      bossEnrageMultiplicator: {
        value: 1,
      },
    };

    super({
      settings: { ...commonSimulationsSettings, ...settings },
      type: "boss",
    });
  }
}

class Match3Level extends Level {
  constructor(settings) {
    const commonSimulationsSettings = {
      totalColors: {
        value: 7,
        min: 3,
        max: 9,
        step: 1,
        label: "match3TotalColorsSettings",
      },
      targetScore: {
        value: 500,
        min: 100,
        max: 1000,
        step: 50,
        label: "match3TargetScoreSettings",
      },
      movesLimit: {
        value: 5,
        min: 5,
        max: 40,
        step: 5,
        label: "match3MaxMovesSettings",
      },
      scorePerTile: {
        value: 10,
        min: 5,
        max: 100,
        step: 5,
        label: "match3ScorePerTileSettings",
      },
      comboMultiplier: {
        value: 0.5,
        min: 0.5,
        max: 2,
        step: 0.5,
        label: "match3ComboMultiplierSettings",
      },
    };

    super({
      settings: { ...commonSimulationsSettings, ...settings },
      type: "match3",
    });
  }
}
