'use client';
import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Track from './Track';
import ProgressLine from './ProgressLine';
import Checkpoint from './Checkpoint';
import CarIndicator from './CarIndicator';
import StartFinishFlag from './StartFinishFlag';
import { CHECKPOINTS } from './trackData';

function FitCameraToTrack({ isMobile = false, padding = 1.35, elevation = 0.65, debug = true }) {
  const { camera, scene, invalidate } = useThree();

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const trackRoot = scene.getObjectByName('trackRoot');
      if (!trackRoot) {
        if (debug) console.warn('[FitCameraToTrack] trackRoot not found in scene');
        return;
      }

      const box = new THREE.Box3().setFromObject(trackRoot);
      if (box.isEmpty()) {
        if (debug) console.warn('[FitCameraToTrack] trackRoot bounding box is empty');
        return;
      }

      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.z, size.y || 1);

      const fovRad = camera.fov * (Math.PI / 180);
      const finalPadding = isMobile ? 1.1 : padding;
      const distance = (maxDim / 2 / Math.tan(fovRad / 2)) * finalPadding;

      if (debug) {
        console.log('[FitCameraToTrack]', {
          boxMin: box.min.toArray(),
          boxMax: box.max.toArray(),
          size: size.toArray(),
          center: center.toArray(),
          maxDim,
          computedDistance: distance,
        });
      }

      const safeDistance = THREE.MathUtils.clamp(distance, 2, 150);

      camera.position.set(center.x, safeDistance * elevation, center.z + safeDistance);
      camera.lookAt(center);
      camera.near = Math.max(0.1, safeDistance / 100);
      camera.far = safeDistance * 10;
      camera.updateProjectionMatrix();

      invalidate();
    });

    return () => cancelAnimationFrame(raf);
  }, [scene, camera, padding, elevation, invalidate, debug, isMobile]);

  return null;
}

export default function TrackCanvas({
  progress = 0,
  hoveredCheckpoint = null,
  onHoverCheckpoint = () => {},
  onLeaveCheckpoint = () => {},
  onClickCheckpoint = () => {},
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <Canvas
      camera={{
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
      resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
      style={{
        width: '100%',
        height: '100%',
        background: 'transparent',
      }}
    >
      <FitCameraToTrack isMobile={isMobile} />

      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 20, 5]} intensity={0.5} />
      <pointLight position={[0, 10, 0]} intensity={0.3} color="#5CE1E6" />

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2.1}
        minDistance={5}
        maxDistance={200}
        makeDefault
      />

      <group name="trackRoot">
        <Suspense fallback={null}>
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
              onClick={onClickCheckpoint}
            />
          ))}

          <StartFinishFlag />
          <CarIndicator progress={progress} />
        </Suspense>
      </group>
    </Canvas>
  );
}