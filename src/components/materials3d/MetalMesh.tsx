import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const MetalMesh = ({ hovered }: { hovered: boolean }) => {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * (hovered ? 0.5 : 0);
    }
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* Main implant cylinder */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.22, 1.2, 32]} />
        <meshStandardMaterial
          color="#8fa4b8"
          metalness={0.95}
          roughness={0.08}
          envMapIntensity={1.5}
        />
      </mesh>
      {/* Screw threads - rings */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} position={[0, -0.35 + i * 0.18, 0]} castShadow>
          <torusGeometry args={[0.29, 0.018, 8, 32]} />
          <meshStandardMaterial
            color="#6b8cad"
            metalness={0.9}
            roughness={0.15}
          />
        </mesh>
      ))}
      {/* Top head */}
      <mesh position={[0, 0.72, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.3, 0.15, 6]} />
        <meshStandardMaterial
          color="#9bb0c4"
          metalness={0.95}
          roughness={0.05}
          envMapIntensity={2}
        />
      </mesh>
      {/* Phillips cross on top */}
      <mesh position={[0, 0.805, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.18, 0.02, 0.03]} />
        <meshStandardMaterial color="#4a6478" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.805, 0]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
        <boxGeometry args={[0.18, 0.02, 0.03]} />
        <meshStandardMaterial color="#4a6478" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
};
