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

  constructor({ onStart, type }) {
    this.id = null;
    this.type = type;
    this.onStart = onStart.bind(this);
  }

  getTitle() {
    return window.i18n.get(`${this.type}${this.id}_title`);
  }

  getDescription() {
    return window.i18n.get(`${this.type}${this.id}.description`);
  }

  onStart() {
    throw new Error("onStart method must be implemented in subclass");
  }
}

class PlatformsLevel extends Level {
  constructor(onStart) {
    super({ onStart, type: "platforms" });
  }
}

class RacingLevel extends Level {
  constructor(onStart) {
    super({ onStart, type: "racing" });
  }
}

class BossLevel extends Level {
  constructor(onStart) {
    super({ onStart, type: "boss" });
  }
}
