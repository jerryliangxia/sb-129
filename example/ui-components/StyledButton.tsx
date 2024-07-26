import React, { useState } from "react";
import { Text } from "@radix-ui/themes";
import { useGame } from "../../src/stores/useGame";

export const StyledButton = (props: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const isTouchScreen = useGame((state) => state.isTouchScreen);

  return (
    <button
      className="Button"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsClicked(false);
      }}
      onMouseDown={() => setIsClicked(true)}
      onMouseUp={() => setIsClicked(false)}
      style={{
        width: "35%",
        aspectRatio: "3 / 2", // Maintain a 3:2 ratio
        backgroundImage: "url('/PlayButton.png')", // Set the background image
        backgroundSize: "cover", // Ensure the image covers the entire button
        backgroundRepeat: "no-repeat", // Prevent the image from repeating
        borderRadius: "8px",
        cursor: "pointer",
        color: "#FFFFFF",
        padding: "8px 20px",
        transition: "transform 0.3s ease, filter 0.3s ease",
        transform: isHovered ? "scale(1.1)" : "scale(1)",
        filter: isClicked
          ? "brightness(115%)"
          : isHovered
          ? "brightness(110%)"
          : "brightness(100%)", // Darken on hover and click
      }}
      onClick={props.onClick}
    >
      <Text size="2" style={{ color: "white" }}>
        {props.children}
      </Text>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          borderRadius: "4px",
          zIndex: -1,
          content: '""',
        }}
      />
    </button>
  );
};
