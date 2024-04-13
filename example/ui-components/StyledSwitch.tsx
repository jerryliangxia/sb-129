import React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { Flex, Text } from "@radix-ui/themes";

export const StyledSwitch = (props: any) => {
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
};
