import { useAnimations, useGLTF } from "@react-three/drei";
import React, { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useGame } from "../src/stores/useGame";
import { useFrame } from "@react-three/fiber";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

export default function CharacterModel(props: CharacterModelProps) {
  // Change the character src to yours
  const group = useRef<THREE.Group>(null);
  const { nodes, animations, materials } = useGLTF(
    "/squid_try8.glb"
  ) as GLTF & {
    nodes: any;
    materials: { [name: string]: THREE.Material };
  };
  const { actions } = useAnimations(animations, group);
  const [keysPressed, setKeysPressed] = useState({
    w: false,
    a: false,
    s: false,
    d: false,
    shift: false,
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Shift") {
        setKeysPressed((prev) => ({ ...prev, shift: true }));
      }
      if (["w", "a", "s", "d"].includes(event.key.toLowerCase())) {
        setKeysPressed((prev) => ({
          ...prev,
          [event.key.toLowerCase()]: true,
        }));
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === "Shift") {
        setKeysPressed((prev) => ({ ...prev, shift: false }));
      }
      if (["w", "a", "s", "d"].includes(event.key.toLowerCase())) {
        setKeysPressed((prev) => ({
          ...prev,
          [event.key.toLowerCase()]: false,
        }));
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  /**
   * Character animations setup
   */
  const curAnimation = useGame((state) => state.curAnimation);
  const combatMode = useGame((state) => state.combatMode);
  const resetAnimation = useGame((state) => state.reset);
  const initializeAnimationSet = useGame(
    (state) => state.initializeAnimationSet
  );

  let mugModel: THREE.Object3D = null;
  let mugModl: THREE.Object3D = null;

  // Rename your character animations here
  const animationSet = {
    idle: combatMode === "melee" ? "IdleClarinet" : "Idle",
    walk: combatMode === "melee" ? "Walk30Clarinet" : "Walk",
    run: combatMode === "melee" ? "Run20Clarinet" : "Run2",
    jump: "Jump_Start",
    jumpIdle: "Jump_Idle",
    jumpLand: "Jump_Land",
    fall: "Jump_Idle",
    action1: "Attack2Clarinet",
    action2: "Run2Clarinet",
    action3: "Walk2Clarinet",
    action4: combatMode === "melee" ? "Attack20Clarinet" : "Shoot2",
  };

  const applyBoneFiltering = (
    action: THREE.AnimationAction,
    {
      filterBones,
      excludeBones,
    }: { filterBones?: string[]; excludeBones?: string[] }
  ) => {
    const filteredBindings: THREE.PropertyMixer[] = [];
    const filteredInterpolants: THREE.Interpolant[] = [];
    const bindings =
      ((action as any)._propertyBindings as THREE.PropertyMixer[]) || [];
    const interpolants =
      ((action as any)._interpolants as THREE.Interpolant[]) || [];

    if (filterBones) {
      bindings.forEach((propertyMixer, index) => {
        if (
          propertyMixer.binding &&
          propertyMixer.binding.node &&
          filterBones.includes(propertyMixer.binding.node.name)
        ) {
          filteredBindings.push(propertyMixer);
          filteredInterpolants.push(interpolants[index]);
        }
      });
    } else if (excludeBones) {
      bindings.forEach((propertyMixer, index) => {
        if (
          !(
            propertyMixer.binding &&
            propertyMixer.binding.node &&
            excludeBones.includes(propertyMixer.binding.node.name)
          )
        ) {
          filteredBindings.push(propertyMixer);
          filteredInterpolants.push(interpolants[index]);
        }
      });
    }

    (action as any)._propertyBindings = filteredBindings;
    (action as any)._interpolants = filteredInterpolants;
  };

  useEffect(() => {
    if (!group.current) return;
    group.current.traverse((obj) => {
      // Prepare mug model for cheer action
      if (obj.name === "Clarinet") {
        mugModel = obj;
      }
      if (obj.name === "Gun") {
        mugModl = obj;
      }
    });
  });

  useEffect(() => {
    // Prepare mug model for cheer action
    if (combatMode === "melee") {
      mugModel.visible = true;
      mugModl.visible = false;
    } else {
      mugModl.visible = true;
      mugModel.visible = false;
    }
  }, [combatMode]);

  useEffect(() => {
    // Initialize animation set
    initializeAnimationSet(animationSet);

    // Example usage of applyBoneFiltering
    if (actions["Shoot2"]) {
      applyBoneFiltering(actions["Shoot2"], {
        excludeBones: [
          "LegL",
          "CalfL",
          "FrontFootL",
          "FrontFootHeelL",
          "BackFootL",
          "BackFootHeelL",
          "LegR",
          "CalfR",
          "FrontFootR",
          "FrontFootHeelR",
          "BackFootR",
          "BackFootHeelR",
          "Head",
          "Neck",
        ],
      });
    }

    if (actions["AttackClarinet"]) {
      applyBoneFiltering(actions["AttackClarinet"], {
        excludeBones: [
          "LegL",
          "CalfL",
          "FrontFootL",
          "FrontFootHeelL",
          "BackFootL",
          "BackFootHeelL",
          "LegR",
          "CalfR",
          "FrontFootR",
          "FrontFootHeelR",
          "BackFootR",
          "BackFootHeelR",
          "Head",
          "Neck",
        ],
      });
    }

    if (actions["RunWithoutTop"]) {
      applyBoneFiltering(actions["RunWithoutTop"], {
        filterBones: [
          "LegL",
          "CalfL",
          "FrontFootL",
          "FrontFootHeelL",
          "BackFootL",
          "BackFootHeelL",
          "LegR",
          "CalfR",
          "FrontFootR",
          "FrontFootHeelR",
          "BackFootR",
          "BackFootHeelR",
        ],
      });
    }

    if (actions["WalkWithoutTop"]) {
      applyBoneFiltering(actions["WalkWithoutTop"], {
        filterBones: [
          "LegL",
          "CalfL",
          "FrontFootL",
          "FrontFootHeelL",
          "BackFootL",
          "BackFootHeelL",
          "LegR",
          "CalfR",
          "FrontFootR",
          "FrontFootHeelR",
          "BackFootR",
          "BackFootHeelR",
        ],
      });
    }

    if (actions["IdleWithoutTop"]) {
      applyBoneFiltering(actions["IdleWithoutTop"], {
        filterBones: [
          "LegL",
          "CalfL",
          "FrontFootL",
          "FrontFootHeelL",
          "BackFootL",
          "BackFootHeelL",
          "LegR",
          "CalfR",
          "FrontFootR",
          "FrontFootHeelR",
          "BackFootR",
          "BackFootHeelR",
        ],
      });
    }
  }, [actions, initializeAnimationSet]);

  useEffect(() => {
    const { w, a, s, d, shift } = keysPressed;
    const anyWASDPressed = w || a || s || d;

    // Play animation
    const action = actions[curAnimation ? curAnimation : animationSet.jumpIdle];

    // For jump and jump land animation, only play once and clamp when finish
    let topHalfAction = actions[curAnimation];
    // Just reverse the actions - rip animation system I made for three days
    let bottomHalfAction =
      shift && anyWASDPressed
        ? actions["RunWithoutTop"]
        : anyWASDPressed && !shift
        ? actions["WalkWithoutTop"]
        : actions["IdleWithoutTop"];
    if (
      curAnimation === animationSet.jump ||
      curAnimation === animationSet.jumpLand ||
      curAnimation === animationSet.action1 ||
      curAnimation === animationSet.action2 ||
      curAnimation === animationSet.action3
    ) {
      if (action) {
        action.reset().fadeIn(0.2).setLoop(THREE.LoopOnce, 0).play();
        action.clampWhenFinished = true;
      }
    } else if (curAnimation === animationSet.action4) {
      if (topHalfAction && bottomHalfAction) {
        topHalfAction.syncWith(bottomHalfAction);
        topHalfAction.play();
        topHalfAction.clampWhenFinished = true;
        (topHalfAction as any)._mixer.addEventListener("finished", () =>
          resetAnimation()
        );
        topHalfAction.reset().fadeIn(0.2).setLoop(THREE.LoopOnce, 0).play();

        bottomHalfAction.reset().fadeIn(0.2).play();
        bottomHalfAction.clampWhenFinished = true;
        (bottomHalfAction as any)._mixer.addEventListener("finished", () =>
          resetAnimation()
        );
        bottomHalfAction.reset().fadeIn(0.2).setLoop(THREE.LoopOnce, 0).play();
      }
    } else {
      action?.reset().fadeIn(0.2).play();
    }

    // When any action is clamp and finished reset animation
    (action as any)._mixer.addEventListener("finished", () => resetAnimation());

    return () => {
      // Move hand collider back to initial position after action
      if (curAnimation === animationSet.action4) {
        if (topHalfAction && bottomHalfAction) {
          (topHalfAction as any)._mixer.addEventListener("finished", () =>
            resetAnimation()
          );
          (bottomHalfAction as any)._mixer.addEventListener("finished", () =>
            resetAnimation()
          );

          topHalfAction.fadeOut(0.2);
          bottomHalfAction.fadeOut(0.2);

          (topHalfAction as any)._mixer.removeEventListener("finished", () =>
            resetAnimation()
          );
          (topHalfAction as any)._mixer._listeners = [];
          (bottomHalfAction as any)._mixer.removeEventListener("finished", () =>
            resetAnimation()
          );
          (bottomHalfAction as any)._mixer._listeners = [];
        }
      } else {
        // Fade out previous action
        action?.fadeOut(0.2);

        // Clean up mixer listener, and empty the _listeners array
        (action as any)._mixer.removeEventListener("finished", () =>
          resetAnimation()
        );
        (action as any)._mixer._listeners = [];
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
                name="SK_MP_Squidwardmo"
                geometry={nodes.SK_MP_Squidwardmo.geometry}
                material={materials.Squid}
                skeleton={nodes.SK_MP_Squidwardmo.skeleton}
              />
              <skinnedMesh
                castShadow
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
