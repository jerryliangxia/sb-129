import React, { useRef, useState, useEffect, Suspense } from "react";
import EnemyEntity from "./EnemyEntity";
import { useGame } from "../src/stores/useGame";
import { v4 as uuidv4 } from "uuid"; // Import UUID library

function Enemies() {
  const [enemyMesh, setEnemyMesh] = useState<React.ReactElement[]>([]);
  const enemyRef = useRef<mesh>();
  const [pressKTimes, setPressKTimes] = useState(0);
  const curHealth = useGame((state) => state.curHealth);

  // Function to create enemies
  const createEnemies = () => {
    const newEnemies: React.ReactElement[] = [];
    for (let i = 0; i < 3; i++) {
      const randomX = Math.random() * 20 - 10;
      const randomZ = Math.random() * 20 - 10;
      const enemyPosition = [randomX, 0.9, randomZ]; // Adjust Y as needed
      const id = uuidv4(); // Generate a unique ID for each enemy

      const enemy = <EnemyEntity key={id} position={enemyPosition} />;
      newEnemies.push(enemy);
    }
    setEnemyMesh(newEnemies); // Update the state with new enemies
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" || event.key === "K") {
        setEnemyMesh([]); // Clear existing enemies
        createEnemies(); // Create new enemies
        setPressKTimes((prevPressKTimes) => {
          if (prevPressKTimes === 1) {
            const imgElement = document.querySelector(
              "img.pressk"
            ) as HTMLImageElement;
            if (imgElement) {
              imgElement.style.visibility = "hidden";
            }
          }
          return prevPressKTimes + 1;
        });
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Remove event listener on cleanup
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (curHealth > 10) {
      setEnemyMesh([]); // Clear enemies when curHealth is greater than 10
    }
  }, [curHealth]);

  return (
    <>
      <Suspense fallback={null}>
        {enemyMesh.map((item, i) => (
          <mesh key={i} ref={enemyRef}>
            {item}
          </mesh>
        ))}
      </Suspense>
    </>
  );
}

export default React.memo(Enemies);
