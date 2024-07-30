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
            aspectRatio: "3 / 2", // Updated line to maintain a 4:6 ratio
            borderRadius: "10px",
            backgroundImage: "url('/MenuBackground.png')", // Updated line
            backgroundSize: "cover", // Ensure the image covers the entire background
            backgroundRepeat: "no-repeat", // Prevent the image from repeating
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.5)",
          }}
        >
          <img
            src="/sb-129-drop.png"
            alt="Logo"
            style={{ maxWidth: "70%", maxHeight: "90%", objectFit: "contain" }}
          />
          <StyledButton
            onClick={() => handleClick()}
            style={{ height: "auto" }}
          >
            {curHealth > 0 ? "Play" : "Restart"}
          </StyledButton>
          {!isTouchScreen && (
            <StyledSwitch
              checked={isFullScreen}
              onCheckedChange={setIsFullScreen}
            />
          )}
        </Flex>
      )}
    </>
  );
}
