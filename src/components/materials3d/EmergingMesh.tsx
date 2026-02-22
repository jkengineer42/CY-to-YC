import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const nodes = [
  [0, 0.5, 0], [0.5, 0, 0.3], [-0.5, 0, 0.3], [0, 0, -0.5],
  [0.4, 0.5, -0.3], [-0.4, 0.5, -0.3], [0, -0.4, 0],
  [0.3, -0.2, 0.4], [-0.3, -0.2, 0.4],
] as const;

const edges: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],
  [1, 2], [1, 3], [1, 7], [2, 3], [2, 8],
  [3, 4], [3, 5], [4, 5],
  [6, 1], [6, 2], [6, 7], [6, 8], [7, 8],
];

export const EmergingMesh = ({ hovered }: { hovered: boolean }) => {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * (hovered ? 0.6 : 0.1);
      group.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <group ref={group} position={[0, 0.1, 0]}>
      {/* Lattice nodes */}
      {nodes.map((pos, i) => (
        <mesh key={i} position={pos as unknown as [number, number, number]} castShadow>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshPhysicalMaterial
            color="#a78bfa"
            metalness={0.3}
            roughness={0.2}
            emissive="#8b5cf6"
            emissiveIntensity={0.3}
            envMapIntensity={1}
          />
        </mesh>
      ))}
      {/* Lattice edges */}
      {edges.map(([a, b], i) => {
        const start = new THREE.Vector3(...nodes[a]);
        const end = new THREE.Vector3(...nodes[b]);
        const mid = start.clone().add(end).multiplyScalar(0.5);
        const dir = end.clone().sub(start);
        const len = dir.length();
        const orientation = new THREE.Matrix4().lookAt(start, end, new THREE.Vector3(0, 1, 0));
        const quat = new THREE.Quaternion().setFromRotationMatrix(orientation);

        return (
          <mesh key={`e${i}`} position={[mid.x, mid.y, mid.z]} quaternion={quat}>
            <cylinderGeometry args={[0.012, 0.012, len, 6]} />
            <meshStandardMaterial
              color="#7c3aed"
              metalness={0.4}
              roughness={0.3}
              transparent
              opacity={0.7}
            />
          </mesh>
        );
      })}
    </group>
  );
};
