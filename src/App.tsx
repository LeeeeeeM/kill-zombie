import { useEffect, useRef } from 'react';
import { useVisibile } from './hooks/useVisible';
import Game from './Game/Game';
// import { Game } from './Space';

const TaskDemo = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const visible = useVisibile();

  const gameRef = useRef<Game | null>(null);

  const start = () => {
    if (gameRef.current) {
      return gameRef.current.run();
    }

    if (canvasRef.current) {
      const game = new Game(canvasRef.current);
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
  }, [visible])

  useEffect(() => {
    const shot = () => {
      const game = gameRef.current;
      if (game?.isRunning?.()) {
        game.shootBullet();
      }
      (window as any).game = game;
    };

    if (canvasRef.current) {
      canvasRef.current.addEventListener('click', shot);
    }
    

    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('click', shot);
      }
    };
  }, [canvasRef.current]);

  return (
    <div>
      <button onClick={start}>Start Game</button>
      <button onClick={pause}>Pause Game</button>
      <canvas ref={canvasRef} width="640" height="480"></canvas>
    </div>
  );
};

export default TaskDemo;
