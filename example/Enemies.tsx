import React, { useRef, useState, useEffect, Suspense } from "react";
import EnemyEntity from "./EnemyEntity";

function Enemies() {
  // const [enemyMesh, setEnemyMesh] = useState<React.ReactElement[]>([]);
  // const enemyRef = useRef<mesh>();

  // const createEnemies = () => {
  //   const enemies: React.ReactElement[] = [];
  //   for (let i = 0; i < 3; i++) {
  //     const randomX = Math.random() * 20 - 10;
  //     const randomZ = Math.random() * 20 - 10;
  //     const enemyPosition = [randomX, 0.9, randomZ]; // Adjust Y as needed

  //     const enemy = <EnemyEntity key={i} position={enemyPosition} />;

  //     enemies.push(enemy);
  //   }
  //   setEnemyMesh(enemies);
  // };

  // useEffect(() => {
  //   createEnemies();
  // }, []);

  // return (
  //   <>
  //     <Suspense fallback={null}>
  //       {enemyMesh.map((item, i) => {
  //         // return (
  //         //   <RigidBody key={i} type="dynamic" position={[0, 1, 0]} ref={enemyRef}>
  //         //     <CapsuleCollider
  //         //       type="capsule"
  //         //       args={[0.5, 0.5, "y"]}
  //         //       ref={enemyRef}
  //         //     >
  //         //       {/* Example args: radius, height, orientation */}
  //         //       {item}
  //         //     </CapsuleCollider>
  //         //   </RigidBody>
  //         // );
  //         return (
  //           <mesh key={i} ref={enemyRef}>
  //             {item}
  //           </mesh>
  //         );
  //       })}
  //     </Suspense>
  //   </>
  // );
  return (
    <>
      <Suspense fallback={null}>
        <EnemyEntity position={[1, 0, 0]} />
        <EnemyEntity position={[2, 0, 0]} />
        <EnemyEntity position={[3, 0, 0]} />
      </Suspense>
    </>
  );
}

export default React.memo(Enemies);
