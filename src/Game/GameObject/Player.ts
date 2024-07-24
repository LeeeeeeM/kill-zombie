import GameObject from "./GameObject";
import Zombie from "./Zombie";
import { GameObjectEnum } from "../enum";
import { LEVEL_UP_KILL_COUNT } from "../constants";

class Player extends GameObject {
  damage: number;
  killCount: number;
  level: number;
  bulletCount: number;
  collisionCanvasTimes: number;
  constructor(x: number, y: number) {
    super(x, y, 10, GameObjectEnum.PLAYER);
    this.damage = 30;
    this.killCount = 0;
    this.level = 1;
    this.bulletCount = 1;
    this.collisionCanvasTimes = 0;
  }

  updateBulletCount(bulletCount: number) {
    this.bulletCount = bulletCount;
  }

  updateDamage(damage: number) {
    this.damage = damage;
  }

  updateCollisionCanvasTimes(times: number) {
    this.collisionCanvasTimes = times;
  }

  addKill(z: Zombie) {
    if (z.isBoss()) {
      this.killCount += 10;
    } else {
      this.killCount++;
    }
    // 打死100个升级
    if (
      this.killCount % (LEVEL_UP_KILL_COUNT * Math.pow(4, this.level - 1)) ===
      0
    ) {
      this.levelUp();
    }
  }

  getLevel() {
    return this.level;
  }

  levelUp() {
    if (this.level > 3) return;
    console.log("level up!!!");
    this.level++;
    this.updateDamage(this.damage + 10);
    this.updateBulletCount(this.bulletCount + 1);
    this.updateCollisionCanvasTimes(this.collisionCanvasTimes + 1);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
  }
}

export default Player;
