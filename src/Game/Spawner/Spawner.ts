import Game from "../Game";

class Spawner {
  private spawnInterval: number;
  private lastSpawnTime: number;
  private pausedTime: number;
  private isActive: boolean;
  private newSpawnInterval: number;
  game: Game;
  constructor(game: Game, spawnInterval: number) {
    this.game = game;
    this.spawnInterval = spawnInterval;
    this.lastSpawnTime = Date.now();
    this.pausedTime = 0;
    this.isActive = false;
    this.newSpawnInterval = spawnInterval;
  }

  setInterval(interval: number) {
    this.newSpawnInterval = interval;
  }

  _changeDiffInterval() {
    if (this.newSpawnInterval !== this.spawnInterval) {
      this.spawnInterval = this.newSpawnInterval;
    };
  }

  spawn() {}

  reset() {
    this.isActive = false;
    this.pausedTime = 0;
  }

  start() {
    this.isActive = true;
    if (this.pausedTime === 0) {
      this._changeDiffInterval();
    }
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
      // 更新 spawnInterval
      this._changeDiffInterval();
    }
  }
}

export default Spawner;