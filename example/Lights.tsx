export default function Lights() {
  return (
    <>
      <directionalLight
        castShadow
        shadow-normalBias={0.06}
        position={[20, 30, 10]}
        intensity={1.5}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={50}
        shadow-camera-top={50}
        shadow-camera-right={50}
        shadow-camera-bottom={-50}
        shadow-camera-left={-50}
        name="followLight"
      />
      <ambientLight intensity={0.5} />
    </>
  );
}
