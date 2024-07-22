import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import * as THREE from "three";

const CORAL_TYPES = [
  {
    geometry: "Cylinder004",
    material: "TallCoralMaterial",
    outline: "TallCoralOutline",
    isTall: true,
  },
  {
    geometry: "Cylinder005",
    material: "TallCoralMaterial",
    outline: "TallCoralOutline",
    isTall: true,
  },
  {
    geometry: "Cylinder006",
    material: "TallCoralMaterial",
    outline: "TallCoralOutline",
    isTall: true,
  },
  {
    geometry: "Cylinder007",
    material: "TallCoralMaterial",
    outline: "TallCoralOutline",
    isTall: true,
  },
  {
    geometry: "Cylinder008",
    material: "TallCoralMaterial",
    outline: "TallCoralOutline",
    isTall: true,
  },
  {
    geometry: "Cylinder010",
    material: "SmallCoralMaterial",
    outline: "SmallCoralOutline",
    isTall: false,
  },
  {
    geometry: "Cylinder011",
    material: "SmallCoralMaterial",
    outline: "SmallCoralOutline",
    isTall: false,
  },
];

const WEIGHTED_CORAL_TYPES = [
  ...Array(1).fill(CORAL_TYPES[0]), // Tall Coral 1
  ...Array(1).fill(CORAL_TYPES[1]), // Tall Coral 2
  ...Array(1).fill(CORAL_TYPES[2]), // Tall Coral 3
  ...Array(1).fill(CORAL_TYPES[3]), // Tall Coral 4
  ...Array(1).fill(CORAL_TYPES[4]), // Tall Coral 5
  ...Array(4).fill(CORAL_TYPES[5]), // Small Coral 1 (more frequent)
  ...Array(4).fill(CORAL_TYPES[6]), // Small Coral 2 (more frequent)
];

const RADIUS = 300;
const CORAL_COUNT = 150; // Adjust as needed

function getRandomPosition(existingPositions, radius) {
  let position;
  let isOverlapping;
  do {
    position = new THREE.Vector3(
      Math.random() * radius - radius / 2,
      0,
      Math.random() * radius - radius / 2
    );
    isOverlapping = existingPositions.some(
      (pos) => pos.distanceTo(position) < 10
    ); // Adjust distance as needed
  } while (isOverlapping);
  return position;
}

export default function CoralSpawner(props) {
  const { nodes, materials } = useGLTF("/corals.glb");
  const positions = [];

  for (let i = 0; i < CORAL_COUNT; i++) {
    positions.push(getRandomPosition(positions, RADIUS));
  }

  return (
    <group {...props} dispose={null}>
      {positions.map((position, index) => {
        const coralType =
          WEIGHTED_CORAL_TYPES[
            Math.floor(Math.random() * WEIGHTED_CORAL_TYPES.length)
          ];
        return (
          <RigidBody key={index} type="fixed" position={position.toArray()}>
            <group scale={0.6} position-y={-1}>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes[coralType.geometry].geometry}
                material={materials[coralType.material]}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes[`${coralType.geometry}_1`].geometry}
                material={materials[coralType.outline]}
              />
            </group>
            {coralType.isTall && <CapsuleCollider args={[0.3, 0.6]} />}
          </RigidBody>
        );
      })}
    </group>
  );
}

useGLTF.preload("/corals.glb");
