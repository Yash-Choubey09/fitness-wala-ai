/**
 * src/components/landing/Hero3DBackground.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Data + Motion System — High-performance abstract AI fitness waveforms.
 * Telemetry lines flowing continuously left-to-right with subtle mouse parallax.
 * Optimized to remove heavy polygons and draw calls for 60fps smoothness.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { prefersReducedMotion } from '../../lib/gsap';

// ── Shared Mouse State for Parallax ───────────────────────────────────────────
const mouse = { x: 0, y: 0 };
if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });
}

// ── Waveforms Component ───────────────────────────────────────────────────────
const Waveforms = () => {
  const groupRef = useRef();
  const lineCount = 8;
  const pointsPerLine = 120;

  // Pre-allocate geometry arrays
  const linesData = useMemo(() => {
    return Array.from({ length: lineCount }).map((_, i) => {
      const positions = new Float32Array(pointsPerLine * 3);
      const isCyan = i % 2 === 0;
      const color = isCyan ? '#00E0FF' : (i % 3 === 0 ? '#39FF14' : '#8A2BE2');
      const opacity = 0.15 + Math.random() * 0.3;
      // Randomize speed, amplitude, and frequency for organic feel
      const speed = 0.5 + Math.random() * 0.8;
      const amplitude = 0.8 + Math.random() * 1.5;
      const freq = 0.2 + Math.random() * 0.3;
      const yOffset = (i - lineCount / 2) * 0.5;

      return { positions, color, opacity, speed, amplitude, freq, yOffset };
    });
  }, []);

  const lineRefs = useRef([]);

  useFrame((state, delta) => {
    if (prefersReducedMotion()) return;
    
    const time = state.clock.elapsedTime;

    // 1. Mouse Parallax (subtle rotation)
    if (groupRef.current) {
      // Lerp rotation for smoothness
      groupRef.current.rotation.y += (mouse.x * 0.15 - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (-mouse.y * 0.15 - groupRef.current.rotation.x) * 0.05;
    }

    // 2. Animate Waveform Vertices
    linesData.forEach((data, i) => {
      const lineMesh = lineRefs.current[i];
      if (!lineMesh) return;

      const positions = lineMesh.geometry.attributes.position.array;
      
      for (let j = 0; j < pointsPerLine; j++) {
        // x goes from -12 to 12
        const x = (j / (pointsPerLine - 1) - 0.5) * 24;
        
        // Complex sine wave for organic "telemetry" feel flowing left to right
        // Math.sin(x * freq - time * speed) makes it flow right
        const wave1 = Math.sin(x * data.freq - time * data.speed);
        const wave2 = Math.sin(x * data.freq * 2.5 - time * data.speed * 1.2) * 0.3;
        
        // Taper edges to 0 so lines fade in/out smoothly at screen bounds
        const edgeTaper = Math.max(0, 1 - Math.abs(x) / 10);
        
        const y = data.yOffset + (wave1 + wave2) * data.amplitude * edgeTaper;
        // Add subtle z depth wave
        const z = Math.cos(x * data.freq * 1.5 - time * data.speed * 0.8) * 2 * edgeTaper;

        const idx = j * 3;
        positions[idx] = x;
        positions[idx + 1] = y;
        positions[idx + 2] = z;
      }
      
      lineMesh.geometry.attributes.position.needsUpdate = true;
    });
  });

  return (
    <group ref={groupRef}>
      {linesData.map((data, i) => (
        <line key={i} ref={(el) => (lineRefs.current[i] = el)}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[data.positions, 3]}
              count={pointsPerLine}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={new THREE.Color(data.color)}
            transparent
            opacity={data.opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </line>
      ))}
    </group>
  );
};

// ── Floating Particles (Digital Noise) ────────────────────────────────────────
const DataParticles = () => {
  const pointsRef = useRef();
  const particleCount = 100;
  
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;  // z
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (prefersReducedMotion() || !pointsRef.current) return;
    const time = state.clock.elapsedTime;
    
    // Slow drift
    pointsRef.current.position.y = Math.sin(time * 0.2) * 0.5;
    pointsRef.current.rotation.y = time * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles, 3]}
          count={particleCount}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#00E0FF"
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// ── Exported Hero Background ──────────────────────────────────────────────────
export const Hero3DBackground = () => {
  return (
    <div className="w-full h-full" style={{ pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <Waveforms />
          <DataParticles />
        </Float>
      </Canvas>
    </div>
  );
};
