import Game from "../Game";

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

export default Spawner;