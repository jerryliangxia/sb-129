import React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { Flex, Text } from "@radix-ui/themes";
import { useGame } from "../../src/stores/useGame";

export const StyledSwitch = (props: any) => {
  const isTouchScreen = useGame((state) => state.isTouchScreen);

  return (
    <Flex direction="row" gap="2" align="center">
      <SwitchPrimitive.Root
        className="switch-root"
        checked={props.checked}
        onCheckedChange={props.onCheckedChange}
        style={{
          backgroundColor: props.checked ? "#35C7D2" : "transparent",
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
            transform: props.checked
              ? `${isTouchScreen ? "translateX(6px)" : "translateX(11px)"} ${
                  isTouchScreen ? "translateY(0px)" : "translateY(-1px)"
                }`
              : `${isTouchScreen ? "translateX(-11px)" : "translateX(-6px)"} ${
                  isTouchScreen ? "translateY(0px)" : "translateY(-1px)"
                }`,
          }}
        />
      </SwitchPrimitive.Root>
      <Text style={{ color: "white" }} size="1">
        Fullscreen
      </Text>
    </Flex>
  );
};
