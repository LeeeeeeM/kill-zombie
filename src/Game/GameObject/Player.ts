import GameObject from "./GameObject";
import Zombie from "./Zombie";
import { GameObjectEnum } from "../enum";
import { DEFAULT_BULLET_ENHANCE_OBJECT, LEVEL_UP_KILL_COUNT } from "../constants";
import { BulletConstructorProps, BulletEnhancedInterface } from "../type";

class Player extends GameObject {
  damage: number;
  killCount: number;
  level: number;
  // 弹道数量
  trajectoryCount: number;
  // 和墙体碰撞次数
  collisionWallTimes: number;
  // 连击数
  comboTimes: number;
  constructor(x: number, y: number) {
    super(x, y, 10, GameObjectEnum.PLAYER);
    this.damage = 30;
    this.killCount = 0;
    this.level = 1;
    this.trajectoryCount = 1;
    this.collisionWallTimes = 0;
    this.comboTimes = 1;
  }

  getStandX() {
    return this.x;
  }

  getStandY() {
    return this.y;
  }

  // 更新连击数
  updateComboTimes(comboTimes: number) {
    this.comboTimes = comboTimes;
  }

  // 更新弹道数
  updatetrajectoryCount(trajectoryCount: number) {
    this.trajectoryCount = trajectoryCount;
  }

  // 更新伤害
  updateDamage(damage: number) {
    this.damage = damage;
  }

  // 更新碰撞墙壁次数
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
    this.updateComboTimes(this.comboTimes + 1);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
  }


  _calculateAngle(target: GameObject | null): number {
    if (!target) {
      // 如果没有则默认为90度垂直
      return Math.PI / 2;
    }
    const dx = this.x - target.x;
    const dy = this.y - target.y;
    return Math.atan2(dy, dx);
  }

  _calculateRangeAngles(): number[] {
    const angles: number[] = [0];
    const angleIncrement = Math.PI / 6 / (this.trajectoryCount + 1); // 计算角度增量
  
    let sign = 1;
  
    for (let i = 1; i < this.trajectoryCount; i++) {
      angles.push(Math.floor((i + 1) / 2) * sign * angleIncrement);
      sign *= -1;
    }
  
    return angles;
  }

  shotBullets(target: GameObject | null): BulletConstructorProps[] {
    const bulletsProps: BulletConstructorProps[] = [];
    const angles = this._calculateRangeAngles();
    for (let angle of angles) {
      const adjustedAngle = this._calculateAngle(target);
      const enhanced: BulletEnhancedInterface = {
        ...DEFAULT_BULLET_ENHANCE_OBJECT,
        damage: this.damage,
        angle: adjustedAngle + angle,
        collisionWallTimes: this.collisionWallTimes,
      };

      const newBullet = {
        x: this.getStandX(),
        y: this.getStandY(),
        enhanced
      };
      bulletsProps.push(newBullet);
    }

    return bulletsProps;
  }
}

export default Player;
