import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import React, { useRef, useMemo, useState, useEffect } from "react";
import { useGame } from "../src/stores/useGame";

export default function ShotCube() {
  const { camera } = useThree();
  const [cubeMesh, setCubeMesh] = useState([]);
  const cubeRef = useRef<RapierRigidBody>();

  // const position = useMemo(() => new THREE.Vector3(), []);
  const directionCamera = useMemo(() => new THREE.Vector3(), []);
  const curAnimation = useGame((state) => state.curAnimation);
  const position = useGame((state) => state.curPosition);
  const direction = useGame((state) => state.curDirection);

  const clickToCreateBox = () => {
    if (document.pointerLockElement) {
      // camera.parent?.getWorldPosition(position);
      const referenceDirection = new THREE.Vector3(0, 0, 1);
      const angle = direction.angleTo(referenceDirection);
      const rotationAxis = new THREE.Vector3()
        .crossVectors(referenceDirection, direction)
        .normalize();
      const quaternion = new THREE.Quaternion().setFromAxisAngle(
        rotationAxis,
        angle
      );
      let offset = new THREE.Vector3(-0.1, 0, 0.1);
      offset.applyQuaternion(quaternion);
      const newPosition = position.clone().add(offset);
      const newMesh = (
        <mesh
          position={[newPosition.x, newPosition.y + 0.9, newPosition.z]}
          // castShadow
          // receiveShadow
        >
          <sphereGeometry args={[0.1, 4, 4]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      );
      setCubeMesh((prevMeshes) => [...prevMeshes, newMesh]);
    }
  };

  useEffect(() => {
    camera.parent?.getWorldDirection(directionCamera);
    if (cubeMesh.length > 0) {
      cubeRef.current?.setLinvel(
        new THREE.Vector3(
          direction.x * 40,
          directionCamera.y * 40 + 4,
          direction.z * 40
        ),
        false
      );
    }
  }, [cubeMesh]);

  useEffect(() => {
    if (curAnimation === "Shoot2") clickToCreateBox();
  }, [curAnimation]);

  return (
    <>
      {cubeMesh.map((item, i) => {
        return (
          <RigidBody
            key={i}
            mass={0.6}
            ref={cubeRef}
            userData={{ type: "shotCube" }}
          >
            {item}
          </RigidBody>
        );
      })}
    </>
  );
}
