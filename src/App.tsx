import { useEffect, useRef } from 'react';
import Game from './Game/Game';
// import { Game } from './Game/Space';

const TaskDemo = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const gameRef = useRef<Game | null>(null);

  const start = () => {
    if (gameRef.current) {
      return gameRef.current.run();
    }

    if (canvasRef.current) {
      const game = new Game(canvasRef.current);
      game.init();
      gameRef.current = game;
      (window as any).game = game;
      game.run();
    }
  };

  const pause = () => {
    if (gameRef.current) {
      return gameRef.current.pause();
    }
  };


  useEffect(() => {
    const shot = () => {
      const game = gameRef.current;
      if (game?.isRunning?.()) {

        // const rect = event.target.getBoundingClientRect();
        // const x = event.clientX - rect.left;
        // const y = event.clientY - rect.top;
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
