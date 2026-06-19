import { Component, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** Mutable cursor position (normalised -0.5..0.5), shared from the Hero. */
export type PointerRef = { current: { x: number; y: number } };

const COUNT = 700;
const ACCENT = '#5bb8e8';

/** Soft round glow sprite so points render as orbs instead of hard squares. */
function createSprite(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.4, 'rgba(255,255,255,0.55)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

function createPoints(): THREE.Points {
  const positions = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    // Uniform direction on the unit sphere, random radius for depth variation.
    const r = 1.2 + Math.random() * 2.3;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    size: 0.06,
    map: createSprite(),
    color: new THREE.Color(ACCENT),
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    sizeAttenuation: true,
  });
  return new THREE.Points(geometry, material);
}

function Particles({ pointer }: { pointer: PointerRef }) {
  const group = useRef<THREE.Group>(null);
  const points = useMemo(createPoints, []);

  useEffect(() => {
    return () => {
      points.geometry.dispose();
      const mat = points.material as THREE.PointsMaterial;
      mat.map?.dispose();
      mat.dispose();
    };
  }, [points]);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05); // clamp big jumps after tab refocus
    points.rotation.y += d * 0.03; // gentle continuous drift
    const g = group.current;
    if (!g) return;
    // Ease the whole field toward the cursor for a parallax-depth feel.
    const targetX = pointer.current.y * 0.22;
    const targetY = pointer.current.x * 0.28;
    g.rotation.x += (targetX - g.rotation.x) * 0.04;
    g.rotation.y += (targetY - g.rotation.y) * 0.04;
  });

  return (
    <group ref={group}>
      <primitive object={points} />
    </group>
  );
}

/** Renders its children, or nothing if a (rare) WebGL error is thrown. */
class WebGLBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function HeroBackground3D({ pointer }: { pointer: PointerRef }) {
  return (
    <WebGLBoundary>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
        camera={{ position: [0, 0, 5], fov: 55 }}
        style={{ pointerEvents: 'none' }}
      >
        <Particles pointer={pointer} />
      </Canvas>
    </WebGLBoundary>
  );
}
