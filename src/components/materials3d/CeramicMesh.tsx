import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const CeramicMesh = ({ hovered }: { hovered: boolean }) => {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * (hovered ? 0.5 : 0);
    }
  });

  return (
    <group ref={group}>
      {/* Main sphere */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <sphereGeometry args={[0.55, 64, 64]} />
        <meshPhysicalMaterial
          color="#fde68a"
          metalness={0.05}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.05}
          envMapIntensity={1.2}
        />
      </mesh>
      {/* Crystal facet accent */}
      <mesh position={[0.3, 0.5, 0.2]} rotation={[0.5, 0.8, 0.3]} castShadow>
        <octahedronGeometry args={[0.2, 0]} />
        <meshPhysicalMaterial
          color="#fef3c7"
          metalness={0.1}
          roughness={0.1}
          clearcoat={0.8}
          transparent
          opacity={0.85}
          envMapIntensity={1.5}
        />
      </mesh>
      {/* Small crystal */}
      <mesh position={[-0.25, -0.15, 0.35]} rotation={[0.2, 1.2, 0.6]} castShadow>
        <octahedronGeometry args={[0.13, 0]} />
        <meshPhysicalMaterial
          color="#f59e0b"
          metalness={0.15}
          roughness={0.15}
          clearcoat={1}
          envMapIntensity={1}
        />
      </mesh>
    </group>
  );
};
