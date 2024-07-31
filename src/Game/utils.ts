import { Circle } from "@timohausmann/quadtree-ts";
import Vector from "./Object/Vector";

export const getRandomRange = (start: number, end: number): number => {
  if (start > end) {
    return Math.random() * (start - end) + end;
  }
  return Math.random() * (end - start) + start;
};

export const calculateRangeAngles = (bulletCount: number): number[] => {
  const angles: number[] = [0];
  const angleIncrement = Math.PI / 6 / (bulletCount + 1); // 计算角度增量

  let sign = 1;

  for (let i = 1; i < bulletCount; i++) {
    angles.push(Math.floor((i + 1) / 2) * sign * angleIncrement);
    sign *= -1;
  }

  return angles;
};

export const calculateAngle = (
  source: Circle | null,
  target: Circle | null
): number => {
  if (!target || !source) {
    // 如果没有则默认为90度垂直
    return Math.PI / 2;
  }
  const dx = source.x - target.x;
  const dy = source.y - target.y;
  return Math.atan2(dy, dx);
};

export const calculateInterceptAngle = (
  source: Circle,
  target: Circle | null,
  sourceSpeed: number,
  targetSpeed: number = 0
): number => {
  if (!target) return -Math.PI / 2;
  const sourcePos = new Vector(source.x, source.y);
  const targetPos = new Vector(target.x, target.y);
  const targetVel = new Vector(0, targetSpeed);
  const relativePos = targetPos.subtract(sourcePos);
  const effectiveRadius = source.r + target.r;
  // 修改二次方程系数
  const a =
    sourceSpeed * sourceSpeed -
    targetVel.x * targetVel.x -
    targetVel.y * targetVel.y;
  const b = 2 * (targetVel.x * relativePos.x + targetVel.y * relativePos.y);
  const c =
    -relativePos.x * relativePos.x -
    relativePos.y * relativePos.y +
    effectiveRadius * effectiveRadius;

  // 求解二次方程
  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) {
    return -Math.PI / 2;
  }

  const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
  const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);
  const t = Math.max(t1, t2);

  if (t < 0) {
    return -Math.PI / 2;
  }

  const interceptPos = targetPos.add(targetVel.multiply(t));

  // const bulletVec = interceptPos.subtract(sourcePos).multiply(1 / t); // 可以不归一化直接计算
  const bulletVec = interceptPos.subtract(sourcePos);

  return bulletVec.getRad();
};
