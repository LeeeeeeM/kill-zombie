import { Quadtree, Circle } from "@timohausmann/quadtree-ts";

// for debug
let data = 0;

enum GameObjectEnum {
  ZOMBIE = "ZOMBIE",
  BULLET = "BULLET",
  PLAYER = "PLAYER",
}

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

interface ZombieEnhanceInterface {
  radius: number;
  speed: number;
  health: number;
  isBoss: boolean;
}

const DEFAULT_ZOMBIE_ENHANCE_OBJECT = {
  radius: 10,
  speed: 0.2,
  health: 100,
  isBoss: false,
};

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

class Player extends GameObject {
  damage: number;
  killCount: number;
  level: number;
  constructor(x: number, y: number) {
    super(x, y, 10, GameObjectEnum.PLAYER);
    this.damage = 30;
    this.killCount = 0;
    this.level = 1;
  }

  updateDamage(damage: number) {
    this.damage = damage;
  }

  addKill(z: Zombie) {
    if (z.isBoss()) {
      this.killCount += 10;
    } else {
      this.killCount++;
    }
    // 打死100个升级
    if (this.killCount % 100 === 0) {
      this.levelUp();
    }
  }

  getLevel() {
    return this.level;
  }

  levelUp() {
    if (this.level > 2) return;
    console.log("level up!!!");
    this.level++;
    this.updateDamage(this.damage + 10);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
  }
}

interface BulletEnhancedInterface {
  radius: number;
  angle: number;
  damage: number;
  speed: number;
  explodeRadius: number;
  explodeDamage: number;
}

const DEFAULT_BULLET_ENHANCE_OBJECT = {
  radius: 5,
  angle: Math.PI / 2,
  damage: 30,
  speed: 10,
  explodeRadius: 50,
  explodeDamage: 10,
};

class Bullet extends GameObject {
  public explodeRadius: number;
  private speed: number;
  private angle: number;
  public damage: number;
  public explodeDamage: number;
  private velocity: { vx: number; vy: number };
  constructor(
    x: number,
    y: number,
    enhanced: BulletEnhancedInterface = DEFAULT_BULLET_ENHANCE_OBJECT
  ) {
    super(x, y, enhanced.radius, GameObjectEnum.BULLET);
    this.explodeRadius = enhanced.explodeRadius;
    this.speed = enhanced.speed;
    this.angle = enhanced.angle;
    this.damage = enhanced.damage;
    this.explodeDamage = enhanced.explodeDamage;
    this.velocity = this.calculateVelocity();
  }

  calculateVelocity() {
    const vx = this.speed * Math.cos(this.angle);
    const vy = this.speed * Math.sin(this.angle);
    return { vx, vy };
  }

  update() {
    this.x -= this.velocity.vx;
    this.y -= this.velocity.vy;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    // ctx.strokeStyle = 'blue';
    // ctx.strokeText(this.count, this.x, this.y);
  }

  drawExplode(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.explodeRadius, 0, Math.PI * 2);
    ctx.fillStyle = "yellow";
    ctx.fill();
    // ctx.strokeStyle = 'blue';
    // ctx.strokeText(this.count, this.x, this.y);
  }

  isOffCanvas(yLimit: number = 0, xLimit: number = 0) {
    return (
      this.y + this.r < yLimit ||
      this.x + this.r < 0 ||
      this.x - this.r > xLimit
    );
  }
}

const getRandomRange = (start: number, end: number): number => {
  if (start > end) {
    return Math.random() * (start - end) + end;
  }
  return Math.random() * (end - start) + start;
};

const calculateRangeAngles = (bulletCount: number): number[] => {
  const angles: number[] = [0];
  const angleIncrement = Math.PI / 6 / (bulletCount + 1); // 计算角度增量

  let sign = 1;

  for (let i = 1; i < bulletCount; i++) {
    angles.push(Math.floor((i + 1) / 2) * sign * angleIncrement);
    sign *= -1;
  }

  return angles;
};

class Spawner {
  private spawnInterval: number;
  private lastSpawnTime: number;
  private pausedTime: number;
  private isActive: boolean;
  game: Game;
  constructor(game: Game, spawnInterval: number) {
    this.game = game;
    this.spawnInterval = spawnInterval;
    this.lastSpawnTime = Date.now();
    this.pausedTime = 0;
    this.isActive = false;
  }

  setInterval(rate: number) {
    this.spawnInterval *= rate;
  }

  spawn() {}

