import {
  useAnimations,
  useGLTF,
  SpriteAnimator,
  useTexture,
} from "@react-three/drei";
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
    "/squidward_clarinet_mods_applied.glb"
  ) as GLTF & {
    nodes: any;
    materials: { [name: string]: THREE.Material };
  };
  const texture = useTexture("/base_color.png");
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
  const isTouchScreen = useGame((state) => state.isTouchScreen);
  const curAnimation = useGame((state) => state.curAnimation);
  const setCurAnimation = useGame((state) => state.setCurAnimation);
  const setCurPosition = useGame((state) => state.setCurPosition);
  const setCurDirection = useGame((state) => state.setCurDirection);
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
    idle: "C_Idle",
    walk: "C_Walk",
    run: "C_Run",
    jump: "C_JumpStart",
    jumpIdle: "C_JumpIdle",
    jumpLand: "C_JumpLand",
    fall: "C_JumpIdle",
    action1: isTouchScreen ? "C_Shoot_Mobile" : "C_Shoot",
    action2: "C_HeadButt",
    action3: "C_Kick",
    action4: "C_Attack",
    action5: "Fall",
    action6: "C_Death",
    action7: "C_Shoot",
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
      if (obj.name === "ShootClarinet") {
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
      setCurHealth(10); // Ensure health does not exceed 10 if that's the intended maximum after recovery
      group.current?.parent?.parent?.position.set(0, 0, 0);
      document.body.requestPointerLock();
      if (overlayVisible) setOverlayVisible(false);
    }
  }, [curHealth, setCurHealth, actions, animationSet, overlayVisible]);

  // Bone filtering
  useEffect(() => {
    // Initialize animation set
    initializeAnimationSet(animationSet);
    clarinet.visible = true;
    squidGun.visible = false;

    if (actions["C_Shoot"]) {
      applyBoneFiltering(actions["C_Shoot"], {
        excludeBones: [
          "BackLegL",
          "BackCalfL",
          "BackHeelL",
          "BackToesL",
          "BackToesTipL",
          "FrontLegL",
          "FrontCalfL",
          "FrontHeelL",
          "FrontToesL",
          "FrontToesTipL",
          "BackLegR",
          "BackCalfR",
          "BackHeelR",
          "BackToesR",
          "BackToesTipR",
          "FrontLegR",
          "FrontCalfR",
          "FrontHeelR",
          "FrontToesR",
          "FrontToesTipR",
        ],
      });
    }

    if (actions["C_Run_NoTop"]) {
      applyBoneFiltering(actions["C_Run_NoTop"], {
        filterBones: [
          "BackLegL",
          "BackCalfL",
          "BackHeelL",
          "BackToesL",
          "BackToesTipL",
          "FrontLegL",
          "FrontCalfL",
          "FrontHeelL",
          "FrontToesL",
          "FrontToesTipL",
          "BackLegR",
          "BackCalfR",
          "BackHeelR",
          "BackToesR",
          "BackToesTipR",
          "FrontLegR",
          "FrontCalfR",
          "FrontHeelR",
          "FrontToesR",
          "FrontToesTipR",
          "Hips",
          "Spine",
        ],
      });
    }

    if (actions["C_Walk_NoTop"]) {
      applyBoneFiltering(actions["C_Walk_NoTop"], {
        filterBones: [
          "BackLegL",
          "BackCalfL",
          "BackHeelL",
          "BackToesL",
          "BackToesTipL",
          "FrontLegL",
          "FrontCalfL",
          "FrontHeelL",
          "FrontToesL",
          "FrontToesTipL",
          "BackLegR",
          "BackCalfR",
          "BackHeelR",
          "BackToesR",
          "BackToesTipR",
          "FrontLegR",
          "FrontCalfR",
          "FrontHeelR",
          "FrontToesR",
          "FrontToesTipR",
          "Hips",
          "Spine",
        ],
      });
    }

    if (actions["C_Idle_NoTop"]) {
      applyBoneFiltering(actions["C_Idle_NoTop"], {
        filterBones: [
          "BackLegL",
          "BackCalfL",
          "BackHeelL",
          "BackToesL",
          "BackToesTipL",
          "FrontLegL",
          "FrontCalfL",
          "FrontHeelL",
          "FrontToesL",
          "FrontToesTipL",
          "BackLegR",
          "BackCalfR",
          "BackHeelR",
          "BackToesR",
          "BackToesTipR",
          "FrontLegR",
          "FrontCalfR",
          "FrontHeelR",
          "FrontToesR",
          "FrontToesTipR",
          "Hips",
          "Spine",
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
        if (obj.name === "HandR") rightHand = obj;
      }
    });
  });

  const mixer = useRef<THREE.AnimationMixer | null>(null);
  const blinkActionRef = useRef<THREE.AnimationAction | null>(null);

  useEffect(() => {
    if (!group.current) return;

    const eyeBags = group.current.getObjectByName("EyeBags") as THREE.Mesh;
    if (!eyeBags) return;

    // Create keyframe tracks for the morph targets
    const times = [0, 0.1, 0.5]; // Keyframe times
    const valuesUpEyeClose = [1, 0, 1]; // Values for UpEyeClose
    const valuesClosed = [0, 1, 0]; // Values for Closed

    const upEyeCloseTrack = new THREE.NumberKeyframeTrack(
      ".morphTargetInfluences[0]", // Assuming UpEyeClose is at index 0
      times,
      valuesUpEyeClose
    );

    const closedTrack = new THREE.NumberKeyframeTrack(
      ".morphTargetInfluences[1]", // Assuming Closed is at index 1
      times,
      valuesClosed
    );

    // Create an animation clip
    const blinkClip = new THREE.AnimationClip("Blink", 1, [
      upEyeCloseTrack,
      closedTrack,
    ]);

    // Create an animation mixer and play the clip
    mixer.current = new THREE.AnimationMixer(eyeBags);
    blinkActionRef.current = mixer.current.clipAction(blinkClip);
    blinkActionRef.current.setLoop(THREE.LoopOnce, 1); // Play the blink animation once

    // Function to start the blink animation
    const startBlinkAnimation = () => {
      if (blinkActionRef.current) {
        blinkActionRef.current.reset().play();
      }
    };

    // Initial state: UpEyeClose = 1, Closed = 0
    if (eyeBags?.morphTargetInfluences) {
      eyeBags.morphTargetInfluences[0] = 1;
      eyeBags.morphTargetInfluences[1] = 0;
    }
    // Start the blink animation after 5 seconds
    const blinkInterval = setInterval(() => {
      startBlinkAnimation();
    }, 5000);

    return () => {
      clearInterval(blinkInterval);
    };
  }, []);

  useFrame((state, delta) => {
    if (mixer.current) {
      mixer.current.update(delta);
    }
  });

  // Copy rigid body capsule collider to hand for action 4
  useFrame(() => {
    // console.log(group.current.parent.parent.position);
    if (curAnimation === animationSet.action4) {
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
    const action = actions[curAnimation ? curAnimation : animationSet.idle];

    // For jump and jump land animation, only play once and clamp when finish
    let topHalfAction = actions[animationSet.action7];
    // Just reverse the actions
    let bottomHalfAction =
      shift && anyWASDPressed
        ? actions["C_Run_NoTop"]
        : anyWASDPressed && !shift
        ? actions["C_Walk_NoTop"]
        : actions["C_Idle_NoTop"];

    if (
      curAnimation === animationSet.jump ||
      curAnimation === animationSet.jumpLand ||
      (curAnimation === animationSet.action1 && isTouchScreen) ||
      curAnimation === animationSet.action2 ||
      curAnimation === animationSet.action3 ||
      curAnimation === animationSet.action4
    ) {
      if (action) {
        action.reset().fadeIn(0.2).setLoop(THREE.LoopOnce, 0).play();
        action.clampWhenFinished = true;
      }
      if (curAnimation === animationSet.action1 && isTouchScreen) {
        clarinet.visible = false;
        squidGun.visible = true;
      }
    } else if (
      curAnimation === animationSet.action7 ||
      (!isTouchScreen && curAnimation === animationSet.action1)
    ) {
      squidGun.visible = true;
      clarinet.visible = false;
      setPunchEffectProp((prev) => ({
        ...prev,
        visible: true,
        play: true,
      }));
      if (topHalfAction && bottomHalfAction) {
        topHalfAction.syncWith(bottomHalfAction);
        topHalfAction.play();
        topHalfAction.clampWhenFinished = true;
        (topHalfAction as any)._mixer.addEventListener("finished", () =>
          resetAnimation()
        );
        topHalfAction.reset().fadeIn(0.2).setLoop(THREE.LoopOnce, 0).play();

        bottomHalfAction.reset().fadeIn(0.2).play();
        bottomHalfAction.clampWhenFinished = false; // Ensure it doesn't stay on the last frame
        (bottomHalfAction as any)._mixer.addEventListener("finished", () => {
          bottomHalfAction.fadeOut(0.2); // Smoothly transition out
          resetAnimation();
        });
        bottomHalfAction.reset().fadeIn(0.2).setLoop(THREE.LoopOnce, 0).play();
      }
    } else {
      // Once done, resets to idle
      action?.reset().fadeIn(0.2).play();
    }

    // When any action is clamp and finished reset animation
    if (action) {
      (action as any)._mixer.addEventListener("finished", () =>
        resetAnimation()
      );
    } else
      return () => {
        resetAnimation();
      };

    return () => {
      // Move hand collider back to initial position after action
      if (
        curAnimation === animationSet.action7 ||
        (curAnimation === animationSet.action1 && isTouchScreen)
      ) {
        squidGun.visible = false;
        clarinet.visible = true;
      }
      // Fade out previous action
      action?.fadeOut(0.2);

      // Clean up mixer listener, and empty the _listeners array
      (action as any)._mixer.removeEventListener("finished", () =>
        resetAnimation()
      );
      (action as any)._mixer._listeners = [];
    };
  }, [curAnimation]);

  return (
    <Suspense fallback={<capsuleGeometry args={[0.3, 0.7]} />}>
      {/* Right hand collider */}
      <mesh ref={rightHandRef} />
      {curAnimation === animationSet.action4 ? (
        <RigidBody userData={{ type: "clarinet" }}>
          <CapsuleCollider
            args={[0.1, 0.2]}
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
        scale={0.2}
        position-y={-0.9}
      >
        <group name="Scene">
          <group name="Armature">
            <group name="Base">
              <skinnedMesh
                name="Cube"
                geometry={nodes.Cube.geometry}
                material={materials.BaseColor}
                skeleton={nodes.Cube.skeleton}
              />
              <skinnedMesh
                name="Cube_1"
                geometry={nodes.Cube_1.geometry}
                // material={materials.Outline}
                skeleton={nodes.Cube_1.skeleton}
              >
                <meshStandardMaterial
                  color="black"
                  roughness={1.0}
                  metalness={0.0}
                />
              </skinnedMesh>
            </group>
            <skinnedMesh
              name="EyeBags"
              geometry={nodes.EyeBags.geometry}
              // material={materials.BaseColor}
              skeleton={nodes.EyeBags.skeleton}
              morphTargetDictionary={nodes.EyeBags.morphTargetDictionary}
              morphTargetInfluences={nodes.EyeBags.morphTargetInfluences}
              scale={0.9}
            >
              <meshStandardMaterial map={texture} map-flipY={false} />
            </skinnedMesh>
            <skinnedMesh
              name="EyeBags_Outline"
              geometry={nodes.EyeBags.geometry.clone().scale(-1, 1, 1)} // Flip the geometry
              skeleton={nodes.EyeBags.skeleton}
              morphTargetDictionary={nodes.EyeBags.morphTargetDictionary}
              morphTargetInfluences={nodes.EyeBags.morphTargetInfluences}
            >
              <meshStandardMaterial
                color="black"
                roughness={1.0}
                metalness={0.0}
                // side={THREE.DoubleSide} // Render both sides
              />
            </skinnedMesh>
            <group name="Eyes">
              <skinnedMesh
                name="Icosphere002"
                geometry={nodes.Icosphere002.geometry}
                material={materials.BaseColor}
                skeleton={nodes.Icosphere002.skeleton}
              >
                <meshStandardMaterial map={texture} map-flipY={false} />
              </skinnedMesh>
              <skinnedMesh
                name="Icosphere002_1"
                geometry={nodes.Icosphere002_1.geometry}
                // material={materials.Outline}
                skeleton={nodes.Icosphere002_1.skeleton}
              >
                <meshStandardMaterial
                  color="black"
                  roughness={1.0}
                  metalness={0.0}
                />
              </skinnedMesh>
            </group>
            <skinnedMesh
              name="Pupils"
              geometry={nodes.Pupils.geometry}
              // material={materials.BaseColor}
              skeleton={nodes.Pupils.skeleton}
            >
              <meshStandardMaterial map={texture} map-flipY={false} />
            </skinnedMesh>
            <primitive object={nodes.Spine} />
            <primitive object={nodes.Hips} />
          </group>
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
useGLTF.preload("/squidward_clarinet_mods_applied.glb");
