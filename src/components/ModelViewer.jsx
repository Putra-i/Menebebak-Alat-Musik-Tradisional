import React, { useRef } from 'react';
import { useGLTF, Stage, Float, Center } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

function Model({ path, scale = 1 }) {
    const { scene } = useGLTF(path);
    const ref = useRef();

    useFrame((state) => {
        // Gentle floating animation
        const t = state.clock.getElapsedTime();
        ref.current.rotation.y = Math.sin(t / 4) / 4;
        ref.current.position.y = (1 + Math.sin(t / 1.5)) / 10;
    });

    return (
        <group ref={ref} dispose={null}>
            <primitive object={scene} scale={scale} />
        </group>
    );
}

export default function ModelViewer({ modelPath, scale }) {
    return (
        <Stage environment="studio" intensity={0.6} adjustCamera={true}>
            <Center>
                <Model path={modelPath} scale={scale} />
            </Center>
        </Stage>
    );
}