  start() {
    this.isActive = true;
    this.lastSpawnTime = Date.now() - this.pausedTime;
    this.pausedTime = 0;
  }

  stop() {
    this.isActive = false;
    this.pausedTime += Date.now() - this.lastSpawnTime;
  }

  update() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - this.lastSpawnTime;
    if (elapsedTime >= this.spawnInterval && this.isActive) {
      this.spawn();
      this.lastSpawnTime = currentTime - (elapsedTime % this.spawnInterval);
    }
  }
}

class ZombieSpawner extends Spawner {
  constructor(game: Game, spawnInterval: number) {
    super(game, spawnInterval);
  }

  spawn() {
    const start = 10;
    const end = this.game.canvas.width - 10;
    for (let i = 0; i < 3; i++) {
      const position = getRandomRange(start, end);
      this.game.addZombie(position);
    }
  }
}

class ZombieBossSpawner extends Spawner {
  constructor(game: Game, spawnInterval: number) {
    super(game, spawnInterval);
  }

  spawn() {
    const center = this.game.canvas.width / 2;
    const start = center - 20;
    const end = center + 20;
    const position = getRandomRange(start, end);
    this.game.addZombieBoss(position);
  }
}

class BulletSpawner extends Spawner {
  constructor(game: Game, spawnInterval: number) {
    super(game, spawnInterval);
  }
  spawn() {
    this.game.shootBullet(3);
  }
}

export class Game {
  public canvas: HTMLCanvasElement;

  private ctx: CanvasRenderingContext2D;

  private quadTree: Quadtree<Circle>;

  private zombies: Map<string, Zombie>;

  private bullets: Map<string, Bullet>;

  private player: Player;

  private explodeBullets: Map<string, Bullet>;

  private running: boolean;

  private shotTargetZombie: Zombie | null;

  private zombieSpawner: ZombieSpawner;

  private zombieBossSpawner: ZombieBossSpawner;

  private bulletSpawner: BulletSpawner;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d")!;
    this.quadTree = new Quadtree({
      width: this.canvas.width,
      height: this.canvas.height,
    });
    this.zombies = new Map();
    this.bullets = new Map();
    this.explodeBullets = new Map();
    this.running = false;
    this.player = new Player(this.canvas.width / 2, this.canvas.height - 20);
    this.shotTargetZombie = null;

