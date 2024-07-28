import Phaser from "phaser";

export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: "kill-zombie",
  version: "0.0.1",
  width: 480,
  height: 640,
  type: Phaser.AUTO,
  parent: "root",
  input: {
    keyboard: true,
    mouse: true,
    touch: true,
    gamepad: false
  },
  backgroundColor: "#dddddd",
  render: { pixelArt: true, antialias: false }
};
