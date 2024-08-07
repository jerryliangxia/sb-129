import React, { useRef, useEffect } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { TextureLoader } from "three";

const Flower = ({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const texture = useLoader(TextureLoader, "flower.png");

  useEffect(() => {
    if (meshRef.current) {
      (meshRef.current.material as THREE.MeshBasicMaterial).color.set(color);

      // Calculate the rotation to always point towards the origin [0, 0, 0]
      const direction = new THREE.Vector3()
        .subVectors(new THREE.Vector3(0, 0, 0), new THREE.Vector3(...position))
        .normalize();
      const quaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, -1),
        direction
      );
      //   meshRef.current.setRotationFromQuaternion(quaternion);
      meshRef.current.rotation.setFromQuaternion(quaternion);
    }
  }, [color, position]);

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} />
    </mesh>
  );
};

const Flowers = () => {
  //   const flowerPositions = [
  //     [100, 100, -300],
  //     [-300, 100, 100],
  //     [-200, 100, -500],
  //     [500, 100, 200],
  //     [-600, 100, -400],
  //     [400, 100, -300], // Big one
  //     [300, 100, 400], // Big one
  //     [-400, 100, -600],
  //     [600, 100, 400],
  //     [-500, 100, 700],
  //     [700, 100, -500],
  //   ];

  const generateRandomPosition = (radius: number): [number, number, number] => {
    const angle = Math.random() * 2 * Math.PI;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = 100 + Math.random() * 100; // Fixed y position
    return [x, y, z];
  };

  const isTooClose = (
    pos1: [number, number, number],
    pos2: [number, number, number],
    minDistance: number
  ): boolean => {
    const distance = Math.sqrt(
      (pos1[0] - pos2[0]) ** 2 +
        (pos1[1] - pos2[1]) ** 2 +
        (pos1[2] - pos2[2]) ** 2
    );
    return distance < minDistance;
  };

  const generateNonOverlappingPositions = (
    count: number,
    radius: number,
    minDistance: number
  ): [number, number, number][] => {
    const positions: [number, number, number][] = [];
    while (positions.length < count) {
      const newPos = generateRandomPosition(radius);
      if (positions.every((pos) => !isTooClose(pos, newPos, minDistance))) {
        positions.push(newPos);
      }
    }
    return positions;
  };

  const flowerPositions = generateNonOverlappingPositions(11, 500, 100);

  const flowerColors = [
    "#FF69B4", // HotPink
    "#FFD700", // Gold
    "#ADFF2F", // GreenYellow
    "#00BFFF", // DeepSkyBlue
    "#FF4500", // OrangeRed
  ];

  return (
    <>
      {flowerPositions.map((pos, index) => (
        <Flower
          key={index}
          position={pos as [number, number, number]}
          color={flowerColors[index % flowerColors.length]}
        />
      ))}
    </>
  );
};

export default Flowers;
