import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import Experience from "../example/Experience";
import { Leva } from "leva";
import { EcctrlJoystick } from "../src/EcctrlJoystick";
import { Suspense, useEffect, useState } from "react";
import Overlay from "./Overlay";
import { useGame } from "../src/stores/useGame";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

const root = ReactDOM.createRoot(document.querySelector("#root"));

const EcctrlJoystickControls = () => {
  const [isTouchScreen, setIsTouchScreen] = useState(false);
  useEffect(() => {
    // Check if using a touch control device, show/hide joystick
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      setIsTouchScreen(true);
    } else {
      setIsTouchScreen(false);
    }
  }, []);
  return <>{isTouchScreen && <EcctrlJoystick buttonNumber={5} />}</>;
};

root.render(
  <>
    <Theme
      style={{
        background:
          "linear-gradient(0deg, rgba(28, 117, 233, 1) 0%, rgba(91, 204, 219, 1) 100%)",
      }}
    >
      <Leva collapsed />
      <EcctrlJoystickControls />
      <Canvas
        style={{ position: "fixed" }}
        shadows
        camera={{
          fov: 65,
          near: 0.1,
          far: 1000,
        }}
        onPointerDown={(e) => {
          if (e.pointerType === "mouse") {
            e.preventDefault();
            e.stopPropagation();
            if (document.getElementById("overlay")) return;
            (e.target as HTMLCanvasElement).requestPointerLock();
          }
        }}
      >
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      </Canvas>
      <Overlay />
    </Theme>
  </>
);
