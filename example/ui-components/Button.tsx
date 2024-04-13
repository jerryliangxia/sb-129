import React, { useState } from "react";
import { Text } from "@radix-ui/themes";

export const PSButton = (props: any) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseColor = "#35C7D2";
  const hoverColor = "#39D6E1";
  return (
    <button
      className="Button"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: "35%",
        height: "20%",
        backgroundColor: isHovered ? hoverColor : baseColor,
        borderRadius: "4px",
        cursor: "pointer",
        color: "#FFFFFF",
        padding: "8px 20px",
        transition: "transform 0.3s ease, background-color 0.3s ease",
        transform: isHovered ? "scale(1.1)" : "scale(1)",
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
