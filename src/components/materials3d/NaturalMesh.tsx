import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Natural / mineral — rammed earth or stone block */
export const NaturalMesh = ({ hovered }: { hovered: boolean }) => {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * (hovered ? 0.4 : 0);
    }
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* Stacked earth layers */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[0, -0.35 + i * 0.2, 0]} castShadow>
          <boxGeometry args={[0.8 - i * 0.05, 0.16, 0.6 - i * 0.03]} />
          <meshStandardMaterial
            color={["#c2956a", "#b8845a", "#a67449", "#d4a574", "#c9956b"][i]}
            roughness={0.95}
            metalness={0.0}
          />
        </mesh>
      ))}
      {/* Small stone accent */}
      <mesh position={[0.25, 0.55, 0.15]} castShadow>
        <dodecahedronGeometry args={[0.12, 0]} />
        <meshStandardMaterial color="#9a7b5a" roughness={0.9} />
      </mesh>
      <mesh position={[-0.2, 0.5, -0.1]} castShadow>
        <dodecahedronGeometry args={[0.08, 0]} />
        <meshStandardMaterial color="#b09070" roughness={0.85} />
      </mesh>
    </group>
  );
};
