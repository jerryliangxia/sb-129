import React, { useRef, useState, useEffect } from "react";
import { useGame } from "../src/stores/useGame";

export default function Overlay(props) {
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
        <div
          id="overlay"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "200px",
            height: "100px",
            backgroundColor: "rgba(0,0,0,0.5)",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button onClick={() => handleClick()}>Enter</button>
          <button
            onClick={() => {
              setIsFullScreen(!isFullScreen);
            }}
          >
            {isFullScreen ? "Is Full Screen" : "No Full Screen"}
          </button>
        </div>
      )}
    </>
  );
}
