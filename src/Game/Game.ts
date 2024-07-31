import { Circle, Quadtree } from "@timohausmann/quadtree-ts";
import Zombie from "./GameObject/Zombie";
import Bullet from "./GameObject/Bullet";
import Player from "./GameObject/Player";
import Explosion from "./GameObject/Explosion";
import { BoundInterface, BulletEnhancedInterface } from "./type";
import {
  DEFAULT_BULLET_ENHANCE_OBJECT,
  DEFAULT_BULLET_EXPLOSION_ENHANCE_OBJECT,
  DEFAULT_PLAYER_ENHANCE_OBJECT,
  FAST_UPDATE,
} from "./constants";
import ZombieSpawner from "./Spawner/ZombieSpawner";
import ZombieBossSpawner from "./Spawner/ZombieBossSpawner";
import BulletSpawner from "./Spawner/BulletSpawner";
import { calculateAngle, calculateInterceptAngle, calculateRangeAngles } from "./utils";

class Game {
  public canvas: HTMLCanvasElement;

  private ctx: CanvasRenderingContext2D;

  private quadTree: Quadtree<Circle>;

  private zombies: Map<string, Zombie>;

  private bullets: Map<string, Bullet>;

  private player: Player;

  private explodeBullets: Map<string, Explosion>;

  private running: boolean;

  private shotTargetZombie: Zombie | null;

  private zombieSpawner: ZombieSpawner;

  private zombieBossSpawner: ZombieBossSpawner;

  private bulletSpawner: BulletSpawner;

  private active: boolean;

  private canvasBound: BoundInterface;

  private renderOutSide: boolean;

  // // 画布刷新方法，不依赖与web环境
  private flush?: (fn: FrameRequestCallback) => void;

  constructor(
    canvas: HTMLCanvasElement,
    renderOutSide: boolean = false,
    flush?: (fn: FrameRequestCallback) => void
  ) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d")!;
    this.renderOutSide = renderOutSide;
    this.flush = flush;

    // 四叉树查找
    this.quadTree = new Quadtree({
      width: this.canvas.width,
      height: this.canvas.height,
    });

    this.zombies = new Map();
    this.bullets = new Map();
    this.explodeBullets = new Map();
    // 游戏玩家，目前是一个
    this.player = new Player(this.canvas.width / 2, this.canvas.height - 20, {
      ...DEFAULT_PLAYER_ENHANCE_OBJECT
    });
    // 锁定的射击对象，目前和玩家 1vs1
    this.shotTargetZombie = null;
    // 游戏对象产生定时器
    this.zombieSpawner = new ZombieSpawner(this, 600);
    this.zombieBossSpawner = new ZombieBossSpawner(this, 10 * 1000);
    this.bulletSpawner = new BulletSpawner(this, 400);

