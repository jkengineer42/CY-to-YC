import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Light alloy — aerospace/engineering styled panel */
export const LightAlloyMesh = ({ hovered }: { hovered: boolean }) => {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * (hovered ? 0.5 : 0);
    }
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* Main panel */}
      <mesh castShadow>
        <boxGeometry args={[0.9, 0.08, 0.7]} />
        <meshPhysicalMaterial
          color="#a8c8e8"
          metalness={0.85}
          roughness={0.12}
          envMapIntensity={1.8}
        />
      </mesh>
      {/* Ribbed stiffeners */}
      {[-0.25, 0, 0.25].map((x, i) => (
        <mesh key={i} position={[x, 0.1, 0]} castShadow>
          <boxGeometry args={[0.04, 0.15, 0.65]} />
          <meshPhysicalMaterial
            color="#93b5d5"
            metalness={0.9}
            roughness={0.1}
            envMapIntensity={1.5}
          />
        </mesh>
      ))}
      {/* Rivets */}
      {[-0.35, -0.15, 0.05, 0.25].map((x, i) => (
        <mesh key={`r${i}`} position={[x, 0.045, 0.3]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.02, 12]} />
          <meshStandardMaterial color="#7a9fc0" metalness={0.9} roughness={0.15} />
        </mesh>
      ))}
    </group>
  );
};
