import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Wooden beam / timber structure */
export const WoodMesh = ({ hovered }: { hovered: boolean }) => {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * (hovered ? 0.5 : 0);
    }
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* Main beam */}
      <mesh castShadow>
        <boxGeometry args={[0.35, 1.1, 0.35]} />
        <meshStandardMaterial color="#a0714f" roughness={0.85} metalness={0.0} />
      </mesh>
      {/* Wood grain lines */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <mesh key={i} position={[0.176, -0.4 + i * 0.14, 0]} castShadow>
          <boxGeometry args={[0.005, 0.08, 0.34]} />
          <meshStandardMaterial color="#8b5e3c" roughness={0.9} metalness={0.0} transparent opacity={0.5} />
        </mesh>
      ))}
      {/* Cross beam */}
      <mesh position={[0, 0.2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <boxGeometry args={[0.2, 0.7, 0.2]} />
        <meshStandardMaterial color="#b8845a" roughness={0.8} metalness={0.0} />
      </mesh>
      {/* Ring / knot */}
      <mesh position={[0.05, -0.1, 0.176]} rotation={[0, 0, 0]} castShadow>
        <torusGeometry args={[0.06, 0.015, 8, 16]} />
        <meshStandardMaterial color="#7a4e2d" roughness={0.9} />
      </mesh>
    </group>
  );
};
