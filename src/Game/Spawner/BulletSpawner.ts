import Game from "../Game";
import Spawner from "./Spawner";

class BulletSpawner extends Spawner {
  constructor(game: Game, spawnInterval: number) {
    super(game, spawnInterval);
  }
  spawn() {
    const player = this.game.getPlayer();
    this.game.shootBullet(player.bulletCount);
  }
}

export default BulletSpawner;
