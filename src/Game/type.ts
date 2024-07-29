export interface ZombieEnhanceInterface {
  radius: number;
  speed: number;
  health: number;
  isBoss: boolean;
}

export interface ExplosionEnhanceInterface {
  radius: number;
  damage: number;
}

export interface BulletEnhancedInterface {
  radius: number;
  angle: number;
  damage: number;
  speed: number;
  canExplode: boolean;
  explodeRadius: number;
  explodeDamage: number;
  collisionWallTimes: number;
  pierceTimes: number;
}

export interface PlayerEnhancedInterface {
  radius: number;
  damage: number;
  trajectoryCount: number;
  collisionWallTimes: number;
  comboTimes: number;
  pierceTimes: number;
  speed: number;
}

export interface VelocityVector {
  vx: number;
  vy: number;
}

export interface BoundInterface {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface BulletConstructorProps {
  x: number;
  y: number;
  enhanced: BulletEnhancedInterface;
}
