import React from "react";
import * as THREE from "three";
import {
  Rock,
  Rock001,
  Rock002,
  BigRock,
  BigRock001,
  BigRock002,
  TallCoral,
  SmallCoral,
} from "./MeshComponents";

const RADIUS = 300;
const OBJECT_COUNT = 150;
const RESTRICTED_RANGE = 5;

function getRandomPosition(existingPositions, radius, restrictedRange) {
  let position;
  let isOverlapping;
  let isInRestrictedArea;
  do {
    position = new THREE.Vector3(
      Math.random() * radius - radius / 2,
      0,
      Math.random() * radius - radius / 2
    );
    isOverlapping = existingPositions.some(
      (pos) => pos.distanceTo(position) < 10
    );
    isInRestrictedArea =
      position.x >= -restrictedRange &&
      position.x <= restrictedRange &&
      position.z >= -restrictedRange &&
      position.z <= restrictedRange;
  } while (isOverlapping || isInRestrictedArea);
  return position;
}

export default function EnvironmentSpawner() {
  const positions = [];

  for (let i = 0; i < OBJECT_COUNT; i++) {
    positions.push(getRandomPosition(positions, RADIUS, RESTRICTED_RANGE));
  }

  // Weighted array for components
  const components = [
    Rock,
    Rock,
    Rock001,
    Rock001,
    Rock002,
    Rock002,
    BigRock,
    BigRock001,
    BigRock002,
    TallCoral,
    TallCoral,
    TallCoral,
    TallCoral,
    SmallCoral,
    SmallCoral,
    SmallCoral,
    SmallCoral,
  ];

  return (
    <>
      {positions.map((position, index) => {
        // Adjust the Y position and apply a random Y rotation
        const adjustedPosition = [position.x, position.y - 1, position.z];
        const randomYRotation = Math.random() * Math.PI * 2; // Random rotation between 0 and 2π

        const Component =
          components[Math.floor(Math.random() * components.length)];
        return (
          <Component
            key={index}
            position={adjustedPosition}
            rotation={[0, randomYRotation, 0]}
          />
        );
      })}
    </>
  );
}
