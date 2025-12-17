import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, useProgress } from '@react-three/drei';
import ModelViewer from './ModelViewer';
import { useGameStore } from '../store/gameStore';

function Loader() {
    const { progress } = useProgress();
    return <Html center>{progress.toFixed(0)}% loaded</Html>;
}

import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';

function CameraHandler({ modelPath }) {
    const { camera, controls } = useThree();
    useEffect(() => {
        if (controls) {
            controls.reset();
            // Optional: Force specific position if reset isn't enough
            // camera.position.set(0, 0, 4);
            // controls.update();
        }
    }, [modelPath, controls, camera]);
    return null;
}

const GameScene = ({ modelPath, scale = 1 }) => {
    const { gameState } = useGameStore();
    const [blurStyle, setBlurStyle] = React.useState(
        gameState === 'playing' ? { filter: 'blur(20px)' } : {}
    );

    React.useEffect(() => {
        if (gameState === 'playing') {
            // Start with blur
            setBlurStyle({ filter: 'blur(20px)', transition: 'none', opacity: 1 }); // Force opacity 1 just in case

            // Transition to clear
            const timer = setTimeout(() => {
                setBlurStyle({
                    filter: 'blur(0)',
                    transition: 'filter 5s ease-out'
                });
            }, 100);

            return () => clearTimeout(timer);
        } else {
            setBlurStyle({});
        }
    }, [modelPath, gameState]);

    return (
        <div className="w-full h-full" style={{ ...blurStyle }}>
            <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 50 }}>
                <CameraHandler modelPath={modelPath} />
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <ModelViewer modelPath={modelPath} scale={scale} />
                <OrbitControls makeDefault enableZoom={false} />
            </Canvas>
        </div>
    );
};
export default GameScene;
