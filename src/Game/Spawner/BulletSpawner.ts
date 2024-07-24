import Game from "../Game";
import Spawner from "./Spawner";

class BulletSpawner extends Spawner {
  constructor(game: Game, spawnInterval: number) {
    super(game, spawnInterval);
  }
  spawn() {
    this.game.shootBullet();
  }
}

export default BulletSpawner;
