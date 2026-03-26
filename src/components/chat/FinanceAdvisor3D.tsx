'use client';

import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface FinanceAdvisorModelProps {
    isThinking?: boolean;
    isSpeaking?: boolean;
}

function FinanceAdvisorModel({ isThinking = false, isSpeaking = false }: FinanceAdvisorModelProps) {
    const { scene } = useGLTF('/models/finance-advisor.glb', true);
    const meshRef = useRef<THREE.Group>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const speakingIntensity = useRef(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useFrame((state) => {
        if (!meshRef.current) return;

        const time = state.clock.elapsedTime;

        // Base Y position (for breathing/floating effect)
        let baseY = 0;

        // Breathing effect - subtle chest expansion feeling
        baseY += Math.sin(time * 0.8) * 0.015;

        // Speaking animation - nodding and engaging movement
        if (isSpeaking) {
            speakingIntensity.current = THREE.MathUtils.lerp(speakingIntensity.current, 1, 0.1);

            // Head nodding motion while speaking
            const nod = Math.sin(time * 4) * 0.03 * speakingIntensity.current;
            baseY += nod;

            // Subtle side-to-side sway while explaining
            const sway = Math.sin(time * 2.5) * 0.02 * speakingIntensity.current;
            meshRef.current.position.x = sway;

            // Slight lean forward when speaking (engaging)
            meshRef.current.rotation.x = THREE.MathUtils.lerp(
                meshRef.current.rotation.x,
                0.05,
                0.05
            );
        } else {
            speakingIntensity.current = THREE.MathUtils.lerp(speakingIntensity.current, 0, 0.05);
            meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, 0, 0.05);
        }

        // Thinking animation - contemplative movement
        if (isThinking) {
            // Looking up slightly when thinking
            const thinkY = 0.08 + Math.sin(time * 1.5) * 0.02;
            meshRef.current.rotation.x = THREE.MathUtils.lerp(
                meshRef.current.rotation.x,
                -thinkY,
                0.03
            );

            // Gentle sway while thinking
            baseY += Math.sin(time * 2) * 0.02;

            // Slight tilt to indicate contemplation
            meshRef.current.rotation.z = Math.sin(time * 0.8) * 0.03;
        } else if (!isSpeaking) {
            meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, 0.03);
            meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, 0, 0.03);
        }

        meshRef.current.position.y = baseY;

        // Mouse tracking - advisor looks at user (interactive feel)
        const targetRotationY = mouseRef.current.x * 0.2;
        meshRef.current.rotation.y = THREE.MathUtils.lerp(
            meshRef.current.rotation.y,
            targetRotationY,
            0.04
        );
    });

    // Smaller model - camera zoomed out to show full body including hands
    return <primitive ref={meshRef} object={scene} scale={1.2} position={[0, -0.3, 0]} />;
}

function LoadingFallback() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
        }
    });

    return (
        <mesh ref={meshRef}>
            <torusGeometry args={[0.4, 0.1, 16, 32]} />
            <meshBasicMaterial color="#B794F6" wireframe />
        </mesh>
    );
}

interface FinanceAdvisor3DProps {
    isThinking?: boolean;
    isSpeaking?: boolean;
}

export function FinanceAdvisor3D({ isThinking = false, isSpeaking = false }: FinanceAdvisor3DProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="relative w-full h-full min-h-[350px] finance-advisor-container">
            {/* Animated Glowing Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <div className={`finance-advisor-glow-arch ${isSpeaking ? 'speaking' : ''} ${isThinking ? 'thinking' : ''}`} />

                {/* Particle effects */}
                <div className="advisor-particles">
                    <div className="particle particle-1" />
                    <div className="particle particle-2" />
                    <div className="particle particle-3" />
                </div>
            </div>

            {/* 3D Canvas - Performance optimized, zoomed out */}
            <Canvas
                camera={{ position: [0, 1.0, 5.0], fov: 35 }}
                gl={{
                    alpha: true,
                    antialias: false, /* Disable for performance */
                    powerPreference: "high-performance"
                }}
                dpr={[1, 1.5]} /* Limit pixel ratio for performance */
                style={{ background: 'transparent' }}
            >
                <PerspectiveCamera makeDefault position={[0, 1.0, 5.0]} fov={35} />

                {/* Reduced Lighting for natural look */}
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 5, 5]} intensity={0.7} />
                <pointLight
                    position={[-3, 3, 3]}
                    intensity={isSpeaking ? 0.4 : 0.2}
                    color="#B794F6"
                />
                <pointLight
                    position={[3, -2, 3]}
                    intensity={isSpeaking ? 0.25 : 0.1}
                    color="#E17726"
                />

                {/* Rim light for subtle highlight */}
                <spotLight
                    position={[0, 5, -3]}
                    angle={0.5}
                    penumbra={1}
                    intensity={0.3}
                    color="#ffffff"
                />

                <Environment preset="studio" />

                <Suspense fallback={<LoadingFallback />}>
                    <FinanceAdvisorModel isThinking={isThinking} isSpeaking={isSpeaking} />
                </Suspense>
            </Canvas>

            {/* Speaking indicator wave */}
            {isSpeaking && (
                <div className="speaking-wave-container">
                    <div className="speaking-wave" />
                    <div className="speaking-wave delay-1" />
                    <div className="speaking-wave delay-2" />
                </div>
            )}
        </div>
    );
}

// Preload the model
if (typeof window !== 'undefined') {
    useGLTF.preload('/models/finance-advisor.glb');
}
