import { Circle } from "@timohausmann/quadtree-ts";
import { GameObjectEnum } from "../enum";

// for debug
let data = 0;

class GameObject extends Circle {
  x: number;
  y: number;
  r: number;
  public count: string;
  public type: GameObjectEnum;
  constructor(x: number, y: number, r: number, type: GameObjectEnum) {
    super({
      x,
      y,
      r,
    });
    this.x = x;
    this.y = y;
    this.r = r;
    this.type = type;
    this.count = `${++data}`;
  }

  update() {}

  draw(ctx: CanvasRenderingContext2D) {}

  isZombie() {
    return this.type === GameObjectEnum.ZOMBIE;
  }

  circleIntersect(other: Circle) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= this.r + other.r;
  }
}

export default GameObject;
