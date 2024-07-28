import { useEffect, useRef } from "react";
import { useVisibile } from "./hooks/useVisible";
import Game from "./Game/Game";
import { flush, customFlush } from "./platform/utils";

const TaskDemo = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const visible = useVisibile();

  const gameRef = useRef<Game | null>(null);

  const start = () => {
    if (gameRef.current) {
      return gameRef.current.run();
    }

    if (canvasRef.current) {
      const game = new Game(canvasRef.current, false, flush);
      gameRef.current = game;
      (window as any).game = game;
      game.init();
      game.run();
    }
  };

  const pause = () => {
    if (gameRef.current) {
      return gameRef.current.pause();
    }
  };

  useEffect(() => {
    const game = gameRef.current;
    if (game?.isRunning() && !visible) {
      game.pause();
    }
  }, [visible]);

  useEffect(() => {
    const shot = () => {
      const game = gameRef.current;
      if (game?.isRunning?.()) {
        game.shootBullet();
      }
    };

    if (canvasRef.current) {
      canvasRef.current.addEventListener("click", shot);
    }

    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener("click", shot);
      }
    };
  }, [canvasRef.current]);

  return (
    <>
      <div className="canvas">
        <canvas ref={canvasRef} width="320" height="540"></canvas>
      </div>
      <div className="btn-box">
        <button onClick={start}>Start Game</button>
        <button onClick={pause}>Pause Game</button>
      </div>
    </>
  );
};

export default TaskDemo;
