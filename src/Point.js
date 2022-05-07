export default function Point({ position }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.1, 30, 30]} />
      <meshPhongMaterial color="purple" />
    </mesh>
  );
}
