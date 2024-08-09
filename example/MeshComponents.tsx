import React from "react";
import { RigidBody } from "@react-three/rapier";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export function Rock({ position, rotation }) {
  const { nodes, materials } = useGLTF("/environment_colliders.glb");

  return (
    <group position={position} rotation={rotation} name="Rock">
      <RigidBody colliders="trimesh" type="fixed">
        <mesh geometry={nodes.ColliderRock.geometry}>
          <meshBasicMaterial opacity={0} transparent side={THREE.BackSide} />
        </mesh>
      </RigidBody>
      <group name="Rock">
        <mesh
          name="Plane105"
          geometry={nodes.Plane105.geometry}
          material={materials.BlueSandOutline}
        />
        <mesh
          name="Plane105_1"
          geometry={nodes.Plane105_1.geometry}
          material={materials["GreenSandOutline.001"]}
        />
        <mesh
          name="Plane105_2"
          geometry={nodes.Plane105_2.geometry}
          material={materials.Rock}
        />
        <mesh
          name="Plane105_3"
          geometry={nodes.Plane105_3.geometry}
          material={materials.BlackOutline}
        />
        <mesh
          name="Plane105_4"
          geometry={nodes.Plane105_4.geometry}
          material={materials.SmallCoralMaterial}
        />
        <mesh
          name="Plane105_5"
          geometry={nodes.Plane105_5.geometry}
          material={materials.SmallCoralOutline}
        />
        <mesh
          name="Plane105_6"
          geometry={nodes.Plane105_6.geometry}
          material={materials.UrchinBlack}
        />
        <mesh
          name="Plane105_7"
          geometry={nodes.Plane105_7.geometry}
          material={materials.Kelp}
        />
        <mesh
          name="Plane105_8"
          geometry={nodes.Plane105_8.geometry}
          material={materials.KelpOutline}
        />
      </group>
    </group>
  );
}

export function Rock001({ position, rotation }) {
  const { nodes, materials } = useGLTF("/environment_colliders.glb");

  return (
    <group position={position} rotation={rotation} name="Rock001">
      <RigidBody colliders="trimesh" type="fixed">
        <mesh geometry={nodes.ColliderRock001.geometry}>
          <meshBasicMaterial opacity={0} transparent side={THREE.BackSide} />
        </mesh>
      </RigidBody>
      <group name="Rock001">
        <mesh
          name="Cylinder018"
          geometry={nodes.Cylinder018.geometry}
          material={materials.DarkCoralMaterial}
        />
        <mesh
          name="Cylinder018_1"
          geometry={nodes.Cylinder018_1.geometry}
          material={materials.Black}
        />
        <mesh
          name="Cylinder018_2"
          geometry={nodes.Cylinder018_2.geometry}
          material={materials.Rock}
        />
        <mesh
          name="Cylinder018_3"
          geometry={nodes.Cylinder018_3.geometry}
          material={materials.BlackOutline}
        />
        <mesh
          name="Cylinder018_4"
          geometry={nodes.Cylinder018_4.geometry}
          material={materials.UrchinBlack}
        />
        <mesh
          name="Cylinder018_5"
          geometry={nodes.Cylinder018_5.geometry}
          material={materials.SmallCoralMaterial}
        />
        <mesh
          name="Cylinder018_6"
          geometry={nodes.Cylinder018_6.geometry}
          material={materials.SmallCoralOutline}
        />
        <mesh
          name="Cylinder018_7"
          geometry={nodes.Cylinder018_7.geometry}
          material={materials.YellowSandOutline}
        />
      </group>
    </group>
  );
}

export function Rock002({ position, rotation }) {
  const { nodes, materials } = useGLTF("/environment_colliders.glb");

  return (
    <group position={position} rotation={rotation} name="Rock001">
      <RigidBody colliders="trimesh" type="fixed">
        <mesh geometry={nodes.ColliderRock002.geometry}>
          <meshBasicMaterial opacity={0} transparent side={THREE.BackSide} />
        </mesh>
      </RigidBody>
      <group name="Rock002">
        <mesh
          name="Plane106"
          geometry={nodes.Plane106.geometry}
          material={materials.BlueSandOutline}
        />
        <mesh
          name="Plane106_1"
          geometry={nodes.Plane106_1.geometry}
          material={materials.TallCoralOutline}
        />
        <mesh
          name="Plane106_2"
          geometry={nodes.Plane106_2.geometry}
          material={materials.Kelp}
        />
        <mesh
          name="Plane106_3"
          geometry={nodes.Plane106_3.geometry}
          material={materials.KelpOutline}
        />
        <mesh
          name="Plane106_4"
          geometry={nodes.Plane106_4.geometry}
          material={materials.Rock}
        />
        <mesh
          name="Plane106_5"
          geometry={nodes.Plane106_5.geometry}
          material={materials.BlackOutline}
        />
        <mesh
          name="Plane106_6"
          geometry={nodes.Plane106_6.geometry}
          material={materials.SmallCoralMaterial}
        />
        <mesh
          name="Plane106_7"
          geometry={nodes.Plane106_7.geometry}
          material={materials.SmallCoralOutline}
        />
        <mesh
          name="Plane106_8"
          geometry={nodes.Plane106_8.geometry}
          material={materials.UrchinBlack}
        />
        <mesh
          name="Plane106_9"
          geometry={nodes.Plane106_9.geometry}
          material={materials.OrangeCoral}
        />
        <mesh
          name="Plane106_10"
          geometry={nodes.Plane106_10.geometry}
          material={materials.Black}
        />
      </group>
    </group>
  );
}

