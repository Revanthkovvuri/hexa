'use client';
import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { buildTrackCurve, COLORS } from './trackData';

export default function ProgressLine({ progress }) {
  const curve = useMemo(() => buildTrackCurve(), []);

  // Calculate points based on progress - memoized to avoid constant changes
  const points = useMemo(() => {
    if (progress <= 0) return [];
    const pointCount = Math.max(2, Math.floor(progress * 300));
    return curve.getPoints(pointCount).map(p => [p.x, 0.06, p.z]);
  }, [curve, progress]);

  if (points.length < 2) return null;

  return (
    <group>
      {/* Main progress line */}
      <Line
        points={points}
        color={COLORS.gold}
        lineWidth={1}
        transparent
        opacity={0.9}
      />

      {/* Glow line */}
      <Line
        points={points.map(p => [p[0], 0.07, p[2]])}
        color={COLORS.gold}
        lineWidth={2}
        transparent
        opacity={0.3}
        depthWrite={false}
      />
    </group>
  );
}