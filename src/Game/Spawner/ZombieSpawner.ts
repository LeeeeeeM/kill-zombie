import Game from "../Game";
import { getRandomRange } from "../utils";
import Spawner from "./Spawner";

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

export default ZombieSpawner;
