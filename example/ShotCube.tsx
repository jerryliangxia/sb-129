import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useRef, useMemo, useState, useEffect } from "react";
import { useGame } from "../src/stores/useGame";

export default function ShotCube(props) {
  const { camera } = useThree();
  const [cubeMesh, setCubeMesh] = useState([]);
  const cubeRef = useRef<RapierRigidBody>();

  // const position = useMemo(() => new THREE.Vector3(), []);
  // const direction = useMemo(() => new THREE.Vector3(), []);
  const curAnimation = useGame((state) => state.curAnimation);
  const position = useGame((state) => state.curPosition);
  const direction = useGame((state) => state.curDirection);

  const clickToCreateBox = () => {
    if (document.pointerLockElement) {
      // camera.parent?.getWorldPosition(position);
      const newMesh = (
        <mesh
          position={[position.x, position.y + 1.3, position.z]}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[0.1, 4, 4]} />
          <meshStandardMaterial color="black" />
        </mesh>
      );
      setCubeMesh((prevMeshes) => [...prevMeshes, newMesh]);
    }
  };

  useEffect(() => {
    // camera.parent?.getWorldDirection(direction);
    if (cubeMesh.length > 0) {
      cubeRef.current?.setLinvel(
        new THREE.Vector3(
          direction.x * 40,
          direction.y * 40 + 4,
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
          <RigidBody key={i} mass={0.6} ref={cubeRef}>
            {item}
          </RigidBody>
        );
      })}
    </>
  );
}
