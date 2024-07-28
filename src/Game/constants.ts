import { BulletEnhancedInterface, ExplosionEnhanceInterface, PlayerEnhancedInterface, ZombieEnhanceInterface } from "./type";

export const DEFAULT_ZOMBIE_ENHANCE_OBJECT: ZombieEnhanceInterface = {
  radius: 10,
  speed: 0.2,
  health: 50,
  isBoss: false,
};

export const DEFAULT_ZOMBIE_BOSS_ENHANCE_OBJECT: ZombieEnhanceInterface = {
  radius: 20,
  speed: 0.2,
  health: 500,
  isBoss: true,
};

export const DEFAULT_BULLET_ENHANCE_OBJECT: BulletEnhancedInterface = {
  radius: 3,
  angle: Math.PI / 2,
  damage: 30,
  speed: 10,
  canExplode: true,
  explodeRadius: 20,
  explodeDamage: 1,
  collisionWallTimes: 0,
  pierceTimes: 2
};

export const DEFAULT_BULLET_EXPLOSION_ENHANCE_OBJECT: ExplosionEnhanceInterface = {
  radius: 20,
  damage: 10,
};

export const DEFAULT_PLAYER_ENHANCE_OBJECT: PlayerEnhancedInterface = {
  radius: 10,
  damage: 3,
  trajectoryCount: 1,
  collisionWallTimes: 0,
  comboTimes: 1,
  pierceTimes: 2
};

export const LEVEL_UP_KILL_COUNT = 2 * 6;

export const FAST_UPDATE = true;
