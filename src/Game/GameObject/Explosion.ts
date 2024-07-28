import GameObject from "./GameObject";
import { GameObjectEnum } from "../enum";
import { ExplosionEnhanceInterface } from "../type";

class Explosion extends GameObject {
  private damage: number;
  constructor(x: number, y: number, enhanced: ExplosionEnhanceInterface) {
    super(x, y, enhanced.radius, GameObjectEnum.BULLET_EXPLOSION);
    this.damage = enhanced.damage;
  }

  getDamage() {
    return this.damage;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.getRadius(), 0, Math.PI * 2);
    ctx.fillStyle = "yellow";
    ctx.fill();
  }
}

export default Explosion;
