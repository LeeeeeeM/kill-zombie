import Game from "../Game";
import Bullet from "../GameObject/Bullet";
import { BulletConstructorProps } from "../type";
import Spawner from "./Spawner";

class BulletSpawner extends Spawner {
  private comboSpawner: ComboBulletSpawner;
  constructor(game: Game, spawnInterval: number) {
    super(game, spawnInterval);
    this.comboSpawner = new ComboBulletSpawner(game, Infinity);
  }

  spawn() {
    const player = this.game.getPlayer();
    const zombie = this.game.getTargetZombie();
    const bulletProps = player.shotBullets(zombie);
    const bullets = bulletProps.map((bulletProp) =>
      Bullet.createBullet(bulletProp.x, bulletProp.y, bulletProp.enhanced)
    );
    this.game.addBulletInternal(bullets);
    this.comboSpawner.reset();
    if (player.comboTimes > 1) {
        this.comboSpawner.setLastBulletProps(bulletProps);
        this.comboSpawner.setLeftComboTimes(player.comboTimes - 1);
        this.comboSpawner.setInterval(50);
        this.comboSpawner.start();
    }
  }

  update() {
    // 触发两个定时器更新
    super.update();
    this.comboSpawner.update();
  }
}

class ComboBulletSpawner extends Spawner {
  private lastBulletsProps: BulletConstructorProps[];
  private leftComboTimes: number;
  constructor(game: Game, spawnInterval: number) {
    super(game, spawnInterval);
    this.lastBulletsProps = [];
    this.leftComboTimes = 0;
  }
  setLeftComboTimes(times: number) {
    this.leftComboTimes = times;
  }
  setLastBulletProps(props: BulletConstructorProps[]) {
    this.lastBulletsProps = props;
  }
  spawn() {
    if (this.leftComboTimes <= 0) {
        return;
    }
    this.leftComboTimes--;
    const bulletProps = this.lastBulletsProps;
    const bullets = bulletProps.map((bulletProp) =>
      Bullet.createBullet(bulletProp.x, bulletProp.y, bulletProp.enhanced)
    );
    this.game.addBulletInternal(bullets);
  }
}

export default BulletSpawner;
