'use client';
import { useRef, useCallback, useState, useEffect, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Track from './Track';
import ProgressLine from './ProgressLine';
import Checkpoint from './Checkpoint';
import CarIndicator from './CarIndicator';
import StartFinishFlag from './StartFinishFlag';
import { CHECKPOINTS, buildTrackCurve } from './trackData';

// Camera controller with smooth transitions
function CameraController({ activeCheckpoint, isAutoRotating, isMobile }) {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3(0, 30, 30));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const curve = useMemo(() => buildTrackCurve(), []);

  useFrame(() => {
    camera.position.lerp(targetPosition.current, 0.05);
    
    if (!isAutoRotating) {
      const lookAtTarget = targetLookAt.current;
      camera.lookAt(lookAtTarget.x, lookAtTarget.y, lookAtTarget.z);
    }
  });

  useEffect(() => {
    if (activeCheckpoint) {
      const pos = curve.getPointAt(activeCheckpoint.t);
      const camDistance = isMobile ? 15 : 20;
      targetPosition.current.set(pos.x + 8, 12, pos.z + camDistance);
      targetLookAt.current.set(pos.x, 0, pos.z);
    } else {
      targetPosition.current.set(0, isMobile ? 25 : 30, isMobile ? 25 : 30);
      targetLookAt.current.set(0, 0, 0);
    }
  }, [activeCheckpoint, curve, isMobile]);

  return null;
}

// Ambient particles for atmosphere
function AmbientParticles({ isMobile }) {
  const particlesRef = useRef();
  const particleCount = isMobile ? 40 : 80;
  
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    const spread = isMobile ? 40 : 60;
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = Math.random() * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
      speeds[i] = 0.002 + Math.random() * 0.01;
    }
    
    return { positions, speeds };
  }, [particleCount, isMobile]);

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += particles.speeds[i];
        positions[i * 3] += Math.sin(state.clock.elapsedTime + i) * 0.003;
        positions[i * 3 + 2] += Math.cos(state.clock.elapsedTime + i) * 0.003;
        
        if (positions[i * 3 + 1] > 15) {
          positions[i * 3 + 1] = -2;
          positions[i * 3] = (Math.random() - 0.5) * (isMobile ? 40 : 60);
          positions[i * 3 + 2] = (Math.random() - 0.5) * (isMobile ? 40 : 60);
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isMobile ? 0.06 : 0.08}
        color="#FFD700"
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation={true}
      />
    </points>
  );
}

export default function TrackCanvas({
  progress,
  hoveredCheckpoint,
  onHoverCheckpoint,
  onLeaveCheckpoint,
  onClickCheckpoint,
}) {
  const [activeCheckpoint, setActiveCheckpoint] = useState(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const controlsRef = useRef();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCheckpointClick = useCallback((checkpoint) => {
    if (checkpoint.status === 'locked') return;
    
    setActiveCheckpoint(checkpoint);
    setIsAutoRotating(false);
    onClickCheckpoint?.(checkpoint);
    
    const timer = setTimeout(() => {
      setIsAutoRotating(true);
      setActiveCheckpoint(null);
    }, 8000);
    
    return () => clearTimeout(timer);
  }, [onClickCheckpoint]);

  const handleDoubleClick = useCallback(() => {
    setActiveCheckpoint(null);
    setIsAutoRotating(true);
  }, []);

  return (
    <div 
      style={{ position: 'relative', width: '100%', height: '100%' }}
      onDoubleClick={handleDoubleClick}
    >
      <Canvas
        camera={{
          position: [0, isMobile ? 25 : 35, isMobile ? 25 : 40],
          fov: isMobile ? 55 : 50,
          near: 0.1,
          far: 200,
        }}
        dpr={[1, isMobile ? 1.2 : 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: isMobile ? 'default' : 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent',
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[20, 30, 10]}
          intensity={0.6}
        />
        <pointLight
          position={[0, 15, 0]}
          intensity={0.5}
          color="#FFD700"
          distance={50}
        />
        <pointLight
          position={[-15, 5, -15]}
          intensity={0.3}
          color="#FFC600"
          distance={40}
        />
        <pointLight
          position={[15, 5, 15]}
          intensity={0.3}
          color="#FFC600"
          distance={40}
        />

        {activeCheckpoint && (
          <spotLight
            position={[0, 15, 0]}
            angle={0.4}
            penumbra={0.6}
            intensity={2.5}
            color="#FFC600"
            distance={35}
          />
        )}

        <CameraController
          activeCheckpoint={activeCheckpoint}
          isAutoRotating={isAutoRotating}
          isMobile={isMobile}
        />

        <OrbitControls
          ref={controlsRef}
          enablePan={!isMobile}
          enableZoom={true}
          enableRotate={true}
          autoRotate={isAutoRotating}
          autoRotateSpeed={0.4}
          minPolarAngle={0.3}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={isMobile ? 15 : 20}
          maxDistance={isMobile ? 50 : 70}
          zoomSpeed={isMobile ? 0.8 : 1.0}
          rotateSpeed={isMobile ? 0.5 : 0.7}
          makeDefault
        />

        <AmbientParticles isMobile={isMobile} />

        <Track />

        <ProgressLine progress={progress} />

        {CHECKPOINTS.map((cp) => (
          <Checkpoint
            key={cp.id}
            checkpoint={cp}
            progress={progress}
            isHovered={hoveredCheckpoint?.id === cp.id}
            onHover={onHoverCheckpoint}
            onLeave={onLeaveCheckpoint}
            onClick={handleCheckpointClick}
            isMobile={isMobile}
          />
        ))}

        <StartFinishFlag />

        <CarIndicator progress={progress} isMobile={isMobile} />
      </Canvas>
    </div>
  );
}