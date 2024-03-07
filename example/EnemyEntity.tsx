import * as THREE from "three";
import {
  RapierRigidBody,
  RigidBody,
  CapsuleCollider,
} from "@react-three/rapier";
import React, { useRef, useState, useEffect, useMemo } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { useGame } from "../src/stores/useGame";
import { useFrame, useGraph } from "@react-three/fiber";
import { SkeletonUtils } from "three-stdlib";

const MAX_LINVEL = 2;
const ROTATION_THRESHOLD = Math.PI;
const IMPULSE_FACTOR = 50.0;
const ATTACK_THRESHOLD = 1.0;

function verifyLinvel(body) {
  const linvel = body?.current?.linvel();
  const linvelMagnitude = Math.sqrt(linvel?.x ** 2 + linvel?.z ** 2);
  return linvelMagnitude < MAX_LINVEL;
}

function getRotation(impulse, delta, scene) {
  const targetAngle = Math.atan2(impulse.x, impulse.z);
  const currentAngle = scene.rotation.y;
  const newAngle = THREE.MathUtils.lerp(
    currentAngle,
    targetAngle,
    0.1 * delta * 100
  );
  const angleDifference = Math.abs(newAngle - targetAngle);
  return angleDifference <= ROTATION_THRESHOLD ? newAngle : targetAngle;
}

function getImpulse(delta, inputDirection) {
  const impulseStrength = IMPULSE_FACTOR * delta;
  return {
    x: inputDirection.x * impulseStrength,
    y: 0,
    z: inputDirection.z * impulseStrength,
  };
}

function EnemyEntity({ position }) {
  const body = useRef<RigidBody>();
  const [index, setIndex] = useState(1); // Idle
  const { scene, animations, materials } = useGLTF("/sb3.glb");
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes } = useGraph(clone);

  // Extract animation actions
  const { ref, actions, names } = useAnimations(animations);
  const getCharacterPosition = useGame((state) => state.getCurPosition);

  useEffect(() => {
    actions[names[index]]?.reset().fadeIn(0.5).play();
    return () => {
      actions[names[index]]?.fadeOut(0.5);
      // Explicitly return void
    };
  }, [index, actions, names]);

  useFrame((state, delta) => {
    const characterPosition = getCharacterPosition();
    if (!body.current || !characterPosition) return;
    const direction = new THREE.Vector3()
      .subVectors(characterPosition, body.current.translation())
      .normalize();
    const bodyTranslation = new THREE.Vector3(
      body.current.translation().x,
      body.current.translation().y,
      body.current.translation().z
    );
    if (bodyTranslation.distanceTo(characterPosition) > ATTACK_THRESHOLD) {
      const impulse = getImpulse(delta, direction);
      if (ref.current) {
        ref.current.rotation.y = getRotation(impulse, delta, scene);
      }
      if (verifyLinvel(body)) body.current.applyImpulse(impulse);
      // Walk
      setIndex(2);
    } else {
      // Attack
      setIndex(0);
    }
  });

  return (
    <RigidBody
      ref={body}
      canSleep={false}
      mass={1.0}
      position={position}
      linearDamping={1}
      angularDamping={0.5}
      enabledRotations={[false, false, false]}
    >
      <CapsuleCollider args={[0.4, 0.4]} position={[0, 0.8, 0]} />
      {/* <primitive ref={ref} object={scene} /> */}
      <group ref={ref} dispose={null}>
        <group name="Scene">
          <group name="Armature">
            <group name="Hat">
              <skinnedMesh
                name="Cube003"
                geometry={(nodes.Cube003 as THREE.SkinnedMesh).geometry}
                material={materials.Yellow}
                skeleton={(nodes.Cube003 as THREE.SkinnedMesh).skeleton}
              />
              <skinnedMesh
                name="Cube003_1"
                geometry={(nodes.Cube003_1 as THREE.SkinnedMesh).geometry}
                material={materials.White}
                skeleton={(nodes.Cube003_1 as THREE.SkinnedMesh).skeleton}
              />
              <skinnedMesh
                name="Cube003_2"
                geometry={(nodes.Cube003_2 as THREE.SkinnedMesh).geometry}
                material={materials.Black}
                skeleton={(nodes.Cube003_2 as THREE.SkinnedMesh).skeleton}
              />
              <skinnedMesh
                name="Cube003_3"
                geometry={(nodes.Cube003_3 as THREE.SkinnedMesh).geometry}
                material={materials["Dark Blue"]}
                skeleton={(nodes.Cube003_3 as THREE.SkinnedMesh).skeleton}
              />
              <skinnedMesh
                name="Cube003_4"
                geometry={(nodes.Cube003_4 as THREE.SkinnedMesh).geometry}
                material={materials.Outline}
                skeleton={(nodes.Cube003_4 as THREE.SkinnedMesh).skeleton}
              />
            </group>
            <group name="Sponge">
              <skinnedMesh
                name="Cube001"
                geometry={(nodes.Cube001 as THREE.SkinnedMesh).geometry}
                material={materials.Yellow}
                skeleton={(nodes.Cube001 as THREE.SkinnedMesh).skeleton}
              />
              <skinnedMesh
                name="Cube001_1"
                geometry={(nodes.Cube001_1 as THREE.SkinnedMesh).geometry}
                material={materials.Green}
                skeleton={(nodes.Cube001_1 as THREE.SkinnedMesh).skeleton}
              />
              <skinnedMesh
                name="Cube001_2"
                geometry={(nodes.Cube001_2 as THREE.SkinnedMesh).geometry}
                material={materials.Red}
                skeleton={(nodes.Cube001_2 as THREE.SkinnedMesh).skeleton}
              />
              <skinnedMesh
                name="Cube001_3"
                geometry={(nodes.Cube001_3 as THREE.SkinnedMesh).geometry}
                material={materials.White}
                skeleton={(nodes.Cube001_3 as THREE.SkinnedMesh).skeleton}
              />
              <skinnedMesh
                name="Cube001_4"
                geometry={(nodes.Cube001_4 as THREE.SkinnedMesh).geometry}
                material={materials.Blue}
                skeleton={(nodes.Cube001_4 as THREE.SkinnedMesh).skeleton}
              />
              <skinnedMesh
                name="Cube001_5"
                geometry={(nodes.Cube001_5 as THREE.SkinnedMesh).geometry}
                material={materials.Black}
                skeleton={(nodes.Cube001_5 as THREE.SkinnedMesh).skeleton}
              />
              <skinnedMesh
                name="Cube001_6"
                geometry={(nodes.Cube001_6 as THREE.SkinnedMesh).geometry}
                material={materials.Brown}
                skeleton={(nodes.Cube001_6 as THREE.SkinnedMesh).skeleton}
              />
              <skinnedMesh
                name="Cube001_7"
                geometry={(nodes.Cube001_7 as THREE.SkinnedMesh).geometry}
                material={materials.Outline}
                skeleton={(nodes.Cube001_7 as THREE.SkinnedMesh).skeleton}
              />
            </group>
            <primitive object={nodes.Spine} />
            <primitive object={nodes.ShoulderL} />
            <primitive object={nodes.ShoulderR} />
            <primitive object={nodes.LegL} />
            <primitive object={nodes.LegR} />
          </group>
        </group>
      </group>
    </RigidBody>
  );
}

export default React.memo(EnemyEntity);

useGLTF.preload("/sb_animated.glb");