    this.canvasBound = {
      left: 0,
      right: this.canvas.width,
      top: 0,
      bottom: this.canvas.height,
    };
    // 游戏状态
    this.running = false;
    this.active = false;
  }

  isActive() {
    return this.active;
  }

  getPlayer() {
    return this.player;
  }

  getZombies() {
    return this.zombies;
  }

  getBullets() {
    return this.bullets;
  }

  getExplodeBullets() {
    return this.explodeBullets;
  }

  getTargetZombie() {
    return this.shotTargetZombie;
  }

  isRunning() {
    return this.running;
  }

  pause() {
    this.running = false;
    this.stopSpawner();
  }

  init() {
    // 初始化的一些操作
    this.update = this.update.bind(this);
    this.draw = this.draw.bind(this);
    this.gameLoop = this.gameLoop.bind(this);
    this.handleCollisions = this.handleCollisions.bind(this);
    this.active = true;
  }

  reset() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.quadTree.clear();
    this.bullets.clear();
    this.zombies.clear();
    this.explodeBullets.clear();
  }

  destory() {
    this.reset();
    this.active = false;
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
    if (!this.renderOutSide) {
      this.draw();
    }
    this.handleCollisions();
    if (!this.renderOutSide) {
      this.flush?.(this.gameLoop);
    }
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

  resetTargetZombie(zombie: Zombie) {
    if (zombie === this.shotTargetZombie) {
      this.shotTargetZombie = null;
    }
  }

  update() {
    // 生成新的游戏对象
    this.generateGameObject();

    const hasTarget = !!this.getTargetZombie();

    for (let [, zombie] of this.zombies) {
      zombie.update();
      if (zombie.isOffCanvas(this.canvasBound)) {
        this.zombies.delete(zombie.count);
        this.resetTargetZombie(zombie);
        this.quadTree.remove(zombie, FAST_UPDATE);
      } else {
        !hasTarget && this.updateTargetZombie(this.player.getY(), zombie);
        this.quadTree.update(zombie, FAST_UPDATE);
      }
    }
    for (let [, bullet] of this.bullets) {
      bullet.checkBound(this.canvasBound);
      bullet.update();

      if (bullet.isOffCanvas(this.canvasBound) && !bullet.hasLeftCollision()) {
        this.bullets.delete(bullet.count);
        Bullet.release(bullet);
      }
    }
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
      explodeBullet.draw(this.ctx);
    }
  }

  handleCollisions() {
    // 先处理爆炸效果
    for (let [, explodeBullet] of this.explodeBullets) {
      const detectCircle = new Circle({
        x: explodeBullet.getX(),
        y: explodeBullet.getY(),
        r: explodeBullet.getRadius(),
      });
      const affectZombies = this.quadTree.retrieve(detectCircle) as Zombie[];

      for (let zombie of affectZombies) {
        if (zombie.checkHited(detectCircle)) {
          zombie.hitHealth(explodeBullet.getDamage());
          if (zombie.isDead()) {
            // 重置zombie
            this.resetTargetZombie(zombie);
            this.player.addKill(zombie);
            this.zombies.delete(zombie.count);
            this.quadTree.remove(zombie, FAST_UPDATE);
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
        if (zombie.checkHited(detectCircle)) {
          zombie.hitHealth(bullet.getDamage());
          if (zombie.isDead()) {
            // 重置目标zombie
            this.resetTargetZombie(zombie);
            this.player.addKill(zombie);
            this.zombies.delete(zombie.count);
            this.quadTree.remove(zombie, FAST_UPDATE);
            break; // 避免重复删除
          }
          // 无法穿透，则从普通子弹中移除
          if (!bullet.hasPierceTimes()) {
            this.bullets.delete(bullet.count);
            Bullet.release(bullet);
          }

          // 允许爆炸，保存到对应
          if (bullet.isExplosive()) {
            const explosion = new Explosion(bullet.getX(), bullet.getY(), {
              ...DEFAULT_BULLET_EXPLOSION_ENHANCE_OBJECT,
              damage: bullet.getExpoldeDamage(),
              radius: bullet.getExplodeRadius()
            });
            // 存储在下一帧需要爆炸的子弹映射中
            this.explodeBullets.set(explosion.count, explosion);
          }
          bullet.checkPierce();
        }
      }
    }
  }

  shootBullet() {
    const player = this.player;
    const target = this.shotTargetZombie!;
    const angles = calculateRangeAngles(player.getTrajectoryCount());

    for (let angle of angles) {
      // const adjustedAngle = calculateAngle(player, target);
      const adjustedAngle = calculateInterceptAngle(player, target, player.getSpeed(), target?.getSpeed());
      const enhanced: BulletEnhancedInterface = {
        ...DEFAULT_BULLET_ENHANCE_OBJECT,
        damage: player.damage,
        angle: adjustedAngle + angle,
        collisionWallTimes: player.getCollisionWallTimes(),
      };
      const newBullet = Bullet.createBullet(
        player.getX(),
        player.getY(),
        enhanced
      );
      this.bullets.set(newBullet.count, newBullet);
    }
  }

  addBulletInternal(bullets: Bullet[]) {
    bullets.forEach((bullet) => {
      this.bullets.set(bullet.count, bullet);
    });
  }

  addZombieInternal(zombie: Zombie) {
    this.zombies.set(zombie.count, zombie);
    this.quadTree.insert(zombie);
  }
}

export default Game;
