import GameObject from "./GameObject";
import { GameObjectEnum } from "../enum";
import { ZombieEnhanceInterface } from "../type";

class Zombie extends GameObject {
  private speed: number;
  private health: number;
  private is_boss: boolean;
  constructor(x: number, y: number, enhanced: ZombieEnhanceInterface) {
    super(x, y, enhanced.radius, GameObjectEnum.ZOMBIE);
    this.speed = enhanced.speed;
    this.health = enhanced.health;
    this.is_boss = enhanced.isBoss;
  }

  update() {
    this.y += this.speed; // Zombies move down
  }

  hitHealth(hit: number) {
    this.health -= hit;
  }

  isBoss() {
    return this.is_boss;
  }

  isDead() {
    return this.health <= 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    if (this.is_boss) {
      ctx.fillStyle = "green";
    }
    ctx.fill();
    ctx.strokeStyle = "blue";
    ctx.strokeText(`${this.health}`, this.x, this.y);
  }

  isOffCanvas(yLimit: number) {
    return this.y - this.r > yLimit;
  }
}

export default Zombie;
