import React, { useEffect } from "react";
import { useGame } from "../src/stores/useGame";
import { Flex } from "@radix-ui/themes";
import { StyledButton } from "./ui-components/StyledButton";
import { StyledSwitch } from "./ui-components/StyledSwitch";

export default function Overlay() {
  // Your code here
  const overlayVisible = useGame((state) => state.overlayVisible);
  const setOverlayVisible = useGame((state) => state.setOverlayVisible);
  const isFullScreen = useGame((state) => state.isFullScreen);
  const setIsFullScreen = useGame((state) => state.setIsFullScreen);
  const gameStage = useGame((state) => state.gameStage);
  const setGameStage = useGame((state) => state.setGameStage);
  const curHealth = useGame((state) => state.curHealth);
  const setCurHealth = useGame((state) => state.setCurHealth);
  const setCurAnimation = useGame((state) => state.setCurAnimation);
  const animationSet = useGame((state) => state.animationSet);
  const isTouchScreen = useGame((state) => state.isTouchScreen);

  const handleClick = () => {
    if (isFullScreen) {
      document.body.requestFullscreen();
    }
    if (curHealth <= 0) {
      setCurHealth(11); // Reset to 11 to trigger useEffect in CharacterModel
      setCurAnimation("IdleClarinet");
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
            width: isTouchScreen ? "80%" : "30%",
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
          <StyledButton onClick={() => handleClick()}>
            {curHealth > 0 ? "Enter" : "Restart"}
          </StyledButton>
          <StyledSwitch
            checked={isFullScreen}
            onCheckedChange={setIsFullScreen}
          />
        </Flex>
      )}
    </>
  );
}
