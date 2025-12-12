"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAccount } from "wagmi";

interface DinoGameProps {
  onGameOver: (score: number) => void;
  resetKey?: number; // Key to force reset
}

export default function DinoGame({ onGameOver, resetKey }: DinoGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { address } = useAccount();
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const scoreRef = useRef(0);
  const gameStartedRef = useRef(false);
  const gameOverRef = useRef(false);
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 200;
  const GROUND_Y = CANVAS_HEIGHT - 50;
  const DINO_SIZE = 40;
  const DINO_X = 50;

  const gameStateRef = useRef({
    dinoY: (CANVAS_HEIGHT - 50) - 40, // Y position on canvas (GROUND_Y - DINO_SIZE)
    dinoVelocity: 0,
    obstacles: [] as Array<{ x: number; width: number; height: number }>,
    gameSpeed: 2,
    gravity: 0.6,
    jumpPower: -12,
    isJumping: false,
    frameCount: 0,
  });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas with sky gradient (blue to green)
    const skyGradient = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
    skyGradient.addColorStop(0, "#87CEEB"); // Sky blue
    skyGradient.addColorStop(0.5, "#98D8C8"); // Light green-blue
    skyGradient.addColorStop(1, "#90EE90"); // Light green
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, GROUND_Y);
    
    // Draw background dinosaur (orange-brown, larger, more visible)
    ctx.fillStyle = "#D2691E"; // Orange-brown
    const bgDinoSize = 80;
    const bgDinoX = CANVAS_WIDTH - 120;
    const bgDinoY = GROUND_Y - bgDinoSize - 10;
    
    // Draw dinosaur body (more detailed)
    // Body
    ctx.fillRect(bgDinoX, bgDinoY + bgDinoSize * 0.2, bgDinoSize * 0.7, bgDinoSize * 0.5);
    // Head
    ctx.fillRect(bgDinoX + bgDinoSize * 0.4, bgDinoY, bgDinoSize * 0.4, bgDinoSize * 0.4);
    // Eye
    ctx.fillStyle = "#FFD700"; // Yellow eye
    ctx.fillRect(bgDinoX + bgDinoSize * 0.5, bgDinoY + bgDinoSize * 0.1, bgDinoSize * 0.1, bgDinoSize * 0.1);
    // Tail
    ctx.fillStyle = "#D2691E";
    ctx.fillRect(bgDinoX - bgDinoSize * 0.2, bgDinoY + bgDinoSize * 0.3, bgDinoSize * 0.25, bgDinoSize * 0.3);
    // Legs
    ctx.fillRect(bgDinoX + bgDinoSize * 0.1, bgDinoY + bgDinoSize * 0.7, bgDinoSize * 0.15, bgDinoSize * 0.3);
    ctx.fillRect(bgDinoX + bgDinoSize * 0.4, bgDinoY + bgDinoSize * 0.7, bgDinoSize * 0.15, bgDinoSize * 0.3);

    // Draw ground (green grass)
    ctx.fillStyle = "#228B22"; // Forest green
    ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, 50);
    ctx.fillStyle = "#90EE90"; // Light green top
    ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, 5);

    const state = gameStateRef.current;

    // Draw dino (orange-brown)
    ctx.fillStyle = "#D2691E"; // Orange-brown
    // dinoY is already the canvas Y coordinate
    const finalDinoY = Math.max(0, Math.min(state.dinoY, CANVAS_HEIGHT - DINO_SIZE));
    ctx.fillRect(DINO_X, finalDinoY, DINO_SIZE, DINO_SIZE);
    // Eye
    ctx.fillStyle = "#FFD700"; // Yellow eye
    ctx.fillRect(DINO_X + DINO_SIZE * 0.3, finalDinoY + DINO_SIZE * 0.2, DINO_SIZE * 0.2, DINO_SIZE * 0.2);

    // Draw obstacles (green cacti)
    ctx.fillStyle = "#228B22"; // Forest green
    state.obstacles.forEach((obstacle) => {
      ctx.fillRect(obstacle.x, GROUND_Y - obstacle.height, obstacle.width, obstacle.height);
      // Add spikes to cactus
      ctx.fillStyle = "#006400"; // Dark green
      ctx.fillRect(obstacle.x - 3, GROUND_Y - obstacle.height, 3, obstacle.height * 0.3);
      ctx.fillRect(obstacle.x + obstacle.width, GROUND_Y - obstacle.height, 3, obstacle.height * 0.3);
      ctx.fillStyle = "#228B22";
    });

    // Draw score (white text with shadow)
    ctx.fillStyle = "#000000";
    ctx.font = "bold 20px Arial";
    ctx.fillText(`Score: ${score}`, 12, 32);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`Score: ${score}`, 10, 30);
  }, [score]);

  const update = useCallback(() => {
    if (gameOverRef.current || !gameStartedRef.current) return;

    const state = gameStateRef.current;
    state.frameCount++;

    // Update score
    if (state.frameCount % 5 === 0) {
      setScore((prev) => {
        const newScore = prev + 1;
        scoreRef.current = newScore;
        return newScore;
      });
    }

    // dino physics stuff
    // dinoY is the Y position on screen, negative velocity = going up, positive = going down
    const groundLevel = GROUND_Y - DINO_SIZE;
    
    // only apply physics when not on ground or jumping
    if (state.dinoY < groundLevel || state.dinoVelocity < 0) {
      state.dinoVelocity += state.gravity; // gravity pulls down always
      state.dinoY += state.dinoVelocity;
      
      // limit jump height so he doesn't fly too high
      const maxJumpHeight = groundLevel - 100;
      if (state.dinoY <= maxJumpHeight && state.dinoVelocity < 0) {
        state.dinoY = maxJumpHeight;
        state.dinoVelocity = 0; // stop going up
      }
    }

    // check if hit ground
    if (state.dinoY >= groundLevel) {
      state.dinoY = groundLevel; // put him on ground
      state.dinoVelocity = 0;
      state.isJumping = false;
    }

    // move obstacles to the left
    state.obstacles.forEach((obstacle) => {
      obstacle.x -= state.gameSpeed;
    });

    // remove obstacles that went off screen
    state.obstacles = state.obstacles.filter((obstacle) => obstacle.x + obstacle.width > 0);

    // spawn new obstacles (more often as game goes on)
    const spawnInterval = Math.max(60, 150 - Math.floor(state.frameCount / 200));
    if (state.frameCount % spawnInterval === 0 && (Math.random() > 0.3 || state.obstacles.length === 0)) {
      state.obstacles.push({
        x: CANVAS_WIDTH,
        width: 20,
        height: 30 + Math.random() * 20,
      });
    }

    // make game faster over time
    if (state.frameCount % 100 === 0) {
      state.gameSpeed = Math.min(10, state.gameSpeed + 0.1);
    }

    // check if dino hit obstacle
    const dinoRect = {
      x: DINO_X,
      y: state.dinoY,
      width: DINO_SIZE,
      height: DINO_SIZE,
    };

    state.obstacles.forEach((obstacle) => {
      const obstacleRect = {
        x: obstacle.x,
        y: GROUND_Y - obstacle.height,
        width: obstacle.width,
        height: obstacle.height,
      };

      if (
        dinoRect.x < obstacleRect.x + obstacleRect.width &&
        dinoRect.x + dinoRect.width > obstacleRect.x &&
        dinoRect.y < obstacleRect.y + obstacleRect.height &&
        dinoRect.y + dinoRect.height > obstacleRect.y
      ) {
        if (!gameOverRef.current) {
          gameOverRef.current = true;
          setGameOver(true);
          onGameOver(scoreRef.current);
        }
        return;
      }
    });
  }, [onGameOver]);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = 0;
    const fps = 60;
    const interval = 1000 / fps;

    const gameLoop = (currentTime: number) => {
      if (gameStartedRef.current && !gameOverRef.current) {
        if (currentTime - lastTime >= interval) {
          update();
          lastTime = currentTime;
        }
        draw();
        animationFrameId = requestAnimationFrame(gameLoop);
      } else {
        draw();
        animationFrameId = requestAnimationFrame(gameLoop);
      }
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [update, draw, gameOver, gameStarted]);

  const handleJump = useCallback(() => {
    const state = gameStateRef.current;
    const groundLevel = GROUND_Y - DINO_SIZE;
    // only jump when on ground
    if (!state.isJumping && state.dinoY >= groundLevel - 1) {
      state.dinoVelocity = state.jumpPower;
      state.isJumping = true;
    }
  }, []);

  const handleStart = useCallback(() => {
    if (!gameStartedRef.current && !gameOverRef.current) {
      gameStartedRef.current = true;
      gameOverRef.current = false;
      setGameStarted(true);
      setGameOver(false);
      scoreRef.current = 0;
      gameStateRef.current = {
        dinoY: GROUND_Y - DINO_SIZE,
        dinoVelocity: 0,
        obstacles: [],
        gameSpeed: 2,
        gravity: 0.6,
        jumpPower: -12,
        isJumping: false,
        frameCount: 0,
      };
      setScore(0);
      // Spawn first obstacle immediately
      setTimeout(() => {
        if (gameStateRef.current.obstacles.length === 0) {
          gameStateRef.current.obstacles.push({
            x: CANVAS_WIDTH,
            width: 20,
            height: 30 + Math.random() * 20,
          });
        }
      }, 100);
    }
  }, []);

  const handleRestart = useCallback(() => {
    gameOverRef.current = false;
    gameStartedRef.current = false;
    scoreRef.current = 0;
    setGameOver(false);
    setGameStarted(false);
    setScore(0);
    gameStateRef.current = {
      dinoY: GROUND_Y - DINO_SIZE,
      dinoVelocity: 0,
      obstacles: [],
      gameSpeed: 2,
      gravity: 0.6,
      jumpPower: -12,
      isJumping: false,
      frameCount: 0,
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === "ArrowUp") {
        e.preventDefault();
        if (!gameStartedRef.current && !gameOverRef.current) {
          handleStart();
        } else if (gameStartedRef.current && !gameOverRef.current) {
          handleJump();
        } else if (gameOverRef.current) {
          handleRestart();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleStart, handleJump, handleRestart]);


  useEffect(() => {
    draw();
  }, [draw]);

  // Reset game when resetKey changes
  useEffect(() => {
    if (resetKey !== undefined) {
      gameOverRef.current = false;
      gameStartedRef.current = false;
      scoreRef.current = 0;
      setGameOver(false);
      setGameStarted(false);
      setScore(0);
      gameStateRef.current = {
        dinoY: GROUND_Y - DINO_SIZE,
        dinoVelocity: 0,
        obstacles: [],
        gameSpeed: 2,
        gravity: 0.6,
        jumpPower: -12,
        isJumping: false,
        frameCount: 0,
      };
    }
  }, [resetKey]);

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-4 border-orange-400/50 rounded-lg shadow-xl"
        style={{ imageRendering: "pixelated" }}
      />
      <div className="mt-4 text-center">
        {!gameStarted && !gameOver && (
          <div>
            <p className="text-gray-300 mb-2">Press SPACE or ↑ to start</p>
            <p className="text-sm text-gray-400">Jump with SPACE or ↑</p>
          </div>
        )}
        {gameStarted && !gameOver && (
          <p className="text-gray-300">Press SPACE or ↑ to jump</p>
        )}
        {gameOver && (
          <div>
            <p className="text-red-400 text-xl font-bold mb-2">Game Over!</p>
            <p className="text-gray-300">Final Score: {score}</p>
            <p className="text-sm text-gray-400 mt-2">Press SPACE to restart</p>
          </div>
        )}
      </div>
    </div>
  );
}

