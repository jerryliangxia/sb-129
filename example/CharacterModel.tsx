import { useAnimations, useGLTF, SpriteAnimator } from "@react-three/drei";
import React, { Suspense, useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { useGame } from "../src/stores/useGame";
import { useFrame, useThree } from "@react-three/fiber";
import {
  CapsuleCollider,
  RigidBody,
  RapierCollider,
} from "@react-three/rapier";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

export default function CharacterModel(props: CharacterModelProps) {
  // Change the character src to yours
  const group = useRef<THREE.Group>(null);
  const { nodes, animations, materials } = useGLTF(
    "/squid_try10.glb"
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

  /**
   * Prepare punch effect sprite
   */
  const [punchEffectProps, setPunchEffectProp] = useState({
    visible: false,
    scale: [2, 2, 2],
    play: false,
    position: [0, 2.3, 1.5],
    startFrame: 0,
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
  const setCurAnimation = useGame((state) => state.setCurAnimation);
  const setCurPosition = useGame((state) => state.setCurPosition);
  const setCurDirection = useGame((state) => state.setCurDirection);
  const combatMode = useGame((state) => state.combatMode);
  const curHealth = useGame((state) => state.curHealth);
  const setCurHealth = useGame((state) => state.setCurHealth);
  const overlayVisible = useGame((state) => state.overlayVisible);
  const setOverlayVisible = useGame((state) => state.setOverlayVisible);
  const resetAnimation = useGame((state) => state.reset);
  const initializeAnimationSet = useGame(
    (state) => state.initializeAnimationSet
  );

  let clarinet: THREE.Object3D | null = null;
  let squidGun: THREE.Object3D | null = null;

  // Rename your character animations here
  let animationSet = {
    idle: combatMode === "melee" ? "IdleClarinet" : "Idle",
    walk: combatMode === "melee" ? "Walk30Clarinet" : "Walk",
    run: combatMode === "melee" ? "Run20Clarinet" : "Run2",
    jump: "Jump_Start",
    jumpIdle: "Jump_Idle",
    jumpLand: "Jump_Land",
    fall: "Jump_Idle",
    action1: "Jump_Idle",
    action2: "Jump_Idle",
    action3: "Jump_Land",
    action4: combatMode === "melee" ? "Attack20Clarinet" : "Shoot2",
    action5: "FallOver",
    action6: "IdleDeath",
  };

  useFrame((state, delta) => {
    setCurPosition(
      group?.current?.getWorldPosition(new THREE.Vector3()) ??
        new THREE.Vector3()
    );
    setCurDirection(
      group?.current?.getWorldDirection(new THREE.Vector3()) ??
        new THREE.Vector3()
    );
  });

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

  // Initialize clarinet and gun model
  useEffect(() => {
    if (!group.current) return;
    group.current.traverse((obj) => {
      // Prepare mug model for cheer action
      if (obj.name === "Clarinet") {
        clarinet = obj;
      }
      if (obj.name === "Gun") {
        squidGun = obj;
      }
    });
  });

  // Health - handle deaths
  useEffect(() => {
    if (curHealth == 0) {
      Object.values(actions).forEach((action) => {
        action?.stop();
      });
      const fallAction = actions[animationSet.action5];
      if (fallAction) {
        fallAction.reset().play();
        fallAction.clampWhenFinished = true;
        fallAction.setLoop(THREE.LoopOnce, 1);

        fallAction.getMixer().addEventListener("finished", () => {
          fallAction?.fadeOut(1.0);
          const idleDeathAction = actions[animationSet.action6];
          idleDeathAction?.reset().fadeIn(1.0).play();
          document.exitPointerLock();
          if (!overlayVisible) setOverlayVisible(true);
        });
      }
    }
  }, [curHealth]);

  const { camera } = useThree();

  useEffect(() => {
    if (curHealth > 10) {
      // Stop any death animations and reset character state
      const fallAction = actions[animationSet.action5];
      fallAction?.stop();

      const idleDeathAction = actions[animationSet.action6];
      idleDeathAction?.stop();

      // Reset the character to the idle animation
      actions[animationSet.action3]?.reset().play();
      setCurHealth(10); // Ensure health does not exceed 10 if that's the intended maximum after recovery
      group.current?.parent?.parent?.position.set(0, 0, 0);
      // group.current?.parent?.parent?.rotation.set(0, 0, 0);
      // group.current?.parent?.parent?.quaternion.set(0, 0, 0, 1);
      // camera.lookAt(new THREE.Vector3(0, 0, 1));
      // camera.updateProjectionMatrix();
      document.body.requestPointerLock();
      if (overlayVisible) setOverlayVisible(false);
    }
  }, [curHealth, setCurHealth, actions, animationSet, overlayVisible]);

  // Initialize animation set
  useEffect(() => {
    if (curHealth <= 0) return;
    // Prepare mug model for cheer action
    if (combatMode === "melee") {
      clarinet.visible = true;
      squidGun.visible = false;
    } else {
      squidGun.visible = true;
      clarinet.visible = false;
    }
    animationSet = {
      idle: combatMode === "melee" ? "IdleClarinet" : "Idle",
      walk: combatMode === "melee" ? "Walk30Clarinet" : "Walk",
      run: combatMode === "melee" ? "Run20Clarinet" : "Run2",
      jump: "Jump_Start",
      jumpIdle: "Jump_Idle",
      jumpLand: "Jump_Land",
      fall: "Jump_Idle",
      action1: "Jump_Idle",
      action2: "Jump_Idle",
      action3: "Jump_Land",
      action4: combatMode === "melee" ? "Attack20Clarinet" : "Shoot2",
    };
    initializeAnimationSet(animationSet);
  }, [combatMode, initializeAnimationSet]);

  // Bone filtering
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

  const rightHandRef = useRef<THREE.Mesh>(null);
  const rightHandColliderRef = useRef<RapierCollider | null>(null);
  const rightHandPos = useMemo(() => new THREE.Vector3(), []);
  const bodyPos = useMemo(() => new THREE.Vector3(), []);
  const bodyRot = useMemo(() => new THREE.Quaternion(), []);
  let rightHand: THREE.Object3D | null = null;

  useEffect(() => {
    group?.current?.traverse((obj) => {
      // Prepare both hands bone object
      if (obj instanceof THREE.Bone) {
        if (obj.name === "HandTopR") rightHand = obj;
      }
    });
  });

  useFrame(() => {
    // console.log(group.current.parent.parent.position);
    if (curAnimation === "Attack20Clarinet") {
      if (rightHand) {
        rightHand.getWorldPosition(rightHandPos);
        group?.current?.getWorldPosition(bodyPos);
        group?.current?.getWorldQuaternion(bodyRot);
      }

      // Apply hands position to hand colliders
      if (rightHandColliderRef.current) {
        // check if parent group autobalance is on or off
        if (
          group?.current?.parent?.quaternion.y === 0 &&
          group?.current?.parent?.quaternion.w === 1
        ) {
          rightHandRef?.current?.position
            .copy(rightHandPos)
            .sub(bodyPos)
            .sub(new THREE.Vector3(0, 1.0, 0.2))
            .applyQuaternion(bodyRot.conjugate());
        } else {
          rightHandRef?.current?.position
            .copy(rightHandPos)
            .sub(bodyPos)
            .applyQuaternion(bodyRot.conjugate());
        }
        rightHandColliderRef?.current?.setTranslationWrtParent(
          rightHandRef?.current?.position || new THREE.Vector3()
        );
      }
    }
  });

  useEffect(() => {
    if (curHealth <= 0) return;
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
      if (animationSet.action4 === "Shoot2") {
        setPunchEffectProp((prev) => ({
          ...prev,
          visible: true,
          play: true,
        }));
      }
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
      {/* Right hand collider */}
      <mesh ref={rightHandRef} />
      {curAnimation === animationSet.action4 ? (
        <RigidBody userData={{ type: "clarinet" }}>
          <CapsuleCollider
            args={[0.1, 0.1]}
            rotation={[Math.PI / 2, 0, 0]}
            ref={rightHandColliderRef}
            onCollisionEnter={(e) => {
              if (curAnimation === animationSet.action4) {
                // Play punch effect
                setPunchEffectProp((prev) => ({
                  ...prev,
                  visible: true,
                  play: true,
                }));
              }
            }}
          />
        </RigidBody>
      ) : (
        <></>
      )}

      {/* Character model */}
      {/* Used as a spring for the speed of rotation */}
      <CapsuleCollider args={[0.4, 0.35]} position={[0, 0.0, 0]} />
      <group
        ref={group}
        {...props}
        rotation={[0, 0, 0]}
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
        {/* <SpriteAnimator
          visible={punchEffectProps.visible}
          scale={punchEffectProps.scale as any}
          position={punchEffectProps.position as any}
          startFrame={punchEffectProps.startFrame}
          loop={true}
          onLoopEnd={() => {
            console.log("Loop ended");
            setPunchEffectProp((prev) => ({
              ...prev,
              visible: false,
              play: false,
            }));
          }}
          play={punchEffectProps.play}
          numberOfFrames={7}
          alphaTest={0.1}
          textureImageURL={"./punchEffect.png"}
        /> */}
      </group>
    </Suspense>
  );
}

export type CharacterModelProps = JSX.IntrinsicElements["group"];

// Change the character src to yours
useGLTF.preload("/Floating Character.glb");
