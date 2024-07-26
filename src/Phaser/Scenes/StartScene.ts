import Phaser from "phaser";
// import { CONST } from '../const/const';

export class StartScene extends Phaser.Scene {
  private startKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({
      key: "StartScene",
    });
  }

  init(): void {
    this.startKey = this.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.S
    )!;
    this.input.addListener("pointerdown", () => {
      this._startGame();
    });
  }

  _startGame() {
    console.log("Starting the game...");
    // 切换到游戏场景
    this.scene.start("GameScene");
  }

  preload(): void {}

  create(): void {
    this.add.text(50, 50, "PRESS S TO PLAY", {
      fontFamily: "Arial",
      fontSize: 20 + "px",
      stroke: "#fff",
      strokeThickness: 5,
      color: "#000000",
    });
  }

  update(): void {
    if (this.startKey.isDown) {
      this.scene.start("GameScene");
    }
  }
}
