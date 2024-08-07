import { KeyboardControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import Ecctrl from "../src/Ecctrl";
import Floor from "./Floor";
import Lights from "./Lights";
import ShotCube from "./ShotCube";
import CharacterModel from "./CharacterModel";
import React from "react";
import Enemies from "./Enemies";
import Corals from "./Corals";
import { useGame } from "../src/stores/useGame";
import Flowers from "./Flowers";
import CaveEntity from "./CaveEntity";
import { useFrame } from "@react-three/fiber";

export default function Experience() {
  /**
   * Debug settings
   */
  // const { physics, disableFollowCam } = useControls("World Settings", {
  //   physics: false,
  //   disableFollowCam: false,
  // });

  const physics = false;
  const disableFollowCam = false;
  const isTouchScreen = useGame((state) => state.isTouchScreen);

  /**
   * Keyboard control preset
   */
  const keyboardMap = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
    { name: "rightward", keys: ["ArrowRight", "KeyD"] },
    { name: "jump", keys: ["Space"] },
    { name: "run", keys: ["Shift"] },
    { name: "action1", keys: ["1"] },
    { name: "action2", keys: ["2"] },
    { name: "action3", keys: ["3"] },
    { name: "action4", keys: ["KeyF"] },
  ];

  return (
    <>
      {/* <Perf position="top-left" minimal /> */}

      <Lights />

      <Physics debug={physics} timeStep="vary">
        {/* Keyboard preset */}
        <KeyboardControls map={keyboardMap}>
          {/* Character Control */}
          <Ecctrl
            debug
            animated
            followLight
            springK={2}
            dampingC={0.2}
            // autoBalanceSpringK={1.2}
            // autoBalanceDampingC={0.04}
            // autoBalanceSpringOnY={0.7}
            // autoBalanceDampingOnY={0.05}
            disableFollowCam={disableFollowCam}
            position-y={isTouchScreen ? 20 : 10}
          >
            {/* Replace your model here */}
            <CharacterModel />
          </Ecctrl>
        </KeyboardControls>

        {/* Rough plan */}
        {/* <RoughPlane /> */}

        {/* Slopes and stairs */}
        {/* <Slopes /> */}

        {/* Small steps */}
        {/* <Steps /> */}

        {/* Rigid body objects */}
        {/* <RigidObjects /> */}

        {/* Floating platform */}
        {/* <FloatingPlatform /> */}

        {/* Dynamic platforms */}
        {/* <DynamicPlatforms /> */}

        {/* Floor */}
        <Floor />

        {/* Corals */}
        <Corals />

        {/* Flowers */}
        <Flowers />

        {/* Shoting cubes */}
        <ShotCube />

        {/* Enemies */}
        <Enemies />

        {/* Cave Entity */}
        <CaveEntity
          modelPath="cave_sponge_final"
          position={[-0.9, -0.7, 9.9]}
          rotation={[0, -(Math.PI * 9) / 3, 0]}
        />
        <CaveEntity
          modelPath="cave_patrick_final"
          position={[0.6, -1.8, 10]}
          rotation={[0, (Math.PI * 4) / 3, 0]}
        />
      </Physics>
    </>
  );
}
