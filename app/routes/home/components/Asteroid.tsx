import { Center, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

function Asteroid() {
  const ref = useRef<Group>(null);
  const { scene } = useGLTF("/asteroid.glb");

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.002;
      ref.current.rotation.x += 0.001;
    }
  });

  return (
    <group ref={ref} scale={0.003}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

export default function AsteroidScene() {
  return (
    <div className="mx-auto w-96 h-96">
      <Canvas camera={{ position: [0, 0, 5], near: 0.01, far: 100 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 3, 3]} intensity={1} />

        <Asteroid />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/asteroid.glb");
