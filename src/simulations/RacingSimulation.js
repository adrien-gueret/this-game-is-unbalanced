// TODO: https://phaser.io/examples/v3.85.0/physics/arcade/view/racecar
/**
 * RacingSimulation - Simulation d'un niveau de course
 *
 * Cette classe gère la simulation des niveaux de type racing.
 */
class RacingSimulation {
  constructor(scene) {
    this.scene = scene;
    this.timerValue = 0;
    this.simulationTimer = null;
  }

  async startLevel(level) {
    const { width, height } = this.scene.cameras.main;

    /*
    // Activer le debug pour voir les hitboxes
    this.scene.physics.world.createDebugGraphic();
    this.scene.physics.world.debugGraphic.visible = true;
    
    // Configuration optionnelle des couleurs du debug
    this.scene.physics.world.defaults.debugShowBody = true;
    this.scene.physics.world.defaults.bodyDebugColor = 0xff00ff; // Rose vif pour mieux voir
    */

    // Appliquer le masque au joueur
    //this.scene.applyGameMask(player);

    /*const courseBackground = this.scene.add
      .image(width / 2, height, "course")
      .setScale(8, 4)
      .setSkew(0, -0.2)
      .setOrigin(0.5, 1);*/

    const courseBackground = this.scene.add
      .dom()
      .createFromHTML("<div>DIV</div>");

    // Pour un vrai effet de perspective 3D, on peut aussi utiliser la propriété setDepth
    courseBackground.setDepth(0);

    this.scene.applyGameMask(courseBackground);

    level.start({
      scene: this.scene,
    });

    showMessage(
      this.scene,
      window.i18n.get("watchInstruction"),
      "#ffffff",
      () => {
        //this.startSimulation(player, level);
      },
      window.i18n.get("clickToStart")
    );
  }

  /**
   * Démarre la simulation du niveau de course
   */
  startSimulation(player, level) {
    const { height, width } = this.scene.cameras.main;

    const timerText = this.scene.add
      .text(
        width - 40,
        100,
        window.i18n.get("timer")(0, level.settings.timeLimit.value),
        {
          fontSize: "24px",
          fontFamily: "Arial",
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 4,
        }
      )
      .setOrigin(1, 0.5);

    if (this.simulationTimer) {
      this.simulationTimer.remove();
    }

    this.simulationTimer = this.scene.time.addEvent({
      delay: 16.6, // ~60 fps
      callback: () => {
        this.timerValue += 0.016;
        timerText.setText(
          window.i18n.get("timer")(
            Math.floor(this.timerValue),
            level.settings.timeLimit.value
          )
        );

        if (this.timerValue >= level.settings.timeLimit.value) {
          this.completeSimulation("TIMEOUT", level.settings.timeLimit.value);
          return;
        }
      },
      callbackScope: this,
      loop: true,
    });
  }

  completeSimulation(finishReason, timeLimit, difficulty) {
    this.simulationTimer.remove();

    let isBalanced = false;
    let feedback = "";
    let monsterAnimation = undefined;
    let monsterStaticFrame = undefined;

    // Variable pour stocker le message à afficher
    let message = "";
    let messageColor = "#ffffff";

    switch (finishReason) {
      case "SUCCESS":
        message = window.i18n.get("platformsSuccess");
        messageColor = "#7CFC00";

        const timerRatio = Math.floor((this.timerValue / timeLimit) * 100);

        switch (difficulty) {
          case "easy":
            feedback = window.i18n.get("gameFeedbackTooEasy");
            monsterAnimation = "oopsy";
            break;

          case "hard":
            feedback = window.i18n.get("gameFeedbackTooHard");
            monsterStaticFrame = 6;
            break;

          case "medium":
            if (timerRatio <= 40) {
              feedback = window.i18n.get("platformsFeedbackTooFarLimit");
              monsterAnimation = "oopsy";
            } else if (timerRatio >= 80) {
              feedback = window.i18n.get("platformsFeedbackTooNearLimit");
              monsterStaticFrame = 6;
            } else {
              feedback = window.i18n.get("gameFeedbackBalanced");
              monsterAnimation = "happy";
              isBalanced = true;
            }

            break;
        }

        break;
    }

    showMessage(this.scene, message, messageColor, () => {
      // Emit an event to notify the scene that the simulation is complete
      this.scene.events.emit("simulationComplete", {
        feedback,
        isBalanced,
        monsterAnimation,
        monsterStaticFrame,
      });
    });
  }
}
