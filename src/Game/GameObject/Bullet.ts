import GameObject from "./GameObject";
import { DEFAULT_BULLET_ENHANCE_OBJECT } from "../constants";
import { GameObjectEnum } from "../enum";
import {
  BoundInterface,
  BulletEnhancedInterface,
  VelocityVector,
} from "../type";

class Bullet extends GameObject {
  private explodeRadius: number;
  private collisionWallTimes: number;
  private damage: number;
  private explodeDamage: number;
  private speed: number;
  private angle: number;
  private pierceTimes: number;
  private velocity: VelocityVector;
  private canExplode: boolean;
  constructor(
    x: number,
    y: number,
    enhanced: BulletEnhancedInterface = DEFAULT_BULLET_ENHANCE_OBJECT
  ) {
    super(x, y, enhanced.radius, GameObjectEnum.BULLET);
    this.explodeRadius = enhanced.explodeRadius;
    this.collisionWallTimes = enhanced.collisionWallTimes;
    this.angle = enhanced.angle;
    this.damage = enhanced.damage;
    this.explodeDamage = enhanced.explodeDamage;
    this.pierceTimes = enhanced.pierceTimes;
    this.speed = enhanced.speed;
    this.canExplode = enhanced.canExplode;
    this.velocity = this._calculateVelocityVector();
  }

  static bulletPool: Bullet[] = [];

  static bulletPoolCount = 100;

  static createBullet(x: number, y: number, enhanced: BulletEnhancedInterface): Bullet {
    let newBullet = Bullet.bulletPool.pop();
    if (!newBullet) {
      return new Bullet(x, y, enhanced);
    }
    newBullet.reset(x, y, enhanced);
    return newBullet;
  }

  static release(bullet: Bullet) {
    if (Bullet.bulletPool.length < Bullet.bulletPoolCount) {
      Bullet.bulletPool.push(bullet);
    }
  }

  reset(
    x: number,
    y: number,
    enhanced: BulletEnhancedInterface = DEFAULT_BULLET_ENHANCE_OBJECT
  ) {
    this.x = x;
    this.y = y;
    this.r = enhanced.radius;
    this.explodeRadius = enhanced.explodeRadius;
    this.collisionWallTimes = enhanced.collisionWallTimes;
    this.angle = enhanced.angle;
    this.damage = enhanced.damage;
    this.explodeDamage = enhanced.explodeDamage;
    this.pierceTimes = enhanced.pierceTimes;
    this.canExplode = enhanced.canExplode;
    this.speed = enhanced.speed;
    this.velocity = this._calculateVelocityVector();
  }

  getDamage() {
    return this.damage;
  }

  isExplosive() {
    return this.canExplode;
  }

  hasLeftCollision() {
    return this.collisionWallTimes > 0;
  }

  _calculateVelocityVector(): VelocityVector {
    const vx = -this.speed * Math.cos(this.angle);
    const vy = -this.speed * Math.sin(this.angle);
    return { vx, vy };
  }

  _updateVelocityXVector() {
    this.velocity.vx = -this.velocity.vx;
  }

  _updateVelocityYVector() {
    this.velocity.vy = -this.velocity.vy;
  }

  _isCollisionX(leftLimit: number, rightLimit: number) {
    return this.x - this.r <= leftLimit || this.x + this.r >= rightLimit;
  }

  _isCollisionY(topLimit: number, bottomLimit: number) {
    return this.y - this.r <= topLimit || this.y + this.r >= bottomLimit;
  }

  hasPierceTimes() {
    return this.pierceTimes > 0;
  }

  checkPierce() {
    if (this.pierceTimes <= 0) return;
    this.pierceTimes--;
  }

  checkBound(bound: BoundInterface) {
    // 如果碰撞次数小于0，直接返回
    if (this.collisionWallTimes <= 0) return;
    if (this._isCollisionX(bound.left, bound.right)) {
      this._updateVelocityXVector();
      this.collisionWallTimes--;
    }
    if (this._isCollisionY(bound.top, bound.bottom)) {
      this._updateVelocityYVector();
      this.collisionWallTimes--;
    }
  }

  update() {
    this.x += this.velocity.vx;
    this.y += this.velocity.vy;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    // ctx.strokeStyle = 'blue';
    // ctx.strokeText(this.count, this.x, this.y);
  }

  getExplodeRadius() {
    return this.explodeRadius;
  }

  getExpoldeDamage() {
    return this.explodeDamage;
  }

}

export default Bullet;
