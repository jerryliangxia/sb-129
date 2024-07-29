import * as THREE from "three";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import React, { useMemo, useState, useEffect } from "react";
import { useGame } from "../src/stores/useGame";
import { Html } from "@react-three/drei";

export default function ShotCube() {
  const [rigidBody, setRigidBody] = useState<RapierRigidBody | null>(null);

  // const position = useMemo(() => new THREE.Vector3(), []);
  const directionCamera = useMemo(() => new THREE.Vector3(), []);
  const curAnimation = useGame((state) => state.curAnimation);
  const position = useGame((state) => state.curPosition);
  const direction = useGame((state) => state.curDirection);

  const throwBall = () => {
    if (rigidBody) {
      // Calculate the spawn position in front of the player
      const spawnOffset = new THREE.Vector3(
        direction.x * 0.5,
        1.0, // 0.5 units higher in the y-axis
        direction.z * 0.5
      );
      const adjustedPosition = new THREE.Vector3().addVectors(
        position,
        spawnOffset
      );

      // Set the ball's position
      rigidBody.setTranslation(adjustedPosition, false);

      // Set the ball's velocity
      rigidBody.setLinvel(
        new THREE.Vector3(
          direction.x * 30,
          directionCamera.y * 30 + 4,
          direction.z * 30
        ),
        false
      );
    }
  };

  useEffect(() => {
    if (curAnimation === "C_Shoot") throwBall();
  }, [curAnimation]);

  return (
    <>
      <RigidBody
        ref={(ref) => ref && setRigidBody(ref)}
        userData={{ type: "ball" }}
      >
        <mesh>
          <sphereGeometry args={[0.1, 4, 4]} />
          <meshStandardMaterial color="gray" opacity={0.0} transparent />
        </mesh>
        <Html distanceFactor={20}>♪</Html>
      </RigidBody>
    </>
  );
}
