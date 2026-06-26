'use client';
import { useRef, useCallback } from 'react';
import { Canvas} from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Track from './Track';
import ProgressLine from './ProgressLine';
import Checkpoint from './Checkpoint';
import CarIndicator from './CarIndicator';
import StartFinishFlag from './StartFinishFlag';
import { CHECKPOINTS } from './trackData';


/**
 * TrackCanvas — the R3F Canvas containing all 3D track elements.
 */
export default function TrackCanvas({
  progress,
  hoveredCheckpoint,
  onHoverCheckpoint,
  onLeaveCheckpoint,
  onClickCheckpoint,
}) {
  return (
    <Canvas
      camera={{
        position: [0, 30, 30],
        fov: 50,
        near: 0.1,
        far: 200,
      }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      style={{
        width: '100%',
        height: '100%',
        background: 'transparent',
      }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 20, 5]} intensity={0.5} />
      <pointLight position={[0, 10, 0]} intensity={0.3} color="#5CE1E6" />



      {/* Controls — Orbit for 360 interaction */}
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={true}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2.1}
        makeDefault
      />

      {/* Track base */}
      <Track />

      {/* Animated progress line */}
      <ProgressLine progress={progress} />

      {/* Checkpoints */}
      {CHECKPOINTS.map((cp) => (
        <Checkpoint
          key={cp.id}
          checkpoint={cp}
          progress={progress}
          isHovered={hoveredCheckpoint?.id === cp.id}
          onHover={onHoverCheckpoint}
          onLeave={onLeaveCheckpoint}
          onClick={onClickCheckpoint}
        />
      ))}

      {/* Start/Finish checkered flag */}
      <StartFinishFlag />

      {/* Car indicator */}
      <CarIndicator progress={progress} />
    </Canvas>
  );
}
