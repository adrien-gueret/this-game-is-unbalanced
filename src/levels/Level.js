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
    this.getDifficulty = getDifficulty.bind(this);
    this.start = start.bind(this);
  }

  getTitle() {
    return window.i18n.get(`${this.type}${this.id}_title`);
  }

  getDescription() {
    return window.i18n.get(`${this.type}${this.id}.description`);
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

class RacingLevel extends Level {
  constructor(settings, getDifficulty, start) {
    super({ start, settings, getDifficulty, type: "racing" });
  }
}

class BossLevel extends Level {
  constructor(settings, getDifficulty, start) {
    super({ start, settings, getDifficulty, type: "boss" });
  }
}
