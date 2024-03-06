import * as THREE from "three";
import {
  RapierRigidBody,
  RigidBody,
  CapsuleCollider,
} from "@react-three/rapier";
import React, { useRef, useState, useEffect, useMemo } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { useGame } from "../src/stores/useGame";
import { useFrame } from "@react-three/fiber";

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

export default function EnemyEntity({ position }) {
  const body = useRef<RigidBody>();
  const [characterState, setCharacterState] = useState("Idle");
  const { animations, scene } = useGLTF("/sb_animated.glb") as GLTF;
  const playableAnimations = useAnimations(animations, scene);
  const getCharacterPosition = useGame((state) => state.getCurPosition);

  useEffect(() => {
    const action = playableAnimations.actions[characterState];
    if (!action) return;
    action.reset().fadeIn(0.2).play();
    return () => {
      action.fadeOut(0.5);
    };
  }, [characterState]);

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
      scene.rotation.y = getRotation(impulse, delta, scene);
      if (verifyLinvel(body)) body.current.applyImpulse(impulse);
      setCharacterState("Walk");
    } else {
      console.log("Here");
      setCharacterState("Attack");
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
      <primitive object={scene} />
    </RigidBody>
  );
}
