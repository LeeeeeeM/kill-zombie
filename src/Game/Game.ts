import { Circle, Quadtree } from "@timohausmann/quadtree-ts";
import Zombie from "./GameObject/Zombie";
import Bullet from "./GameObject/Bullet";
import Player from "./GameObject/Player";
import GameObject from "./GameObject/GameObject";
import { BulletEnhancedInterface, ZombieEnhanceInterface } from "./type";
import {
  DEFAULT_BULLET_ENHANCE_OBJECT,
  DEFAULT_ZOMBIE_ENHANCE_OBJECT,
} from "./constants";
import ZombieSpawner from "./Spawner/ZombieSpawner";
import ZombieBossSpawner from "./Spawner/ZombieBossSpawner";
import BulletSpawner from "./Spawner/BulletSpawner";
import { calculateRangeAngles } from "./utils";

class Game {
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

export default Game;