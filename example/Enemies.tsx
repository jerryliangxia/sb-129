import React, { useRef, useState, useEffect, Suspense } from "react";
import EnemyEntity from "./EnemyEntity";
import { useGame } from "../src/stores/useGame";

function Enemies() {
  const [enemyMesh, setEnemyMesh] = useState<React.ReactElement[]>([]);
  const enemyRef = useRef<mesh>();
  const gameStage = useGame((state) => state.gameStage);
  const enemies = useGame((state) => state.enemies);
  const setEnemies = useGame((state) => state.setEnemies);
  const setEnemyHealth = useGame((state) => state.setEnemyHealth);
  const setGameStage = useGame((state) => state.setGameStage);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" || event.key === "K") {
        console.log("here");
        setGameStage(2);
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Remove event listener on cleanup
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setGameStage]);

  const createEnemies = () => {
    const enemies: React.ReactElement[] = [];
    for (let i = 0; i < 3; i++) {
      const randomX = Math.random() * 20 - 10;
      const randomZ = Math.random() * 20 - 10;
      const enemyPosition = [randomX, 0.9, randomZ]; // Adjust Y as needed

      const enemy = (
        <EnemyEntity gameKey={i} key={i} position={enemyPosition} />
      );

      enemies.push(enemy);
    }
    setEnemyMesh(enemies);
    setEnemies(enemies);
  };

  useEffect(() => {
    if (gameStage === 1) {
      createEnemies();
      console.log(enemies);
    } else if (gameStage === 2) {
      console.log("here now");
      // for (let i = 0; i < 3; i++) {
      // setEnemyHealth(i, 2);
      createEnemies();
      // }
    }
  }, [gameStage]);

  return (
    <>
      <Suspense fallback={null}>
        {enemyMesh.map((item, i) => {
          return (
            <mesh key={i} ref={enemyRef}>
              {item}
            </mesh>
          );
        })}
      </Suspense>
    </>
  );
}

export default React.memo(Enemies);
