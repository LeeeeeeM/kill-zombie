import Game from "../Game";
import Zombie from "../GameObject/Zombie";
import { DEFAULT_ZOMBIE_BOSS_ENHANCE_OBJECT } from "../constants";
import { ZombieEnhanceInterface } from "../type";
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

    const enhanced: ZombieEnhanceInterface = {
        ...DEFAULT_ZOMBIE_BOSS_ENHANCE_OBJECT,
      };

    const zombieBoss = new Zombie(position, 0, enhanced);

    this.game.addZombieInternal(zombieBoss);
  }
}

export default ZombieBossSpawner;
