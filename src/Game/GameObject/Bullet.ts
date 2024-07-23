import GameObject from "./GameObject";
import { DEFAULT_BULLET_ENHANCE_OBJECT } from "../constants";
import { GameObjectEnum } from "../enum";
import { BulletEnhancedInterface } from "../type";

class Bullet extends GameObject {
  public explodeRadius: number;
  private speed: number;
  private angle: number;
  public damage: number;
  public explodeDamage: number;
  private velocity: { vx: number; vy: number };
  constructor(
    x: number,
    y: number,
    enhanced: BulletEnhancedInterface = DEFAULT_BULLET_ENHANCE_OBJECT
  ) {
    super(x, y, enhanced.radius, GameObjectEnum.BULLET);
    this.explodeRadius = enhanced.explodeRadius;
    this.speed = enhanced.speed;
    this.angle = enhanced.angle;
    this.damage = enhanced.damage;
    this.explodeDamage = enhanced.explodeDamage;
    this.velocity = this.calculateVelocity();
  }

  calculateVelocity() {
    const vx = this.speed * Math.cos(this.angle);
    const vy = this.speed * Math.sin(this.angle);
    return { vx, vy };
  }

  update() {
    this.x -= this.velocity.vx;
    this.y -= this.velocity.vy;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    // ctx.strokeStyle = 'blue';
    // ctx.strokeText(this.count, this.x, this.y);
  }

  drawExplode(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.explodeRadius, 0, Math.PI * 2);
    ctx.fillStyle = "yellow";
    ctx.fill();
    // ctx.strokeStyle = 'blue';
    // ctx.strokeText(this.count, this.x, this.y);
  }

  isOffCanvas(yLimit: number = 0, xLimit: number = 0) {
    return (
      this.y + this.r < yLimit ||
      this.x + this.r < 0 ||
      this.x - this.r > xLimit
    );
  }
}

export default Bullet;