import Game from "../Game";
import { getRandomRange } from "../utils";
import Spawner from "./Spawner";

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

export default ZombieBossSpawner;
