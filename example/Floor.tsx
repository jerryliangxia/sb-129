import { RigidBody } from "@react-three/rapier";
import { TextureLoader, RepeatWrapping } from "three";
import { useLoader } from "@react-three/fiber";

export default function Floor() {
  const texture = useLoader(TextureLoader, "/textures/sand.png");
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(50, 50); // Adjust the repeat values as needed

  return (
    <RigidBody type="fixed">
      <mesh receiveShadow position={[0, -3.5, 0]}>
        <boxGeometry args={[300, 5, 300]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </RigidBody>
  );
}
