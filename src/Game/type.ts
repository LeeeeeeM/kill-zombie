export interface ZombieEnhanceInterface {
  radius: number;
  speed: number;
  health: number;
  isBoss: boolean;
}

export interface BulletEnhancedInterface {
  radius: number;
  angle: number;
  damage: number;
  speed: number;
  explodeRadius: number;
  explodeDamage: number;
  collisionCanvasTimes: number;
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
