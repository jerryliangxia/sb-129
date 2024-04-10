/*
This file was generated by https://github.com/pmndrs/gltfjsx and then
customized manually. It uses drei's new useAnimations hook which extracts
all actions and sets up a THREE.AnimationMixer for it so that you don't have to.
All of the assets actions, action-names and clips are available in its output. 
*/

import * as THREE from "three";
import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  useGLTF,
  useTexture,
  useAnimations,
  SpriteAnimator,
} from "@react-three/drei";
import { useGame } from "../src/stores/useGame";
import { useGraph, useFrame } from "@react-three/fiber";
import { SkeletonUtils } from "three-stdlib";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";

const MAX_LINVEL = 2;
const ROTATION_THRESHOLD = Math.PI;
const IMPULSE_FACTOR = 50.0;
const ATTACK_THRESHOLD = 1.0;

function verifyLinvel(body) {
  const linvel = body?.current?.linvel();
  const linvelMagnitude = Math.sqrt(linvel?.x ** 2 + linvel?.z ** 2);
  return linvelMagnitude < MAX_LINVEL;
}

function getRotation(impulse, delta, ref) {
  const targetAngle = Math.atan2(impulse.x, impulse.z);
  const currentAngle = ref.rotation.y;
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

export default function Model({ position, ...props }) {
  // For the rigidbody component
  const body = useRef<RigidBody>();
  // Fetch model and a separate texture
  // const { scene, animations, materials } = useGLTF("/sb_restart.glb");
  const { scene, animations, materials } = useGLTF("/sb_onemesh.glb");
  const texture = useTexture("/sponge_512.png");
  //   const texture = useTexture("/stacy.jpg");

  // Skinned meshes cannot be re-used in threejs without cloning them
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  // useGraph creates two flat object collections for nodes and materials
  const { nodes } = useGraph(clone);

  // Extract animation actions
  const { ref, actions, names } = useAnimations(animations);
  const getCharacterPosition = useGame((state) => state.getCurPosition);

  // Hover and animation-index states
  const [index, setIndex] = useState(1);
  const [numHits, setNumHits] = useState(2);
  const [isBeingHit, setIsBeingHit] = useState(false);
  const [isDying, setIsDying] = useState(false);

  const [punchEffectProps, setPunchEffectProp] = useState({
    visible: false,
    scale: [2, 2, 2],
    play: false,
    position: [0, 0, -1],
    startFrame: 0,
  });

  useEffect(() => {
    const action = actions[names[index]];
    if (action) {
      action.reset().fadeIn(0.5).play();
      if (index === 1) {
        action.clampWhenFinished = true;
        action.loop = THREE.LoopOnce;
        setTimeout(() => {
          if (numHits === -1) {
            setPunchEffectProp((prev) => ({
              ...prev,
              visible: true,
              play: true,
            }));
          }
        }, 1000);
      } else {
        // Reset to default behavior for other indices if needed
        action.clampWhenFinished = false;
        action.loop = THREE.LoopRepeat; // Or any other default loop mode you're using
      }
    }

    return () => {
      actions[names[index]]?.fadeOut(0.5);
      setIsBeingHit(false);
      // Explicitly return void
    };
  }, [index, actions, names]);

  useFrame((state, delta) => {
    if (isDying) {
      setIndex(1);
      return;
    }
    if (isBeingHit) {
      setIndex(2);
      return;
    }
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
        ref.current.rotation.y = getRotation(impulse, delta, ref.current);
      }
      if (verifyLinvel(body)) body.current.applyImpulse(impulse);
      // Walk
      setIndex(3);
    } else {
      // Attack
      setIndex(0);
    }
  });

  return (
    <RigidBody
      ref={body}
      userData={{ type: "enemy" }}
      colliders={false}
      canSleep={false}
      mass={1.0}
      position={position}
      linearDamping={1}
      angularDamping={0.5}
      enabledRotations={[false, false, false]}
      onCollisionEnter={(event) => {
        const impulseMagnitude = 2; // Adjust the magnitude as needed
        const randomAngle = Math.random() * 2 * Math.PI; // Random angle in radians
        const impulse = {
          x: Math.cos(randomAngle) * impulseMagnitude,
          y: 0, // Assuming you only want to apply the impulse in the X-Z plane
          z: Math.sin(randomAngle) * impulseMagnitude,
        };
        if (verifyLinvel(body)) body.current.applyImpulse(impulse);
        const type = (event.collider as any)._parent?.userData.type;
        if (type === "shotCube" || type === "clarinet") {
          if (type === "shotCube") {
            (event.collider as any)._parent.userData.type = null;
          } else if (isBeingHit || isDying) {
            console.log("Stopping early");
            return;
          }
          setNumHits(numHits - 1);
          if (numHits === 0) {
            setIsDying(true);
            setIndex(1);
          } else {
            setIsBeingHit(true);
            setIndex(2);
          }
        }
      }}
    >
      {numHits > -1 && (
        <CapsuleCollider args={[0.4, 0.4]} position={[0, 0.8, 0]} />
      )}
      <group ref={ref} dispose={null} visible={numHits > -2}>
        <group name="Scene">
          <group name="Armature" position={[0, 0.316, 0]} scale={0.651}>
            <group name="Sponge">
              <skinnedMesh
                name="Cube003"
                geometry={nodes.Cube003.geometry}
                skeleton={nodes.Cube003.skeleton}
              >
                <meshStandardMaterial map={texture} map-flipY={false} />
              </skinnedMesh>
              <skinnedMesh
                name="Cube003_1"
                geometry={nodes.Cube003_1.geometry}
                material={materials.Outline}
                skeleton={nodes.Cube003_1.skeleton}
              />
            </group>
            <primitive object={nodes.Main} />
            <primitive object={nodes.ShoulderL} />
            <primitive object={nodes.ShoulderR} />
          </group>
        </group>
        {/* <SpriteAnimator
          visible={punchEffectProps.visible}
          scale={punchEffectProps.scale as any}
          position={punchEffectProps.position as any}
          startFrame={punchEffectProps.startFrame}
          loop={true}
          onLoopEnd={() => {
            setPunchEffectProp((prev) => ({
              ...prev,
              visible: false,
              play: false,
            }));
            if (numHits == -1) setNumHits(-2);
          }}
          play={punchEffectProps.play}
          numberOfFrames={7}
          alphaTest={0.1}
          textureImageURL={"./punchEffect.png"}
        /> */}
      </group>
    </RigidBody>
  );
}
