'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function WalletModel({ mouse }: { mouse: { x: number; y: number } }) {
    const meshRef = useRef<THREE.Mesh>(null);

    // Animate the wallet based on mouse position
    useFrame(() => {
        if (meshRef.current) {
            // Smooth rotation based on mouse position
            meshRef.current.rotation.y = THREE.MathUtils.lerp(
                meshRef.current.rotation.y,
                mouse.x * 0.3,
                0.1
            );
            meshRef.current.rotation.x = THREE.MathUtils.lerp(
                meshRef.current.rotation.x,
                -mouse.y * 0.2,
                0.1
            );
        }
    });

    return (
        <group ref={meshRef}>
            {/* Main wallet body - Orange */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
                <boxGeometry args={[3, 2, 0.3]} />
                <meshStandardMaterial
                    color="#E17726"
                    metalness={0.2}
                    roughness={0.5}
                    emissive="#E17726"
                    emissiveIntensity={0.1}
                />
            </mesh>

            {/* Wallet flap - Purple */}
            <mesh position={[0, 0.5, 0.2]} rotation={[-0.2, 0, 0]} castShadow receiveShadow>
                <boxGeometry args={[3, 1, 0.1]} />
                <meshStandardMaterial
                    color="#3C154E"
                    metalness={0.3}
                    roughness={0.4}
                    emissive="#3C154E"
                    emissiveIntensity={0.1}
                />
            </mesh>

            {/* Accent detail - Green */}
            <mesh position={[0, -0.3, 0.16]} castShadow receiveShadow>
                <boxGeometry args={[2.5, 0.3, 0.05]} />
                <meshStandardMaterial
                    color="#00E676"
                    metalness={0.5}
                    roughness={0.3}
                    emissive="#00E676"
                    emissiveIntensity={0.2}
                />
            </mesh>
        </group>
    );
}

export function Animated3DWallet() {
    const mousePosition = useRef({ x: 0, y: 0 });

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, clientY } = event;
        const { innerWidth, innerHeight } = window;

        // Normalize mouse position to -1 to 1
        mousePosition.current = {
            x: (clientX / innerWidth) * 2 - 1,
            y: (clientY / innerHeight) * 2 - 1,
        };
    };

    return (
        <div
            className="w-full h-full relative"
            onMouseMove={handleMouseMove}
        >
            <Canvas
                shadows
                className="cursor-pointer"
                gl={{ antialias: true, alpha: true }}
            >
                <PerspectiveCamera makeDefault position={[0, 0, 8]} />

                {/* Enhanced Lighting for better color visibility */}
                <ambientLight intensity={0.8} />
                <directionalLight
                    position={[5, 5, 5]}
                    intensity={1.2}
                    castShadow
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                />
                <pointLight position={[-5, 2, 5]} intensity={0.8} color="#B794F6" />
                <pointLight position={[5, -2, 5]} intensity={0.8} color="#00E676" />
                <pointLight position={[0, 0, 8]} intensity={0.5} color="#FFFFFF" />

                <WalletModel mouse={mousePosition.current} />

            </Canvas>
        </div>
    );
}
