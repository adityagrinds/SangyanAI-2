import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { mockIncidents, mockArcs } from '../data/mockIncidents';

// ── Convert lat/lng to 3D position ──
function latLngToVector3(lat, lng, radius = 1.02) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// ── Incident Point ──
function IncidentPoint({ lat, lng, severity, location, type, delay = 0 }) {
  const meshRef = useRef();
  const ringRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const pos = useMemo(() => latLngToVector3(lat, lng), [lat, lng]);

  const color = severity === 'high' ? '#FF4D2E' : severity === 'medium' ? '#FFB020' : '#3ECF8E';

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const scale = hovered ? 1.8 : 1 + Math.sin(t * 2 + delay * 0.01) * 0.15;
    meshRef.current.scale.setScalar(visible ? scale : 0);
    if (ringRef.current) {
      const ringScale = 1 + ((t * 0.8 + delay * 0.005) % 2);
      ringRef.current.scale.setScalar(visible ? ringScale : 0);
      ringRef.current.material.opacity = Math.max(0, 1 - ((t * 0.8 + delay * 0.005) % 2) / 2);
    }
  });

  return (
    <group position={pos}>
      {/* Core point */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.015, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.95} />
      </mesh>
      {/* Radar ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.015, 0.02, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      {/* Glow */}
      <pointLight color={color} intensity={hovered ? 1 : 0.3} distance={0.3} />
      {/* Tooltip */}
      {hovered && (
        <sprite position={[0, 0.06, 0]} scale={[0.35, 0.08, 1]}>
          <spriteMaterial
            map={createTextTexture(`${location} — ${type.toUpperCase()}`)}
            transparent
          />
        </sprite>
      )}
    </group>
  );
}

// ── Text texture for tooltips ──
function createTextTexture(text) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(16,18,22,0.9)';
  ctx.roundRect(0, 0, 512, 64, 12);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 2;
  ctx.roundRect(0, 0, 512, 64, 12);
  ctx.stroke();
  ctx.font = '500 24px Inter, sans-serif';
  ctx.fillStyle = '#ECEDEF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 256, 32);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// ── Arc ──
function Arc({ from, to, color = '#FF4D2E' }) {
  const ref = useRef();
  const curve = useMemo(() => {
    const start = latLngToVector3(from.lat, from.lng);
    const end = latLngToVector3(to.lat, to.lng);
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const dist = start.distanceTo(end);
    mid.normalize().multiplyScalar(1.02 + dist * 0.35);
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [from, to]);

  const points = useMemo(() => curve.getPoints(60), [curve]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const drawRange = 20 + Math.abs(Math.sin(t * 0.5)) * 40;
    const start = Math.floor((t * 15) % 60);
    ref.current.geometry.setDrawRange(start, drawRange);
  });

  return (
    <line ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={0.35} linewidth={1} />
    </line>
  );
}

// ── Globe Wireframe ──
function GlobeWireframe() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={ref}>
      {/* Main globe sphere */}
      <Sphere args={[1, 64, 64]}>
        <meshStandardMaterial
          color="#0d0f14"
          roughness={0.8}
          metalness={0.2}
          transparent
          opacity={0.9}
        />
      </Sphere>
      {/* Wireframe overlay */}
      <Sphere args={[1.005, 48, 48]}>
        <meshBasicMaterial
          color="#1a1d25"
          wireframe
          transparent
          opacity={0.25}
        />
      </Sphere>
      {/* Latitude rings */}
      {[-60, -30, 0, 30, 60].map((lat) => {
        const phi = (90 - lat) * (Math.PI / 180);
        const r = Math.sin(phi);
        const y = Math.cos(phi);
        return (
          <mesh key={lat} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[r - 0.001, r + 0.001, 128]} />
            <meshBasicMaterial color="#252830" transparent opacity={0.4} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
      {/* Atmosphere glow */}
      <Sphere args={[1.08, 32, 32]}>
        <meshBasicMaterial
          color="#FF4D2E"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
}

// ── Main Globe Scene ──
function GlobeScene({ mouseX = 0, mouseY = 0 }) {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += (mouseX * 0.3 - groupRef.current.rotation.y) * 0.03;
      groupRef.current.rotation.x += (mouseY * 0.15 - groupRef.current.rotation.x) * 0.03;
    }
  });

  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 3, 5]} intensity={0.4} color="#ECEDEF" />
      <pointLight position={[-3, -2, 4]} intensity={0.2} color="#FF4D2E" />

      <Stars radius={80} depth={50} count={2000} factor={3} saturation={0} fade speed={0.5} />

      <group ref={groupRef}>
        <GlobeWireframe />

        {/* Incident points */}
        {mockIncidents.map((inc, i) => (
          <IncidentPoint
            key={inc.id}
            lat={inc.lat}
            lng={inc.lng}
            severity={inc.severity}
            location={inc.location}
            type={inc.type}
            delay={800 + i * 80}
          />
        ))}

        {/* Arcs */}
        {mockArcs.map(([fromIdx, toIdx], i) => (
          <Arc
            key={i}
            from={mockIncidents[fromIdx]}
            to={mockIncidents[toIdx]}
          />
        ))}
      </group>
    </>
  );
}

// ── Exported Globe3D Component ──
export default function Globe3D({ scrollProgress = 0 }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const scale = Math.max(0.3, 1 - scrollProgress * 2);
  const opacity = Math.max(0, 1 - scrollProgress * 2.5);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: loaded ? opacity : 0,
        transform: `scale(${loaded ? scale : 0.6})`,
        transition: loaded ? 'opacity 0.3s ease' : 'opacity 1.2s cubic-bezier(0.22, 1, 0.36, 1), transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 2.8], fov: 45 }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        <GlobeScene mouseX={mousePos.x} mouseY={mousePos.y} />
      </Canvas>
    </div>
  );
}
