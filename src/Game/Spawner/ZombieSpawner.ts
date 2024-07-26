import Game from "../Game";
import Zombie from "../GameObject/Zombie";
import { DEFAULT_ZOMBIE_ENHANCE_OBJECT } from "../constants";
import { ZombieEnhanceInterface } from "../type";
import { getRandomRange } from "../utils";
import Spawner from "./Spawner";

class ZombieSpawner extends Spawner {
  constructor(game: Game, spawnInterval: number) {
    super(game, spawnInterval);
  }

  spawn() {
    const start = 10;
    const end = this.game.canvas.width - 10;
    const enhanced: ZombieEnhanceInterface = {
      ...DEFAULT_ZOMBIE_ENHANCE_OBJECT,
    };
    // 每次随机生成3个
    for (let i = 0; i < 3; i++) {
      const position = getRandomRange(start, end);
      const newZombie = new Zombie(position, 0, enhanced);
      this.game.addZombieInternal(newZombie);
    }
  }
}

export default ZombieSpawner;
