import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const PolymerMesh = ({ hovered }: { hovered: boolean }) => {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * (hovered ? 0.4 : 0);
    }
  });

  return (
    <group ref={group}>
      {/* Flexible mesh sheet layers */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, -0.2 + i * 0.25, i * 0.08]} rotation={[0.15 * i, 0, 0.05 * i]} castShadow>
          <boxGeometry args={[1.2, 0.04, 0.9]} />
          <meshPhysicalMaterial
            color={i === 1 ? "#5eead4" : "#99f6e4"}
            metalness={0.0}
            roughness={0.3}
            transmission={0.4}
            thickness={0.5}
            transparent
            opacity={i === 1 ? 0.9 : 0.6}
            envMapIntensity={0.8}
          />
        </mesh>
      ))}
      {/* Grid wire lines X */}
      {[-0.4, -0.2, 0, 0.2, 0.4].map((x, i) => (
        <mesh key={`x${i}`} position={[x, 0.08, 0]}>
          <boxGeometry args={[0.01, 0.01, 0.85]} />
          <meshStandardMaterial color="#2dd4bf" opacity={0.5} transparent />
        </mesh>
      ))}
      {/* Grid wire lines Z */}
      {[-0.3, -0.1, 0.1, 0.3].map((z, i) => (
        <mesh key={`z${i}`} position={[0, 0.08, z]}>
          <boxGeometry args={[1.15, 0.01, 0.01]} />
          <meshStandardMaterial color="#2dd4bf" opacity={0.5} transparent />
        </mesh>
      ))}
    </group>
  );
};
