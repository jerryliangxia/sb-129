import React, { useRef, useState, useEffect, Suspense } from "react";
import EnemyEntity from "./EnemyEntity";
import { useGame } from "../src/stores/useGame";

function Enemies() {
  const [enemyMesh, setEnemyMesh] = useState<React.ReactElement[]>([]);
  const enemyRef = useRef<mesh>();
  const gameStage = useGame((state) => state.gameStage);

  const createEnemies = () => {
    const enemies: React.ReactElement[] = [];
    for (let i = 0; i < 3; i++) {
      const randomX = Math.random() * 20 - 10;
      const randomZ = Math.random() * 20 - 10;
      const enemyPosition = [randomX, 0.9, randomZ]; // Adjust Y as needed

      const enemy = <EnemyEntity key={i} position={enemyPosition} />;

      enemies.push(enemy);
    }
    setEnemyMesh(enemies);
  };

  useEffect(() => {
    if (gameStage === 1) {
      createEnemies();
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