    this.zombieSpawner = new ZombieSpawner(this, 600);
    this.zombieBossSpawner = new ZombieBossSpawner(this, 10 * 1000);
    this.bulletSpawner = new BulletSpawner(this, 200);
  }

  getPlayer() {
    return this.player;
  }

  isRunning() {
    return this.running;
  }

  pause() {
    this.running = false;
    this.stopSpawner();
  }

  init() {
    // todo 初始化的一些操作
    this.update = this.update.bind(this);
    this.draw = this.draw.bind(this);
    this.gameLoop = this.gameLoop.bind(this);
    this.handleCollisions = this.handleCollisions.bind(this);
  }

  generateGameObject() {
    this.zombieSpawner.update();
    this.zombieBossSpawner.update();
    this.bulletSpawner.update();
  }

  startSpawner() {
    this.zombieSpawner.start();
    this.zombieBossSpawner.start();
    this.bulletSpawner.start();
  }

  stopSpawner() {
    this.zombieSpawner.stop();
    this.zombieBossSpawner.stop();
    this.bulletSpawner.stop();
  }

  run() {
    if (this.running) return;
    this.running = true;
    this.startSpawner();
    this.gameLoop();
  }

  gameLoop() {
    if (!this.running) return;
    this.update();
    this.draw();
    this.handleCollisions();
    requestAnimationFrame(this.gameLoop);
  }

  // 更新距离最近的僵尸
  updateTargetZombie(targetLine: number, zombie: Zombie) {
    if (!this.shotTargetZombie) {
      this.shotTargetZombie = zombie;
      return;
    }
    if (zombie.y > targetLine) return;
    if (zombie.y > this.shotTargetZombie.y) {
      this.shotTargetZombie = zombie;
    }
  }

  update() {
    // 生成新的游戏对象
    this.generateGameObject();
    // 清空四叉树数据
    // this.quadTree.clear();
    this.shotTargetZombie = null;

    for (let [, zombie] of this.zombies) {
      zombie.update();
      if (zombie.isOffCanvas(this.canvas.height)) {
        this.zombies.delete(zombie.count);
        this.quadTree.remove(zombie, true);
      } else {
        this.updateTargetZombie(this.canvas.height - 20, zombie);
        this.quadTree.update(zombie, true);
        // this.quadTree.insert(zombie);
      }
    }
    for (let [, bullet] of this.bullets) {
      bullet.update();

      if (bullet.isOffCanvas(0, this.canvas.width)) {
        this.bullets.delete(bullet.count);
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawQuadtree(this.quadTree, this.ctx);

    this.player.draw(this.ctx);

    for (let [, zombie] of this.zombies) {
      zombie.draw(this.ctx);
    }
    for (let [, bullet] of this.bullets) {
      bullet.draw(this.ctx);
    }
    for (let [, explodeBullet] of this.explodeBullets) {
      explodeBullet.drawExplode(this.ctx);
    }
  }

  handleCollisions() {
    // 先处理爆炸效果
    for (let [, explodeBullet] of this.explodeBullets) {
      const detectCircle = new Circle({
        x: explodeBullet.x,
        y: explodeBullet.y,
        r: explodeBullet.explodeRadius,
      });
      const affectZombies = this.quadTree.retrieve(detectCircle) as Zombie[];

      for (let zombie of affectZombies) {
        if (zombie.circleIntersect(detectCircle)) {
          zombie.hitHealth(explodeBullet.explodeDamage);
          if (zombie.isDead()) {
            this.player.addKill(zombie);
            this.zombies.delete(zombie.count);
            this.quadTree.remove(zombie, true);
            break; // 避免重复删除
          }
        }
      }

      // 移除所有的爆炸子弹
      this.explodeBullets.delete(explodeBullet.count);
    }

    for (let [, bullet] of this.bullets) {
      const detectCircle = new Circle({
        x: bullet.x,
        y: bullet.y,
        r: bullet.r,
      });
      const affectZombies = this.quadTree.retrieve(detectCircle) as Zombie[];

      for (let zombie of affectZombies) {
        if (zombie.circleIntersect(detectCircle)) {
          // 从普通子弹中移除
          this.bullets.delete(bullet.count);
          // 存储在下一帧需要爆炸的子弹映射中
          this.explodeBullets.set(bullet.count, bullet);

          zombie.hitHealth(bullet.damage);
          if (zombie.isDead()) {
            this.player.addKill(zombie);
            this.zombies.delete(zombie.count);
            this.quadTree.remove(zombie, true);
            break; // 避免重复删除
          }
        }
      }
    }
  }

  calculateAngle(source: GameObject | null, target: GameObject | null): number {
    if (!target || !source) {
      // 如果没有则默认为90度垂直
      return Math.PI / 2;
    }
    const dx = source.x - target.x;
    const dy = source.y - target.y;
    return Math.atan2(dy, dx);
  }

  drawQuadtree(node: Quadtree<Circle>, ctx: CanvasRenderingContext2D) {
    if (node.nodes.length === 0) {
      ctx.strokeStyle = `rgba(127,255,212,0.25)`;
      ctx.strokeRect(
        node.bounds.x,
        node.bounds.y,
        node.bounds.width,
        node.bounds.height
      );
    } else {
      for (let i = 0; i < node.nodes.length; i = i + 1) {
        this.drawQuadtree(node.nodes[i], ctx);
      }
    }
  }

  shootBullet(bulletCount: number = 1) {
    const player = this.player;
    const target = this.shotTargetZombie;

    const angles = calculateRangeAngles(bulletCount);

    for (let angle of angles) {
      const enhanced: BulletEnhancedInterface = {
        ...DEFAULT_BULLET_ENHANCE_OBJECT,
        damage: player.damage,
        angle: this.calculateAngle(player, target) + angle,
      };
      const newBullet = new Bullet(
        this.canvas.width / 2,
        this.canvas.height - 20,
        enhanced
      );
      this.bullets.set(newBullet.count, newBullet);
    }
  }

  addZombie(x: number) {
    const enhanced: ZombieEnhanceInterface = {
      ...DEFAULT_ZOMBIE_ENHANCE_OBJECT,
    };
    const newZombie = new Zombie(x, 0, enhanced);
    this.zombies.set(newZombie.count, newZombie);
    this.quadTree.insert(newZombie);
  }

  addZombieBoss(x: number) {
    const enhanced: ZombieEnhanceInterface = {
      ...DEFAULT_ZOMBIE_ENHANCE_OBJECT,
      radius: 20,
      speed: 1,
      health: 500,
      isBoss: true,
    };
    const newZombie = new Zombie(x, 0, enhanced);
    this.zombies.set(newZombie.count, newZombie);
    this.quadTree.insert(newZombie);
  }
}
