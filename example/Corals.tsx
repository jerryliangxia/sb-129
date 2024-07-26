import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

const OBJECT_TYPES = [
  {
    geometry: "Cylinder018",
    materials: [
      "DarkCoralMaterial",
      "Black",
      "Rock",
      "BlackOutline",
      "UrchinBlack",
      "SmallCoralMaterial",
      "SmallCoralOutline",
      "YellowSandOutline",
    ],
  },
  {
    geometry: "Plane104",
    materials: [
      "BlueSandOutline",
      "YellowSandOutline",
      "DarkCoralMaterial",
      "Black",
      "Rock",
      "BlackOutline",
      "SmallCoralMaterial",
      "SmallCoralOutline",
      "UrchinBlack",
    ],
  },
  {
    geometry: "Plane105",
    materials: [
      "BlueSandOutline",
      "GreenSandOutline.001",
      "Rock",
      "BlackOutline",
      "SmallCoralMaterial",
      "SmallCoralOutline",
      "UrchinBlack",
      "Kelp",
      "KelpOutline",
    ],
  },
  {
    geometry: "Plane106",
    materials: [
      "BlueSandOutline",
      "TallCoralOutline",
      "Kelp",
      "KelpOutline",
      "Rock",
      "BlackOutline",
      "SmallCoralMaterial",
      "SmallCoralOutline",
      "UrchinBlack",
      "OrangeCoral",
      "Black",
    ],
  },
  { geometry: "Plane010", materials: ["Kelp", "KelpOutline"] },
  { geometry: "Plane015", materials: ["Kelp", "KelpOutline"] },
  { geometry: "Plane019", materials: ["Kelp", "KelpOutline"] },
  {
    geometry: "Plane051",
    materials: [
      "SmallCoralMaterial",
      "SandOutline",
      "BigRock",
      "PurpleOutline",
      "Kelp",
      "KelpOutline",
      "KelpOrange",
      "KelpOrangeOutline",
      "SmallCoralOutline",
      "OrangeCoral",
      "Black",
      "UrchinBlack",
      "YellowSandOutline",
      "TallCoralOutline",
    ],
  },
  {
    geometry: "Plane061",
    materials: [
      "SmallCoralMaterial",
      "SandOutline",
      "BigRock",
      "PurpleOutline",
      "Kelp",
      "KelpOutline",
      "SmallCoralOutline",
      "Black",
      "DarkCoralMaterial",
      "YellowSandOutline",
      "KelpOrangeOutline",
      "UrchinBlack",
    ],
  },
  {
    geometry: "Cube009",
    materials: [
      "BigRock",
      "PurpleOutline",
      "RedCoral",
      "Black",
      "Kelp",
      "KelpOutline",
      "SmallCoralMaterial",
      "SmallCoralOutline",
      "KelpOrange",
      "KelpOrangeOutline",
      "SandOutline",
      "YellowSandOutline",
      "UrchinBlack",
    ],
  },
  {
    geometry: "Cylinder004",
    materials: ["TallCoralMaterial", "TallCoralOutline"],
  },
  {
    geometry: "Cylinder005",
    materials: ["TallCoralMaterial", "TallCoralOutline"],
  },
  {
    geometry: "Cylinder006",
    materials: ["TallCoralMaterial", "TallCoralOutline"],
  },
  {
    geometry: "Cylinder007",
    materials: ["TallCoralMaterial", "TallCoralOutline"],
  },
  {
    geometry: "Cylinder008",
    materials: ["TallCoralMaterial", "TallCoralOutline"],
  },
  {
    geometry: "Cylinder010",
    materials: ["SmallCoralMaterial", "SmallCoralOutline"],
  },
  {
    geometry: "Cylinder011",
    materials: ["SmallCoralMaterial", "SmallCoralOutline"],
  },
];

const RADIUS = 300;
const OBJECT_COUNT = 50; // Adjust as needed

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

export default function EnvironmentSpawner(props) {
  const { nodes, materials } = useGLTF("/environment_grouped.glb");
  const positions = [];

  for (let i = 0; i < OBJECT_COUNT; i++) {
    positions.push(getRandomPosition(positions, RADIUS));
  }

  return (
    <group {...props} dispose={null}>
      {positions.map((position, index) => {
        const objectType =
          OBJECT_TYPES[Math.floor(Math.random() * OBJECT_TYPES.length)];
        const scale = Math.random() * 0.5 + 0.5; // Random scale between 0.5 and 1.0
        const rotation = new THREE.Euler(0, Math.random() * Math.PI * 2, 0); // Random rotation
        return (
          <RigidBody
            key={index}
            // colliders="hull"
            colliders="trimesh"
            type="fixed"
            position={[position.x, position.y - 1, position.z]}
            rotation={rotation}
          >
            <group scale={scale}>
              {objectType.materials.map((material, i) => (
                <mesh
                  key={i}
                  castShadow
                  receiveShadow
                  geometry={
                    nodes[`${objectType.geometry}_${i}`]?.geometry ||
                    nodes[objectType.geometry].geometry
                  }
                  material={materials[material]}
                />
              ))}
            </group>
          </RigidBody>
        );
      })}
    </group>
  );
}

useGLTF.preload("/environment_grouped.glb");
