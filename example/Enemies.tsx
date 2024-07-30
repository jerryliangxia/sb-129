import React, { useRef, useState, useEffect, Suspense } from "react";
import EnemyEntity from "./EnemyEntity";
import { useGame } from "../src/stores/useGame";
import { v4 as uuidv4 } from "uuid"; // Import UUID library
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

function Enemies() {
  const { nodes, materials } = useGLTF("/vessel.glb");
  const [enemyMesh, setEnemyMesh] = useState<React.ReactElement[]>([]);
  const enemyRef = useRef<mesh>();
  const curHealth = useGame((state) => state.curHealth);
  const SPAWN_RANGE = 50;
  const [lastTriggerTime, setLastTriggerTime] = useState<number | null>(null);
  let numSpawns = 5;

  // Function to create enemies
  const createEnemies = () => {
    const newEnemies: React.ReactElement[] = [];
    for (let i = 0; i < numSpawns; i++) {
      const randomX = Math.random() * SPAWN_RANGE - SPAWN_RANGE / 2;
      const randomZ = Math.random() * SPAWN_RANGE - SPAWN_RANGE / 2;
      const enemyPosition = [randomX, 0.9, randomZ]; // Adjust Y as needed
      const id = uuidv4(); // Generate a unique ID for each enemy

      const enemy = <EnemyEntity key={id} position={enemyPosition} />;
      newEnemies.push(enemy);
    }
    numSpawns++;
    setEnemyMesh(newEnemies); // Update the state with new enemies
  };

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
      <RigidBody
        colliders="trimesh"
        type="fixed"
        onCollisionExit={() => {
          const currentTime = Date.now();
          if (
            lastTriggerTime === null ||
            currentTime - lastTriggerTime >= 10000 // 10 seconds
          ) {
            setEnemyMesh([]);
            createEnemies();
            setLastTriggerTime(currentTime);
          }
        }}
      >
        <group position={[0, 0.85, 10]} rotation={[0.25, Math.PI, 0]}>
          <mesh
            geometry={nodes.Cube006.geometry}
            material={materials.VesselDoorMaterial}
          />
          <mesh
            geometry={nodes.Cube006_1.geometry}
            material={materials.VesselOutline}
          />
          <mesh
            geometry={nodes.Cube006_2.geometry}
            material={materials.VesselMaterial}
          />
        </group>
      </RigidBody>
    </>
  );
}

useGLTF.preload("/vessel.glb");
export default React.memo(Enemies);
