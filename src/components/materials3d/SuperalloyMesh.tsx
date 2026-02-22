import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Superalloy — glowing turbine blade shape */
export const SuperalloyMesh = ({ hovered }: { hovered: boolean }) => {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * (hovered ? 0.6 : 0);
    }
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* Turbine blade body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.08, 0.25, 1.0, 6]} />
        <meshPhysicalMaterial
          color="#b91c1c"
          metalness={0.9}
          roughness={0.15}
          envMapIntensity={2}
        />
      </mesh>
      {/* Heat glow ring */}
      <mesh position={[0, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.28, 0.03, 8, 32]} />
        <meshPhysicalMaterial
          color="#f97316"
          metalness={0.7}
          roughness={0.2}
          emissive="#f97316"
          emissiveIntensity={0.4}
        />
      </mesh>
      {/* Top cap */}
      <mesh position={[0, 0.52, 0]} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshPhysicalMaterial
          color="#dc2626"
          metalness={0.95}
          roughness={0.1}
          envMapIntensity={2}
        />
      </mesh>
      {/* Cooling channels */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, -0.15 + i * 0.2, 0]} rotation={[Math.PI / 2, 0, i * 0.7]}>
          <torusGeometry args={[0.2, 0.012, 6, 24]} />
          <meshStandardMaterial color="#991b1b" metalness={0.8} roughness={0.2} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
};
