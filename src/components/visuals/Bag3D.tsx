"use client";

import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, ContactShadows, OrbitControls, Environment, Lightformer } from "@react-three/drei";
import { makeKnitTextures } from "@/lib/knitTexture";
import type { Product } from "@/lib/types";

type Props = {
  silhouette: Product["silhouette"];
  weave: Product["weave"];
  colorHex: string;
  shadeHex: string;
  className?: string;
  /** el usuario puede arrastrar para rotar */
  interactive?: boolean;
};

function handleCurve(silhouette: Product["silhouette"]) {
  switch (silhouette) {
    case "clutch":
      return null;
    case "bucket":
      return [
        new THREE.Vector3(-0.55, 0.5, 0),
        new THREE.Vector3(0, 1.0, 0),
        new THREE.Vector3(0.55, 0.5, 0),
      ];
    case "backpack":
      return [
        new THREE.Vector3(-0.4, 0.7, -0.25),
        new THREE.Vector3(-0.5, 1.15, 0.1),
        new THREE.Vector3(-0.18, 0.75, 0.38),
      ];
    default:
      return [
        new THREE.Vector3(-0.5, 0.55, 0),
        new THREE.Vector3(0, 1.35, 0),
        new THREE.Vector3(0.5, 0.55, 0),
      ];
  }
}

function BagMesh({ silhouette, weave, colorHex, shadeHex }: Omit<Props, "className" | "interactive">) {
  const group = useRef<THREE.Group>(null);

  const tex = useMemo(
    () => makeKnitTextures(weave, colorHex, shadeHex),
    [weave, colorHex, shadeHex],
  );
  useEffect(() => () => tex.dispose(), [tex]);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: tex.map,
        normalMap: tex.normalMap,
        roughnessMap: tex.roughnessMap,
        color: new THREE.Color(colorHex),
        roughness: 0.95,
        metalness: 0,
        normalScale: new THREE.Vector2(0.6, 0.6),
      }),
    [tex, colorHex],
  );
  useEffect(() => () => material.dispose(), [material]);

  const leather = useMemo(
    () => new THREE.MeshStandardMaterial({ color: new THREE.Color(shadeHex), roughness: 0.6, metalness: 0.05 }),
    [shadeHex],
  );
  useEffect(() => () => leather.dispose(), [leather]);

  const curve = useMemo(() => {
    const pts = handleCurve(silhouette);
    return pts ? new THREE.CatmullRomCurve3(pts) : null;
  }, [silhouette]);

  const body = useMemo(() => {
    const box = (
      w: number,
      h: number,
      d: number,
      radius: number,
    ): {
      shape: "box";
      size: [number, number, number];
      radius: number;
      w: number;
      h: number;
      d: number;
    } => ({ shape: "box", size: [w, h, d], radius, w, h, d });

    switch (silhouette) {
      case "bucket":
        return {
          shape: "cyl" as const,
          args: [0.62, 0.52, 1.15, 40, 1] as [number, number, number, number, number],
          w: 1.24,
          h: 1.15,
          d: 1.24,
        };
      case "clutch":
        return box(1.5, 0.62, 0.28, 0.12);
      case "backpack":
        return box(1.0, 1.25, 0.5, 0.22);
      case "market":
        return box(1.5, 1.2, 0.6, 0.14);
      default:
        return box(1.2, 1.25, 0.45, 0.16);
    }
  }, [silhouette]);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.position.y = Math.sin(t * 0.9) * 0.03;
    group.current.rotation.z = Math.sin(t * 0.6) * 0.015;
  });

  return (
    <group ref={group} rotation={[0, -0.5, 0]}>
      {body.shape === "box" ? (
        <RoundedBox args={body.size} radius={body.radius} smoothness={5} material={material} castShadow receiveShadow />
      ) : (
        <mesh material={material} castShadow receiveShadow>
          <cylinderGeometry args={body.args} />
        </mesh>
      )}

      {curve && (
        <mesh material={leather} castShadow>
          <tubeGeometry args={[curve, 40, 0.045, 10, false]} />
        </mesh>
      )}
      {silhouette === "backpack" && curve && (
        <mesh material={leather} castShadow scale={[-1, 1, 1]}>
          <tubeGeometry args={[curve, 40, 0.045, 10, false]} />
        </mesh>
      )}

      {/* base rígida */}
      <mesh position={[0, -body.h / 2 - 0.02, 0]} material={leather} receiveShadow>
        <boxGeometry args={[body.w * 0.9, 0.04, body.d * 0.9]} />
      </mesh>
    </group>
  );
}

export function Bag3D({ silhouette, weave, colorHex, shadeHex, className, interactive = true }: Props) {
  useEffect(() => {
    // R3F mide el contenedor con ResizeObserver; forzamos un recálculo tras montar.
    const id = requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className={className} style={{ position: "relative" }}>
      <Canvas
        dpr={[1, 2]}
        shadows
        resize={{ offsetSize: true }}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        camera={{ position: [1.6, 1.1, 2.6], fov: 38 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 5, 2]} intensity={2.1} castShadow shadow-mapSize={[1024, 1024]}>
          <orthographicCamera attach="shadow-camera" args={[-3, 3, 3, -3, 0.1, 20]} />
        </directionalLight>
        <directionalLight position={[-3, 2, -2]} intensity={0.7} color="#f0d8b8" />

        <Environment resolution={128}>
          <Lightformer intensity={1.4} position={[0, 3, 2]} scale={[6, 3, 1]} color="#ffffff" />
          <Lightformer intensity={0.8} position={[-4, 1, -3]} scale={[4, 4, 1]} color="#e8d4b8" />
        </Environment>

        <group position={[0, -0.35, 0]}>
          <BagMesh silhouette={silhouette} weave={weave} colorHex={colorHex} shadeHex={shadeHex} />
          <ContactShadows position={[0, -0.72, 0]} opacity={0.5} scale={5} blur={2.6} far={3} color="#2a1f16" />
        </group>

        {interactive && (
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.9}
            autoRotate
            autoRotateSpeed={0.6}
          />
        )}
      </Canvas>
    </div>
  );
}

export default Bag3D;
