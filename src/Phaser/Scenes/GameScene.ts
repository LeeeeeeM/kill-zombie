import Phaser from "phaser";
import Game from "../../Game/Game";

class GameScene extends Phaser.Scene {
  private GameContainer!: Game;
  private rayGraphics!: Phaser.GameObjects.Graphics;
  private alphaDifferenceText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    // 这里可以加载你的资源
  }

  init(): void {
    const canvas = this.sys.canvas;
    this.rayGraphics = this.add.graphics();
    this.GameContainer = new Game(canvas, true);
    this.GameContainer.init();

    this.input.addListener("pointerdown", () => {
      this.GameContainer.shootBullet();
    });
  }

  create() {
    this.GameContainer.run();
    this._draw();
    this._drawResult();
  }

  update() {
    this.GameContainer.gameLoop();
    this._draw();
    this._drawResult();
  }

  private _drawResult() {
    if (this.alphaDifferenceText) {
      this.alphaDifferenceText.destroy();
    }
    const player = this.GameContainer.getPlayer();

    this.alphaDifferenceText = this.add.text(
      20,
      20,
      `LEVEL: ${player.getLevel()}  KILL: ${player.getKill()}`,
      {
        fontFamily: "Arial",
        fontSize: 20 + "px",
        strokeThickness: 1,
        color: "#fff",
      }
    );
  }

  private _draw() {
    this.rayGraphics.clear();
    // 清空画布
    const gameContainer = this.GameContainer;
    const player = gameContainer.getPlayer();
    const zombies = gameContainer.getZombies();
    const bullets = gameContainer.getBullets();
    const explodeBullets = gameContainer.getExplodeBullets();

    // draw player
    this.rayGraphics.fillStyle(0x0000ff, 0.7);
    this.rayGraphics.fillCircle(
      player.getX(),
      player.getY(),
      player.getRadius()
    );

    // draw bullets
    for (let [, bullet] of bullets) {
      this.rayGraphics.fillStyle(0x000000);
      this.rayGraphics.fillCircle(
        bullet.getX(),
        bullet.getY(),
        bullet.getRadius()
      );
    }

    // draw explodeBullets
    for (let [, bullet] of explodeBullets) {
      this.rayGraphics.fillStyle(0xffd700, 0.9);
      this.rayGraphics.fillCircle(
        bullet.getX(),
        bullet.getY(),
        bullet.getRadius()
      );
    }

    // draw zombies
    for (let [, zombie] of zombies) {
      if (zombie.isBoss()) {
        this.rayGraphics.fillStyle(0x556b2f, 0.9);
      } else {
        this.rayGraphics.fillStyle(0xff4500, 0.7);
      }
      this.rayGraphics.fillCircle(
        zombie.getX(),
        zombie.getY(),
        zombie.getRadius()
      );
    }
  }
}

export default GameScene;
