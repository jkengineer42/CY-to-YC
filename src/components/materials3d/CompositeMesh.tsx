import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const CompositeMesh = ({ hovered }: { hovered: boolean }) => {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * (hovered ? 0.5 : 0);
    }
  });

  return (
    <group ref={group} position={[0, 0.05, 0]}>
      {/* Core cube */}
      <mesh castShadow>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshPhysicalMaterial
          color="#7c3aed"
          metalness={0.3}
          roughness={0.2}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
          envMapIntensity={1.2}
        />
      </mesh>
      {/* Embedded sphere */}
      <mesh position={[0.35, 0.35, 0.35]} castShadow>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshPhysicalMaterial
          color="#c4b5fd"
          metalness={0.15}
          roughness={0.15}
          clearcoat={1}
          transparent
          opacity={0.85}
          envMapIntensity={1.5}
        />
      </mesh>
      {/* Fiber strands */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, -0.05 + i * 0.15, 0]} rotation={[0, i * 0.4, 0]} castShadow>
          <boxGeometry args={[1.0, 0.02, 0.02]} />
          <meshStandardMaterial
            color="#a78bfa"
            metalness={0.5}
            roughness={0.3}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
      {/* Accent ring */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.5, 0.025, 8, 32]} />
        <meshStandardMaterial
          color="#8b5cf6"
          metalness={0.6}
          roughness={0.15}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
};
