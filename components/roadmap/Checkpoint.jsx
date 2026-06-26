'use client';
import { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import { buildTrackCurve, COLORS } from './trackData';

/**
 * Checkpoint — a single milestone node positioned ON the track curve.
 * States: completed (cyan filled), current (pulsing), locked (dimmed)
 */
export default function Checkpoint({
  checkpoint,
  progress,
  onHover,
  onLeave,
  onClick,
  isHovered,
}) {
  const meshRef = useRef();
  const glowRef = useRef();
  const curve = useMemo(() => buildTrackCurve(), []);

  // Position on the curve
  const position = useMemo(() => {
    return curve.getPointAt(checkpoint.t);
  }, [curve, checkpoint.t]);

  // Dynamic state based on progress
  const isCompleted = progress > checkpoint.t + 0.01;
  const isCurrent = Math.abs(progress - checkpoint.t) <= 0.01;
  const isLocked = progress < checkpoint.t - 0.01;

  // Animate pulsing for current checkpoint
  useFrame((state) => {
    if (meshRef.current) {
      if (isCurrent) {
        const pulse = Math.sin(state.clock.elapsedTime * 2.5) * 0.15 + 1.0;
        meshRef.current.scale.setScalar(pulse);
      } else if (isHovered) {
        meshRef.current.scale.setScalar(
          THREE.MathUtils.lerp(meshRef.current.scale.x, 1.3, 0.1)
        );
      } else {
        meshRef.current.scale.setScalar(
          THREE.MathUtils.lerp(meshRef.current.scale.x, 1.0, 0.1)
        );
      }
    }

    if (glowRef.current) {
      if (isCurrent) {
        const glowPulse = Math.sin(state.clock.elapsedTime * 2.5) * 0.3 + 0.5;
        glowRef.current.material.opacity = glowPulse;
        glowRef.current.scale.setScalar(
          Math.sin(state.clock.elapsedTime * 2.5) * 0.5 + 2.0
        );
      } else if (isHovered && !isLocked) {
        glowRef.current.material.opacity = 0.4;
        glowRef.current.scale.setScalar(2.0);
      } else {
        glowRef.current.material.opacity = isCompleted ? 0.15 : 0;
        glowRef.current.scale.setScalar(1.5);
      }
    }
  });

  const nodeColor = isLocked ? COLORS.locked : COLORS.cyan;
  const nodeOpacity = isLocked ? 0.4 : 1.0;

  return (
    <group position={[position.x, 0.3, position.z]}>
      {/* Glow ring */}
      <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 0.9, 32]} />
        <meshBasicMaterial
          color={COLORS.cyan}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Main node */}
      <group ref={meshRef}>
        {/* Outer ring */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover?.(checkpoint);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            onLeave?.();
            document.body.style.cursor = 'default';
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClick?.(checkpoint);
          }}
        >
          <ringGeometry args={[0.25, 0.4, 32]} />
          <meshStandardMaterial
            color={nodeColor}
            emissive={isLocked ? '#000000' : COLORS.cyan}
            emissiveIntensity={isLocked ? 0 : 0.5}
            transparent
            opacity={nodeOpacity}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Inner fill (for completed/current) */}
        {!isLocked && (
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.25, 32]} />
            <meshStandardMaterial
              color={COLORS.cyan}
              emissive={COLORS.cyan}
              emissiveIntensity={isCurrent ? 0.8 : 0.3}
              transparent
              opacity={isCompleted || isCurrent ? 0.9 : 0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}

        {/* Inner dot for locked */}
        {isLocked && (
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.15, 32]} />
            <meshStandardMaterial
              color={COLORS.locked}
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
      </group>

      {/* Connector Line */}
      <Line
        points={[
          [0, 0.4, 0],
          [0, 4.5, 0],
        ]}
        color="#ffffff"
        lineWidth={1.5}
        transparent
        opacity={0.7}
      />

      {/* Label */}
      <Html
        position={[0, 4.5, 0]}
        center
        distanceFactor={30}
        transform
        sprite
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <div
          className="roadmap-checkpoint-label"
          style={{
            opacity: isLocked ? 0.4 : 1,
            color: isLocked ? '#666' : COLORS.cyan,
          }}
        >
          <span className="roadmap-phase-tag">PHASE {checkpoint.phase}</span>
          <span className="roadmap-phase-name">{checkpoint.name}</span>
        </div>
      </Html>
    </group>
  );
}
