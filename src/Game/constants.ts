import { BulletEnhancedInterface, ZombieEnhanceInterface } from "./type";

export const DEFAULT_ZOMBIE_ENHANCE_OBJECT: ZombieEnhanceInterface = {
  radius: 10,
  speed: 0.2,
  health: 100,
  isBoss: false,
};

export const DEFAULT_BULLET_ENHANCE_OBJECT: BulletEnhancedInterface = {
  radius: 5,
  angle: Math.PI / 2,
  damage: 30,
  speed: 10,
  explodeRadius: 50,
  explodeDamage: 10,
  collisionCanvasTimes: 2,
};


export const LEVEL_UP_KILL_COUNT = 2 * 6;