export function BigRock({ position, rotation }) {
  const { nodes, materials } = useGLTF("/environment_colliders.glb");
  return (
    <group position={position} rotation={rotation} name="BigRock">
      <RigidBody colliders="trimesh" type="fixed">
        <mesh geometry={nodes.ColliderBigRock.geometry}>
          <meshBasicMaterial opacity={0} transparent side={THREE.BackSide} />
        </mesh>
      </RigidBody>
      <group name="BigRock">
        <mesh
          name="Plane061"
          geometry={nodes.Plane061.geometry}
          material={materials.SmallCoralMaterial}
        />
        <mesh
          name="Plane061_1"
          geometry={nodes.Plane061_1.geometry}
          material={materials.SandOutline}
        />
        <mesh
          name="Plane061_2"
          geometry={nodes.Plane061_2.geometry}
          material={materials.BigRock}
        />
        <mesh
          name="Plane061_3"
          geometry={nodes.Plane061_3.geometry}
          material={materials.PurpleOutline}
        />
        <mesh
          name="Plane061_4"
          geometry={nodes.Plane061_4.geometry}
          material={materials.Kelp}
        />
        <mesh
          name="Plane061_5"
          geometry={nodes.Plane061_5.geometry}
          material={materials.KelpOutline}
        />
        <mesh
          name="Plane061_6"
          geometry={nodes.Plane061_6.geometry}
          material={materials.SmallCoralOutline}
        />
        <mesh
          name="Plane061_7"
          geometry={nodes.Plane061_7.geometry}
          material={materials.Black}
        />
        <mesh
          name="Plane061_8"
          geometry={nodes.Plane061_8.geometry}
          material={materials.DarkCoralMaterial}
        />
        <mesh
          name="Plane061_9"
          geometry={nodes.Plane061_9.geometry}
          material={materials.YellowSandOutline}
        />
        <mesh
          name="Plane061_10"
          geometry={nodes.Plane061_10.geometry}
          material={materials.KelpOrangeOutline}
        />
        <mesh
          name="Plane061_11"
          geometry={nodes.Plane061_11.geometry}
          material={materials.UrchinBlack}
        />
      </group>
    </group>
  );
}

export function BigRock001({ position, rotation }) {
  const { nodes, materials } = useGLTF("/environment_colliders.glb");
  return (
    <group position={position} rotation={rotation} name="BigRock001">
      <RigidBody colliders="trimesh" type="fixed">
        <mesh geometry={nodes.ColliderBigRock001.geometry}>
          <meshBasicMaterial opacity={0} transparent side={THREE.BackSide} />
        </mesh>
      </RigidBody>
      <group>
        <mesh
          name="Plane051"
          castShadow
          geometry={nodes.Plane051.geometry}
          material={materials.SmallCoralMaterial}
        />
        <mesh
          name="Plane051_1"
          castShadow
          geometry={nodes.Plane051_1.geometry}
          material={materials.SandOutline}
        />
        <mesh
          name="Plane051_2"
          castShadow
          geometry={nodes.Plane051_2.geometry}
          material={materials.BigRock}
        />
        <mesh
          name="Plane051_3"
          castShadow
          geometry={nodes.Plane051_3.geometry}
          material={materials.PurpleOutline}
        />
        <mesh
          name="Plane051_4"
          castShadow
          geometry={nodes.Plane051_4.geometry}
          material={materials.Kelp}
        />
        <mesh
          name="Plane051_5"
          castShadow
          geometry={nodes.Plane051_5.geometry}
          material={materials.KelpOutline}
        />
        <mesh
          name="Plane051_6"
          castShadow
          geometry={nodes.Plane051_6.geometry}
          material={materials.KelpOrange}
        />
        <mesh
          name="Plane051_7"
          castShadow
          geometry={nodes.Plane051_7.geometry}
          material={materials.KelpOrangeOutline}
        />
        <mesh
          name="Plane051_8"
          castShadow
          geometry={nodes.Plane051_8.geometry}
          material={materials.SmallCoralOutline}
        />
        <mesh
          name="Plane051_9"
          castShadow
          geometry={nodes.Plane051_9.geometry}
          material={materials.OrangeCoral}
        />
        <mesh
          name="Plane051_10"
          castShadow
          geometry={nodes.Plane051_10.geometry}
          material={materials.Black}
        />
        <mesh
          name="Plane051_11"
          castShadow
          geometry={nodes.Plane051_11.geometry}
          material={materials.UrchinBlack}
        />
        <mesh
          name="Plane051_12"
          castShadow
          geometry={nodes.Plane051_12.geometry}
          material={materials.YellowSandOutline}
        />
        <mesh
          name="Plane051_13"
          castShadow
          geometry={nodes.Plane051_13.geometry}
          material={materials.TallCoralOutline}
        />
      </group>
    </group>
  );
}

