import { Circle } from "@timohausmann/quadtree-ts";
import { GameObjectEnum } from "../enum";
import { BoundInterface } from "../type";

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

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  getRadius() {
    return this.r;
  }

  draw(ctx: CanvasRenderingContext2D) {}

  circleIntersect(other: Circle) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= this.r + other.r;
  }

  isOffCanvas(bound: BoundInterface) {
    return (
      this.y + this.r < bound.top ||
      this.y - this.r > bound.bottom ||
      this.x + this.r < bound.left ||
      this.x - this.r > bound.right
    );
  }
}

export default GameObject;
