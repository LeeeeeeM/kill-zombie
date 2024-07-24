import GameObject from "./GameObject";
import Zombie from "./Zombie";
import { GameObjectEnum } from "../enum";
import { LEVEL_UP_KILL_COUNT } from "../constants";

class Player extends GameObject {
  damage: number;
  killCount: number;
  level: number;
  trajectoryCount: number;
  collisionWallTimes: number;
  fireTimes: number;
  constructor(x: number, y: number) {
    super(x, y, 10, GameObjectEnum.PLAYER);
    this.damage = 30;
    this.killCount = 0;
    this.level = 1;
    this.trajectoryCount = 1;
    this.collisionWallTimes = 0;
    this.fireTimes = 1;
  }

  getStandX() {
    return this.x;
  }

  getStandY() {
    return this.y;
  }

  updateFireTimes(fireTimes: number) {
    this.fireTimes = fireTimes;
  }

  updatetrajectoryCount(trajectoryCount: number) {
    this.trajectoryCount = trajectoryCount;
  }

  updateDamage(damage: number) {
    this.damage = damage;
  }

  updateCollisionCanvasTimes(times: number) {
    this.collisionWallTimes = times;
  }

  addKill(z: Zombie) {
    if (z.isBoss()) {
      this.killCount += 10;
    } else {
      this.killCount++;
    }
    // 打死N个升级
    if (
      this.killCount % (LEVEL_UP_KILL_COUNT * Math.pow(6, this.level - 1)) ===
      0
    ) {
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
    this.updatetrajectoryCount(this.trajectoryCount + 1);
    this.updateCollisionCanvasTimes(this.collisionWallTimes + 1);
    this.updateFireTimes(this.fireTimes + 1);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
  }
}

export default Player;
