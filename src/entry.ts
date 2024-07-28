import Phaser from "phaser";
import { GameConfig } from "./config";
import GameScene from "./Phaser/Scenes/GameScene";
import { StartScene } from "./Phaser/Scenes/StartScene";
import { BootScene } from "./Phaser/Scenes/BootScene";

GameConfig.scene = [BootScene, StartScene, GameScene];

new Phaser.Game(GameConfig);
