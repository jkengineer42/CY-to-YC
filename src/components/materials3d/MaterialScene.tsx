import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { Suspense } from "react";
import { MetalMesh } from "./MetalMesh";
import { PolymerMesh } from "./PolymerMesh";
import { CeramicMesh } from "./CeramicMesh";
import { BiosourceMesh } from "./BiosourceMesh";
import { CompositeMesh } from "./CompositeMesh";
import { WoodMesh } from "./WoodMesh";
import { SuperalloyMesh } from "./SuperalloyMesh";
import { NaturalMesh } from "./NaturalMesh";
import { LightAlloyMesh } from "./LightAlloyMesh";
import { EmergingMesh } from "./EmergingMesh";

export type SceneCategory =
  | "Metal" | "Polymere" | "Ceramique" | "Biosource" | "Composite"
  | "Wood" | "Superalloy" | "Natural" | "LightAlloy" | "Emerging";

/** Maps any demo category string to a SceneCategory for 3D rendering */
export const categoryTo3D: Record<string, SceneCategory> = {
  // Medicine
  "Metal": "Metal",
  "Polymer": "Polymere",
  "Ceramic": "Ceramique",
  "Biosourced": "Biosource",
  "Composite": "Composite",
  // Architecture
  "Wood": "Wood",
  "Bio-based": "Biosource",
  "Mineral": "Natural",
  "Natural": "Natural",
  // Mechanics
  "Superalloy": "Superalloy",
  "Light Alloy": "LightAlloy",
  "Steel": "Metal",
  "Bio-composite": "Biosource",
  // Aerospace
  "Titanium": "Metal",
  // French legacy
  "Métal": "Metal",
  "Polymère": "Polymere",
  "Céramique": "Ceramique",
  "Biosourcé": "Biosource",
  "Superalliage": "Superalloy",
  "Alliage Léger": "LightAlloy",
  "Bois": "Wood",
  "Naturel": "Natural",
};

interface MaterialSceneProps {
  category: SceneCategory | string;
  hovered: boolean;
}

const MeshByCategory = ({ category, hovered }: { category: SceneCategory; hovered: boolean }) => {
  switch (category) {
    case "Metal": return <MetalMesh hovered={hovered} />;
    case "Polymere": return <PolymerMesh hovered={hovered} />;
    case "Ceramique": return <CeramicMesh hovered={hovered} />;
    case "Biosource": return <BiosourceMesh hovered={hovered} />;
    case "Composite": return <CompositeMesh hovered={hovered} />;
    case "Wood": return <WoodMesh hovered={hovered} />;
    case "Superalloy": return <SuperalloyMesh hovered={hovered} />;
    case "Natural": return <NaturalMesh hovered={hovered} />;
    case "LightAlloy": return <LightAlloyMesh hovered={hovered} />;
    case "Emerging": return <EmergingMesh hovered={hovered} />;
    default: return <EmergingMesh hovered={hovered} />;
  }
};

const MaterialScene = ({ category, hovered }: MaterialSceneProps) => {
  const resolved: SceneCategory = categoryTo3D[category] || (category as SceneCategory) || "Emerging";

  return (
    <Canvas
      camera={{ position: [0, 1.5, 3.5], fov: 35 }}
      style={{ background: "transparent" }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <directionalLight position={[-3, 3, -3]} intensity={0.3} color="#b0c4ff" />
      <Suspense fallback={null}>
        <MeshByCategory category={resolved} hovered={hovered} />
        <ContactShadows
          position={[0, -0.8, 0]}
          opacity={0.3}
          scale={4}
          blur={2}
          far={2}
        />
        <Environment preset="studio" />
      </Suspense>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={hovered ? 4 : 1.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 4}
      />
    </Canvas>
  );
};

export default MaterialScene;
