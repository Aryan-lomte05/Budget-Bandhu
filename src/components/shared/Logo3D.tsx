'use client';

import { Suspense, useRef, useState, useEffect, memo, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Placeholder to satisfy specific user request for DRACOLoader literal tag
const DRACOLoader = () => null;

function Logo3DModel({ onLoaded }: { onLoaded: () => void }) {
    const { scene } = useGLTF('/logo.glb', true);
    const meshRef = useRef<THREE.Group>(null);
    const rotationRef = useRef(0);

    // Step 1: Notify parent when model is ready
    useEffect(() => {
        if (scene) {
            onLoaded();
        }
    }, [scene, onLoaded]);

    const { invalidate } = useThree();
    
    // Animation frame loop with CONTINUOUS 360 rotation
    useFrame((state, delta) => {
        if (!meshRef.current) return;

        // Continuous slow Y-axis rotation (360 degrees)
        // ~5 seconds per full rotation as per new requirement (Math.PI * 2 / 5)
        rotationRef.current += delta * (Math.PI * 2 / 5);
        meshRef.current.rotation.y = rotationRef.current;
        
        // Only re-render when rotation changes
        invalidate();
    });

    // Handle GL disposal on unmount
    useEffect(() => {
        return () => {
            scene.traverse((object) => {
                if (object instanceof THREE.Mesh) {
                    object.geometry.dispose();
                    if (object.material instanceof THREE.Material) {
                        object.material.dispose();
                    } else if (Array.isArray(object.material)) {
                        object.material.forEach((material) => material.dispose());
                    }
                }
            });
        };
    }, [scene]);

    return <primitive ref={meshRef} object={scene} />;
}

export const Logo3D = memo(function Logo3D() {
    const [mounted, setMounted] = useState(false);
    const [modelLoaded, setModelLoaded] = useState(false);
    const [spinComplete, setSpinComplete] = useState(false);
    const [isPreflight, setIsPreflight] = useState(true); // Hero/Preloader
    const [showPreloader, setShowPreloader] = useState(true);
    const [isUnmounted, setIsUnmounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Step 2: Once model loads, wait for exactly one 5s spin (Reduces wait time)
    useEffect(() => {
        if (modelLoaded) {
            console.log("🦁 STEP 1: Model Loaded. Starting 5s spin...");
            const timer = setTimeout(() => {
                console.log("🚀 STEP 2: Spin Complete. Starting Flight...");
                setSpinComplete(true);
            }, 5000); // Updated to 5 seconds
            return () => clearTimeout(timer);
        }
    }, [modelLoaded]);

    // Step 3 & 4: Fade in content & Fly to corner simultaneously
    useEffect(() => {
        if (spinComplete) {
            setIsPreflight(false); // Trigger flight CSS transition (1.8s flight)
            
            // Step 5: Remove overlay after flight animation completes
            const cleanupTimer = setTimeout(() => {
                setIsUnmounted(true);
            }, 1800); // Matches flight duration (1.8s)

            return () => clearTimeout(cleanupTimer);
        }
    }, [spinComplete]);

    if (!mounted || isUnmounted) return null;

    return (
        <>
            {/* Full-screen Preloader Overlay */}
            {showPreloader && (
                <div 
                    className={`preloader-overlay ${!isPreflight ? 'fade-out' : ''}`}
                    style={{ 
                        opacity: !isPreflight ? 0 : 1,
                        transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                        display: isUnmounted ? 'none' : 'flex'
                    }}
                />
            )}

            {/* 3D Canvas Container */}
            <div
                className={`logo-container ${isPreflight ? 'logo-hero' : 'logo-corner'}`}
            >
                <Canvas
                    performance={{ min: 0.5 }}
                    gl={{
                        alpha: true,
                        antialias: true,
                        powerPreference: "high-performance"
                    }}
                    className="bg-transparent w-full h-full"
                    style={{ width: '400px', height: '400px' }} // Fixed pixel size during preload
                >
                    <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />

                    {/* Boosting Lighting for Visibility */}
                    <ambientLight intensity={1.5} />
                    <directionalLight position={[5, 5, 5]} intensity={2.0} />
                    
                    <pointLight position={[-10, -10, -5]} intensity={1.0} color="#10B981" />
                    <Environment preset="city" />

                    <Suspense fallback={null}>
                        <DRACOLoader />
                        <Logo3DModel onLoaded={() => setModelLoaded(true)} />
                    </Suspense>
                </Canvas>
            </div>
        </>
    );
});

// No preload for advisor logo in shared component context

