"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Float, Html, PresentationControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function CarModel({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/CarConcept.glb");
  const clonedScene = scene.clone();

  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [clonedScene]);

  useFrame((state) => {
    if (!group.current || reducedMotion) {
      return;
    }

    const targetY = state.pointer.x * 0.35 + state.clock.elapsedTime * 0.18;
    const targetX = state.pointer.y * 0.12;

    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      targetY,
      0.045,
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      targetX,
      0.04,
    );
  });

  return (
    <Float
      speed={reducedMotion ? 0 : 1.15}
      rotationIntensity={reducedMotion ? 0 : 0.22}
      floatIntensity={reducedMotion ? 0 : 0.42}
    >
      <Center>
        <group ref={group} scale={1.85} position={[0, -0.55, 0]}>
          <primitive object={clonedScene} />
        </group>
      </Center>
    </Float>
  );
}

function Scene({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0.8, 7.2], fov: 26 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      shadows
    >
      <color attach="background" args={["#f3f4ef"]} />
      <fog attach="fog" args={["#f3f4ef", 7, 13]} />
      <ambientLight intensity={1.9} />
      <directionalLight
        castShadow
        intensity={3.2}
        position={[6, 8, 5]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight intensity={1.2} position={[-4, 3, -6]} color="#c6d5ff" />
      <spotLight intensity={12} angle={0.32} penumbra={0.5} position={[0, 6, 4]} color="#ffffff" />

      <Suspense
        fallback={
          <Html center>
            <div className="showcase-loading">Loading model...</div>
          </Html>
        }
      >
        <PresentationControls
          enabled={!reducedMotion}
          global
          cursor
          speed={1.1}
          zoom={0.8}
          polar={[-0.18, 0.2]}
          azimuth={[-0.65, 0.65]}
        >
          <CarModel reducedMotion={reducedMotion} />
        </PresentationControls>
      </Suspense>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.55, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <shadowMaterial transparent opacity={0.18} />
      </mesh>
    </Canvas>
  );
}

export function CarShowcase() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);

    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  return (
    <section className="showcase" aria-label="3D car model showcase">
      <div className="showcase-header">
        <p className="showcase-label">3D model</p>
        <p className="showcase-copy">
          Drag to inspect it. The rest of the page stays plain on purpose.
        </p>
      </div>
      <div className="showcase-stage">
        <Scene reducedMotion={reducedMotion} />
      </div>
    </section>
  );
}

useGLTF.preload("/models/CarConcept.glb");
