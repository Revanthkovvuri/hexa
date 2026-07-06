'use client';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { buildTrackCurve, COLORS } from './trackData';

export default function Checkpoint({
  checkpoint,
  progress,
  onHover,
  onLeave,
  onClick,
  isHovered,
  isMobile = false,
}) {
  const groupRef = useRef();
  const glowRef = useRef();
  const ringRef = useRef();
  const curve = useMemo(() => buildTrackCurve(), []);

  const position = useMemo(() => curve.getPointAt(checkpoint.t), [curve, checkpoint.t]);

  const isCompleted = checkpoint.status === 'completed';
  const isCurrent = checkpoint.status === 'current';
  const isLocked = checkpoint.status === 'locked';

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (groupRef.current) {
      let targetScale = 1;
      if (isCurrent) targetScale = Math.sin(time * 2.5) * 0.15 + 1.15;
      else if (isHovered) targetScale = 1.4;
      
      groupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.12
      );
    }

    if (glowRef.current) {
      if (isCurrent) {
        glowRef.current.material.opacity = Math.sin(time * 2) * 0.15 + 0.4;
        glowRef.current.scale.setScalar(Math.sin(time * 1.5) * 0.3 + 1.8);
      } else if (isHovered) {
        glowRef.current.material.opacity = 0.35;
        glowRef.current.scale.setScalar(1.5);
      } else {
        glowRef.current.material.opacity = isCompleted ? 0.15 : 0.03;
        glowRef.current.scale.setScalar(1.3);
      }
    }

    if (ringRef.current && isCurrent) {
      ringRef.current.rotation.z += 0.01;
    }
  });

  const mainColor = isLocked ? COLORS.locked : COLORS.gold;
  const emissiveColor = isLocked ? '#000000' : COLORS.gold;
  const emissiveIntensity = isLocked ? 0 : isCurrent ? 0.8 : 0.3;

  // Responsive sizes
  const nodeSize = isMobile ? 0.8 : 1;
  const labelDistance = isMobile ? 12 : 15;
  const postHeight = isMobile ? 0.8 : 1.2;
  const labelHeight = isMobile ? 1.8 : 2.5;

  return (
    <group position={[position.x, 0, position.z]} scale={[nodeSize, nodeSize, nodeSize]}>
      <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.3, 1.0, 64]} />
        <meshBasicMaterial
          color={mainColor}
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh position={[0, postHeight / 2, 0]}>
        <cylinderGeometry args={[0.025, 0.035, postHeight, 16]} />
        <meshStandardMaterial
          color="#2a2a2a"
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>

      <group ref={groupRef} position={[0, postHeight + 0.2, 0]}>
        <mesh
          ref={ringRef}
          onPointerOver={(e) => {
            e.stopPropagation();
            if (!isLocked) {
              onHover?.(checkpoint);
              document.body.style.cursor = 'pointer';
            }
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            onLeave?.();
            document.body.style.cursor = 'default';
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (!isLocked) onClick?.(checkpoint);
          }}
        >
          <torusGeometry args={[0.4, 0.06, 16, 64]} />
          <meshStandardMaterial
            color={mainColor}
            emissive={emissiveColor}
            emissiveIntensity={emissiveIntensity}
            metalness={0.3}
            roughness={0.3}
          />
        </mesh>

        <mesh>
          <sphereGeometry args={[0.28, 32, 32]} />
          <meshStandardMaterial
            color={isLocked ? COLORS.lockedDim : COLORS.gold}
            emissive={emissiveColor}
            emissiveIntensity={emissiveIntensity * 0.6}
            metalness={0.2}
            roughness={0.4}
            transparent
            opacity={isLocked ? 0.4 : 0.9}
          />
        </mesh>

        <mesh position={[0, 0, 0.3]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color={isLocked ? '#555' : '#FFFFFF'} />
        </mesh>

        {!isLocked && (
          <pointLight
            color={COLORS.gold}
            intensity={isCurrent ? 2.5 : 1}
            distance={6}
            decay={2}
          />
        )}
      </group>

      <Html
        position={[0, labelHeight, 0]}
        center
        distanceFactor={labelDistance}
        style={{ pointerEvents: 'none' }}
      >
        <div
          style={{
            background: 'rgba(10, 10, 20, 0.95)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: `1px solid ${isLocked ? 'rgba(80,80,80,0.3)' : 'rgba(255,198,0,0.3)'}`,
            borderRadius: isMobile ? '6px' : '10px',
            padding: isMobile ? '4px 8px' : '8px 16px',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            boxShadow: isCurrent
              ? '0 0 30px rgba(255,198,0,0.15)'
              : '0 4px 20px rgba(0,0,0,0.4)',
            maxWidth: isMobile ? '120px' : 'none',
          }}
        >
          <div
            style={{
              fontSize: isMobile ? '8px' : '10px',
              fontWeight: '700',
              letterSpacing: isMobile ? '1px' : '2px',
              color: isLocked ? '#555' : COLORS.gold,
              marginBottom: '2px',
            }}
          >
            PHASE {checkpoint.phase}
          </div>
          <div
            style={{
              fontSize: isMobile ? '10px' : '13px',
              fontWeight: '600',
              color: isLocked ? '#777' : '#FFFFFF',
            }}
          >
            {checkpoint.name}
          </div>
          <div
            style={{
              fontSize: isMobile ? '7px' : '9px',
              fontWeight: '500',
              color: isLocked ? '#444' : 'rgba(255,198,0,0.7)',
              marginTop: '3px',
            }}
          >
            {checkpoint.statusLabel}
          </div>
        </div>
      </Html>
    </group>
  );
}