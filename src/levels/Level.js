class Level {
  static levels = [];

  static addLevel(level) {
    level.id = Level.levels.length + 1;
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
    return window.i18n.get(`${this.type}${this.id}_title`);
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
    };

    super({
      settings: { ...commonSimulationsSettings, ...settings },
      type: "boss",
    });
  }
}

class Match3Level extends Level {
  constructor(settings, getDifficulty, start) {
    const commonSimulationsSettings = {
      totalColors: {
        value: 7,
        min: 4,
        max: 9,
        step: 1,
        label: "match3TotalColorsSettings",
      },
      targetScore: {
        value: 1000,
        min: 300,
        max: 2000,
        step: 50,
        label: "match3TargetScoreSettings",
      },
    };

    super({
      start,
      settings: { ...commonSimulationsSettings, ...settings },
      getDifficulty,
      type: "match3",
    });
  }
}