export function BigRock002({ position, rotation }) {
  const { nodes, materials } = useGLTF("/environment_colliders.glb");
  return (
    <group position={position} rotation={rotation} name="BigRock002">
      <RigidBody colliders="trimesh" type="fixed">
        <mesh geometry={nodes.ColliderBigRock002.geometry}>
          <meshBasicMaterial opacity={0} transparent side={THREE.BackSide} />
        </mesh>
      </RigidBody>
      <group name="BigRock002">
        <mesh
          name="Cube009"
          geometry={nodes.Cube009.geometry}
          material={materials.BigRock}
        />
        <mesh
          name="Cube009_1"
          geometry={nodes.Cube009_1.geometry}
          material={materials.PurpleOutline}
        />
        <mesh
          name="Cube009_2"
          geometry={nodes.Cube009_2.geometry}
          material={materials.RedCoral}
        />
        <mesh
          name="Cube009_3"
          geometry={nodes.Cube009_3.geometry}
          material={materials.Black}
        />
        <mesh
          name="Cube009_4"
          geometry={nodes.Cube009_4.geometry}
          material={materials.Kelp}
        />
        <mesh
          name="Cube009_5"
          geometry={nodes.Cube009_5.geometry}
          material={materials.KelpOutline}
        />
        <mesh
          name="Cube009_6"
          geometry={nodes.Cube009_6.geometry}
          material={materials.SmallCoralMaterial}
        />
        <mesh
          name="Cube009_7"
          geometry={nodes.Cube009_7.geometry}
          material={materials.SmallCoralOutline}
        />
        <mesh
          name="Cube009_8"
          geometry={nodes.Cube009_8.geometry}
          material={materials.KelpOrange}
        />
        <mesh
          name="Cube009_9"
          geometry={nodes.Cube009_9.geometry}
          material={materials.KelpOrangeOutline}
        />
        <mesh
          name="Cube009_10"
          geometry={nodes.Cube009_10.geometry}
          material={materials.SandOutline}
        />
        <mesh
          name="Cube009_11"
          geometry={nodes.Cube009_11.geometry}
          material={materials.YellowSandOutline}
        />
        <mesh
          name="Cube009_12"
          geometry={nodes.Cube009_12.geometry}
          material={materials.UrchinBlack}
        />
      </group>
    </group>
  );
}

export function TallCoral({ position, rotation }) {
  const { nodes, materials } = useGLTF("/environment_colliders.glb");

  const TALL_CORALS = [
    "Cylinder004",
    "Cylinder005",
    "Cylinder006",
    "Cylinder007",
    "Cylinder008",
  ];

  // Select a random coral
  const randomCoral =
    TALL_CORALS[Math.floor(Math.random() * TALL_CORALS.length)];
  const adjustedPosition: [number, number, number] = [
    position[0],
    position[1] - 0.1,
    position[2],
  ];

  return (
    <group position={adjustedPosition} rotation={rotation} name="TallCoral">
      <RigidBody colliders="trimesh" type="fixed">
        <mesh geometry={nodes.ColliderTallCoral.geometry}>
          <meshPhongMaterial opacity={0} transparent />
        </mesh>
      </RigidBody>
      <group>
        <mesh
          castShadow
          geometry={nodes[randomCoral].geometry}
          material={materials.TallCoralMaterial}
        />
        <mesh
          castShadow
          geometry={nodes[randomCoral + "_1"].geometry}
          material={materials.TallCoralOutline}
        />
      </group>
    </group>
  );
}

export function SmallCoral({ position, rotation }) {
  const { nodes, materials } = useGLTF("/environment_colliders.glb");

  const SMALL_CORALS = ["Cylinder010", "Cylinder011"];

  // Select a random coral
  const randomCoral =
    SMALL_CORALS[Math.floor(Math.random() * SMALL_CORALS.length)];

  return (
    <group position={position} rotation={rotation} name="SmallCoral">
      <RigidBody colliders="trimesh" type="fixed">
        <mesh geometry={nodes.ColliderSmallCoral.geometry}>
          <meshPhongMaterial opacity={0} transparent />
        </mesh>
      </RigidBody>
      <group>
        <mesh
          castShadow
          geometry={nodes[randomCoral].geometry}
          material={materials.SmallCoralMaterial}
        />
        <mesh
          castShadow
          geometry={nodes[randomCoral + "_1"].geometry}
          material={materials.SmallCoralOutline}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/environment_colliders.glb");
