import GameObject from "./GameObject";
import { GameObjectEnum } from "../enum";
import { CircleInterface, ZombieEnhanceInterface } from "../type";
import { Circle } from "@timohausmann/quadtree-ts";

class Zombie extends GameObject {
  private speed: number;
  private health: number;
  private is_boss: boolean;
  private hit_area: CircleInterface[];
  constructor(x: number, y: number, enhanced: ZombieEnhanceInterface) {
    super(x, y, enhanced.radius, GameObjectEnum.ZOMBIE);
    this.speed = enhanced.speed;
    this.health = enhanced.health;
    this.is_boss = enhanced.isBoss;
    this.hit_area = [{
      x: 0,
      y: 0,
      r: enhanced.hitRadius
    }];
  }

  getSpeed() {
    return this.speed;
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

  checkHited(circle: Circle) {
    for (let i = 0; i < this.hit_area.length; i++) {
      const area = this.hit_area[i];
      if (this.circleIntersect({ x: this.x + area.x, y: this.y + area.y, r: area.r } as Circle, circle)) {
        return true;
      }
    }
    return false;
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
}

export default Zombie;
