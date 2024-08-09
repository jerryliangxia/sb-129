import React, { useRef, useEffect, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export default function CaveEntity({
  modelPath,
  position,
  rotation,
}: {
  modelPath: string;
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF(`/models/${modelPath}.glb`);
  const { actions } = useAnimations(animations, group);
  const [intervalTime, setIntervalTime] = useState(10000); // Interval time in milliseconds

  useEffect(() => {
    const idleAction = actions["Idle"];
    const danceAction = actions["Dance"];

    if (idleAction && danceAction) {
      idleAction.play();

      const interval = setInterval(() => {
        if (idleAction.isRunning()) {
          idleAction.stop();
          danceAction.play();
        } else {
          danceAction.stop();
          idleAction.play();
        }
      }, intervalTime);

      return () => clearInterval(interval);
    }
  }, [actions, intervalTime]);

  return (
    <>
      {modelPath === "cave_sponge_final" ? (
        <group
          ref={group}
          dispose={null}
          position={position}
          rotation={rotation}
        >
          <group name="Scene">
            <group name="Armature" position={[0, 0.284, 0]} scale={0.398}>
              <group name="Sponge">
                <skinnedMesh
                  name="Cube009"
                  geometry={nodes.Cube009.geometry}
                  material={materials.Base}
                  skeleton={nodes.Cube009.skeleton}
                />
                <skinnedMesh
                  name="Cube009_1"
                  geometry={nodes.Cube009_1.geometry}
                  material={materials.Outline}
                  skeleton={nodes.Cube009_1.skeleton}
                />
              </group>
              <primitive object={nodes.Spine} />
              <primitive object={nodes.HipL} />
              <primitive object={nodes.HipR} />
            </group>
          </group>
        </group>
      ) : (
        <group
          ref={group}
          dispose={null}
          position={position}
          rotation={rotation}
        >
          <group name="Scene">
            <group name="Armature" position={[0, 1.092, 0]} scale={2.161}>
              <group name="Patrick">
                <skinnedMesh
                  name="Cube001"
                  geometry={nodes.Cube001.geometry}
                  material={materials.Base}
                  skeleton={nodes.Cube001.skeleton}
                />
                <skinnedMesh
                  name="Cube001_1"
                  geometry={nodes.Cube001_1.geometry}
                  material={materials.Outline}
                  skeleton={nodes.Cube001_1.skeleton}
                />
              </group>
              <primitive object={nodes.Spine} />
              <primitive object={nodes.CrotchL} />
              <primitive object={nodes.CrotchR} />
            </group>
          </group>
        </group>
      )}
    </>
  );
}
