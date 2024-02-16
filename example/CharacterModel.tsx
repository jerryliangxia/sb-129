import { useAnimations, useGLTF } from "@react-three/drei";
import React, { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { useGame } from "../src/stores/useGame";
import { useFrame } from "@react-three/fiber";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

export default function CharacterModel(props: CharacterModelProps) {
  // Change the character src to yours
  const group = useRef<THREE.Group>(null);
  const { nodes, animations, materials } = useGLTF(
    "/squid_try2.glb"
  ) as GLTF & {
    nodes: any;
    materials: { [name: string]: THREE.Material };
  };
  const { actions } = useAnimations(animations, group);

  /**
   * Character animations setup
   */
  const curAnimation = useGame((state) => state.curAnimation);
  const resetAnimation = useGame((state) => state.reset);
  const initializeAnimationSet = useGame(
    (state) => state.initializeAnimationSet
  );

  // Rename your character animations here
  const animationSet = {
    idle: "Idle",
    walk: "Walk",
    run: "Run2",
    jump: "Jump_Start",
    jumpIdle: "Jump_Idle",
    jumpLand: "Jump_Land",
    fall: "Jump_Idle", // This is for falling from high sky
    action1: "Run",
    action2: "Run",
    action3: "Run",
    action4: "Shoot and Run",
  };

  useEffect(() => {
    // Initialize animation set
    initializeAnimationSet(animationSet);
  }, []);

  useFrame(() => {
    if (curAnimation === animationSet.action4) {
      // if (rightHand) {
      //   rightHand.getWorldPosition(rightHandPos);
      //   group.current.getWorldPosition(bodyPos);
      //   group.current.getWorldQuaternion(bodyRot);
      // }
      // // Apply hands position to hand colliders
      // if (rightHandColliderRef.current) {
      //   // check if parent group autobalance is on or off
      //   if (group.current.parent.quaternion.y === 0 && group.current.parent.quaternion.w === 1) {
      //     rightHandRef.current.position.copy(rightHandPos).sub(bodyPos).applyQuaternion(bodyRot.conjugate());
      //   } else {
      //     rightHandRef.current.position.copy(rightHandPos).sub(bodyPos);
      //   }
      //   rightHandColliderRef.current.setTranslationWrtParent(
      //     rightHandRef.current.position
      //   );
      // }
      console.log("Hello");
    }
  });

  useEffect(() => {
    // Play animation
    const action = actions[curAnimation ? curAnimation : animationSet.jumpIdle];

    // For jump and jump land animation, only play once and clamp when finish
    if (
      curAnimation === animationSet.jump ||
      curAnimation === animationSet.jumpLand ||
      curAnimation === animationSet.action1 ||
      curAnimation === animationSet.action2 ||
      curAnimation === animationSet.action3 ||
      curAnimation === animationSet.action4
    ) {
      if (action) {
        action.reset().fadeIn(0.2).setLoop(THREE.LoopOnce, 0).play();
        action.clampWhenFinished = true;
      }
    } else {
      action?.reset().fadeIn(0.2).play();
    }

    // When any action is clamp and finished reset animation
    (action as any)._mixer.addEventListener("finished", () => resetAnimation());

    return () => {
      // Fade out previous action
      action?.fadeOut(0.2);

      // Clean up mixer listener, and empty the _listeners array
      (action as any)._mixer.removeEventListener("finished", () =>
        resetAnimation()
      );
      (action as any)._mixer._listeners = [];

      // Move hand collider back to initial position after action
      if (curAnimation === animationSet.action4) {
        // if (rightHandColliderRef.current) {
        //   rightHandColliderRef.current.setTranslationWrtParent(
        //     vec3({ x: 0, y: 0, z: 0 })
        //   );
        // }
      }
    };
  }, [curAnimation]);

  return (
    <Suspense fallback={<capsuleGeometry args={[0.3, 0.7]} />}>
      {/* Character model */}
      <group
        ref={group}
        {...props}
        dispose={null}
        scale={0.4}
        position-y={-0.9}
      >
        <group name="Scene">
          <group name="Armature" position={[0, 1.422, 0]} scale={0.762}>
            <skinnedMesh
              name="Eyebags"
              geometry={nodes.Eyebags.geometry}
              material={materials.Squid}
              skeleton={nodes.Eyebags.skeleton}
            />
            <group name="SquidMesh">
              <skinnedMesh
                castShadow
                name="SK_MP_Squidwardmo"
                geometry={nodes.SK_MP_Squidwardmo.geometry}
                material={materials.Squid}
                skeleton={nodes.SK_MP_Squidwardmo.skeleton}
              />
              <skinnedMesh
                name="SK_MP_Squidwardmo_1"
                geometry={nodes.SK_MP_Squidwardmo_1.geometry}
                material={materials.Outline}
                skeleton={nodes.SK_MP_Squidwardmo_1.skeleton}
              />
            </group>
            <primitive object={nodes.Bone} />
          </group>
          <group name="Empty" position={[0.516, 1.362, 0.801]} />
        </group>
      </group>
    </Suspense>
  );
}

export type CharacterModelProps = JSX.IntrinsicElements["group"];

// Change the character src to yours
useGLTF.preload("/Floating Character.glb");
