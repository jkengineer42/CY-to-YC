import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const BiomaterialMesh = ({ hovered }: { hovered: boolean }) => {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * (hovered ? 0.4 : 0);
    }
  });

  // Create a wave-like tube path
  const curve = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 40; i++) {
      const t = (i / 40) * Math.PI * 2;
      points.push(new THREE.Vector3(
        Math.cos(t) * 0.5,
        Math.sin(t * 2) * 0.15,
        Math.sin(t) * 0.5
      ));
    }
    return new THREE.CatmullRomCurve3(points, true);
  }, []);

  const curve2 = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 40; i++) {
      const t = (i / 40) * Math.PI * 2;
      points.push(new THREE.Vector3(
        Math.cos(t + 1) * 0.35,
        Math.sin(t * 3) * 0.1 + 0.2,
        Math.sin(t + 1) * 0.35
      ));
    }
    return new THREE.CatmullRomCurve3(points, true);
  }, []);

  return (
    <group ref={group}>
      {/* Main membrane wave */}
      <mesh castShadow>
        <tubeGeometry args={[curve, 64, 0.06, 12, true]} />
        <meshPhysicalMaterial
          color="#86efac"
          metalness={0.0}
          roughness={0.4}
          transmission={0.2}
          thickness={0.3}
          envMapIntensity={0.6}
        />
      </mesh>
      {/* Secondary thread */}
      <mesh castShadow>
        <tubeGeometry args={[curve2, 64, 0.035, 8, true]} />
        <meshPhysicalMaterial
          color="#4ade80"
          metalness={0.0}
          roughness={0.35}
          transparent
          opacity={0.7}
          envMapIntensity={0.5}
        />
      </mesh>
      {/* Membrane surface */}
      <mesh position={[0, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <circleGeometry args={[0.45, 32]} />
        <meshPhysicalMaterial
          color="#dcfce7"
          metalness={0.0}
          roughness={0.5}
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
