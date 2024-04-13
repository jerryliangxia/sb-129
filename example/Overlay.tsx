import React, { useEffect } from "react";
import { useGame } from "../src/stores/useGame";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { Flex, Text, Button } from "@radix-ui/themes";
import { PSButton } from "./ui-components/Button";

export default function Overlay() {
  // Your code here
  const overlayVisible = useGame((state) => state.overlayVisible);
  const setOverlayVisible = useGame((state) => state.setOverlayVisible);
  const isFullScreen = useGame((state) => state.isFullScreen);
  const setIsFullScreen = useGame((state) => state.setIsFullScreen);
  const gameStage = useGame((state) => state.gameStage);
  const setGameStage = useGame((state) => state.setGameStage);

  const handleClick = () => {
    if (isFullScreen) {
      document.body.requestFullscreen();
    }
    setGameStage(gameStage + 1);
    setOverlayVisible(!overlayVisible);
    const canvas = document.querySelector("canvas");
    const event = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    canvas?.dispatchEvent(event);
    if (isFullScreen) {
      // Full screen has to wait before pointer lock
      setTimeout(() => {
        document.body.requestPointerLock();
      }, 100);
    } else {
      document.body.requestPointerLock();
    }
  };

  function ToggleFullscreen() {
    return (
      <Flex direction="row" gap="2" align="center">
        <SwitchPrimitive.Root
          className="switch-root"
          checked={isFullScreen}
          onCheckedChange={setIsFullScreen}
          style={{
            backgroundColor: isFullScreen ? "#35C7D2" : "transparent",
            borderRadius: "9999px",
            width: "42px",
            height: "25px",
            position: "relative",
          }}
        >
          <SwitchPrimitive.Thumb
            className="switch-thumb"
            style={{
              display: "block",
              width: "21px",
              height: "21px",
              backgroundColor: "#fff",
              borderRadius: "9999px",
              transition: "transform 100ms",
              transform: isFullScreen
                ? "translateX(11px) translateY(-1px)"
                : "translateX(-6px) translateY(-1px)",
            }}
          />
        </SwitchPrimitive.Root>
        <Text style={{ color: "white" }} size="1">
          Fullscreen
        </Text>
      </Flex>
    );
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !overlayVisible) {
        setOverlayVisible(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [overlayVisible]);

  return (
    <>
      {overlayVisible && (
        <Flex
          id="overlay"
          align="center"
          direction="column"
          gap="3"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "30%",
            height: "30%",
            borderRadius: "10px",
            backgroundColor: "rgba(0,0,0,0.5)",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src="/sb-129-hd.png"
            alt="Logo"
            style={{ maxWidth: "80%", maxHeight: "100%", objectFit: "contain" }}
          />
          <PSButton onClick={() => handleClick()}>Enter</PSButton>
          <ToggleFullscreen />
        </Flex>
      )}
    </>
  );
}
