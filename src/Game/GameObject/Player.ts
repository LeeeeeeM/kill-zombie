import GameObject from "./GameObject";
import Zombie from "./Zombie";
import { GameObjectEnum } from "../enum";

class Player extends GameObject {
  damage: number;
  killCount: number;
  level: number;
  bulletCount: number;
  constructor(x: number, y: number) {
    super(x, y, 10, GameObjectEnum.PLAYER);
    this.damage = 30;
    this.killCount = 0;
    this.level = 1;
    this.bulletCount = 1;
  }

  updateBulletCount(bulletCount: number) {
    this.bulletCount = bulletCount;
  }

  updateDamage(damage: number) {
    this.damage = damage;
  }

  addKill(z: Zombie) {
    if (z.isBoss()) {
      this.killCount += 10;
    } else {
      this.killCount++;
    }
    // 打死100个升级
    if (this.killCount % 100 === 0) {
      this.levelUp();
    }
  }

  getLevel() {
    return this.level;
  }

  levelUp() {
    if (this.level > 2) return;
    console.log("level up!!!");
    this.level++;
    this.updateDamage(this.damage + 10);
    this.updateBulletCount(this.bulletCount + 1);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
  }
}

export default Player;
