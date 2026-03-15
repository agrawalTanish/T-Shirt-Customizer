import React, { useState, useEffect } from 'react';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
import { Decal, useGLTF, useTexture } from '@react-three/drei';
import state from '../store';

const Shirt = ({ url }) => {
  const snap = useSnapshot(state);
  const { nodes, materials, isLoading, error } = useGLTF(url, true);

  const logoTexture = useTexture(snap.logoDecal);
  const fullTexture = useTexture(snap.fullDecal);

  useFrame((state, delta) => {
    if (materials?.lambert1) {
      easing.dampC(materials.lambert1.color, snap.color, 0.25, delta);
    }
  });

  const stateString = JSON.stringify(snap);

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  if (error || !nodes || !materials) {
    console.error('Failed to load GLB file:', error);
    return <div>Error loading model</div>; 
  }

  return (
    <group key={stateString}>
      <mesh
        castShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        material-roughness={1}
        dispose={null}
      >
        {snap.isFullTexture && (
          <Decal
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={1}
            map={fullTexture}
          />
        )}
        {snap.isLogoTexture && (
          <Decal
            position={[0, 0.04, 0.15]}
            rotation={[0, 0, 0]}
            scale={0.15}
            map={logoTexture}
            anisotropy={16}
            depthTest={false}
            depthWrite={true}
          />
        )}
      </mesh>
    </group>
  );
};

export default Shirt;
