import { useState, useEffect, useRef, useMemo, Suspense, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Search, X, Radio, Brain, Rocket, MapPin, Thermometer, Wind, Droplets, CloudRain, ArrowLeft, Loader2 } from 'lucide-react';

// ══════════════════════════════════════
//  CLIMATE DATA (mock for searched locations)
// ══════════════════════════════════════
const climateDB = {
  'tokyo': { lat: 35.68, lng: 139.69, temp: '28°C', humidity: '72%', wind: '14 km/h', condition: 'Partly Cloudy', pressure: '1012 hPa', seismic: 'Active — M3.2 detected 2h ago', risk: 'high', alerts: ['Earthquake Advisory', 'Typhoon Watch'] },
  'new delhi': { lat: 28.61, lng: 77.21, temp: '38°C', humidity: '65%', wind: '8 km/h', condition: 'Haze', pressure: '1006 hPa', seismic: 'Stable', risk: 'medium', alerts: ['Heat Wave Warning', 'Flood Risk'] },
  'delhi': { lat: 28.61, lng: 77.21, temp: '38°C', humidity: '65%', wind: '8 km/h', condition: 'Haze', pressure: '1006 hPa', seismic: 'Stable', risk: 'medium', alerts: ['Heat Wave Warning', 'Flood Risk'] },
  'new york': { lat: 40.71, lng: -74.01, temp: '24°C', humidity: '58%', wind: '18 km/h', condition: 'Clear', pressure: '1018 hPa', seismic: 'Inactive', risk: 'low', alerts: [] },
  'london': { lat: 51.51, lng: -0.13, temp: '16°C', humidity: '80%', wind: '22 km/h', condition: 'Overcast', pressure: '1010 hPa', seismic: 'Inactive', risk: 'low', alerts: ['Flood Advisory'] },
  'mumbai': { lat: 19.08, lng: 72.88, temp: '32°C', humidity: '85%', wind: '20 km/h', condition: 'Monsoon Rain', pressure: '1004 hPa', seismic: 'Stable', risk: 'high', alerts: ['Heavy Rainfall Warning', 'Urban Flood Risk'] },
  'san francisco': { lat: 37.77, lng: -122.42, temp: '18°C', humidity: '70%', wind: '25 km/h', condition: 'Foggy', pressure: '1015 hPa', seismic: 'Active — M2.1 micro-tremor', risk: 'medium', alerts: ['Seismic Advisory'] },
  'istanbul': { lat: 41.01, lng: 28.98, temp: '26°C', humidity: '55%', wind: '12 km/h', condition: 'Sunny', pressure: '1016 hPa', seismic: 'Active — fault zone', risk: 'high', alerts: ['Earthquake Preparedness'] },
  'manila': { lat: 14.60, lng: 120.98, temp: '33°C', humidity: '78%', wind: '30 km/h', condition: 'Thunderstorm', pressure: '1002 hPa', seismic: 'Moderate', risk: 'high', alerts: ['Typhoon Warning', 'Storm Surge'] },
  'sydney': { lat: -33.87, lng: 151.21, temp: '14°C', humidity: '60%', wind: '15 km/h', condition: 'Clear', pressure: '1022 hPa', seismic: 'Inactive', risk: 'low', alerts: [] },
  'mexico city': { lat: 19.43, lng: -99.13, temp: '22°C', humidity: '50%', wind: '10 km/h', condition: 'Partly Cloudy', pressure: '1014 hPa', seismic: 'Active — M4.1 yesterday', risk: 'high', alerts: ['Seismic Alert'] },
  'dubai': { lat: 25.20, lng: 55.27, temp: '44°C', humidity: '30%', wind: '16 km/h', condition: 'Clear', pressure: '1008 hPa', seismic: 'Inactive', risk: 'low', alerts: ['Extreme Heat'] },
  'nairobi': { lat: -1.29, lng: 36.82, temp: '20°C', humidity: '68%', wind: '11 km/h', condition: 'Scattered Showers', pressure: '1013 hPa', seismic: 'Stable', risk: 'low', alerts: [] },
  'dhaka': { lat: 23.81, lng: 90.41, temp: '34°C', humidity: '88%', wind: '12 km/h', condition: 'Heavy Rain', pressure: '1000 hPa', seismic: 'Stable', risk: 'high', alerts: ['Flash Flood Warning'] },
  'buenos aires': { lat: -34.60, lng: -58.38, temp: '12°C', humidity: '75%', wind: '20 km/h', condition: 'Cloudy', pressure: '1016 hPa', seismic: 'Minor activity', risk: 'low', alerts: [] },
  'cairo': { lat: 30.04, lng: 31.24, temp: '36°C', humidity: '25%', wind: '14 km/h', condition: 'Clear', pressure: '1012 hPa', seismic: 'Inactive', risk: 'low', alerts: [] },
  'houston': { lat: 29.76, lng: -95.37, temp: '35°C', humidity: '82%', wind: '28 km/h', condition: 'Stormy', pressure: '998 hPa', seismic: 'Inactive', risk: 'high', alerts: ['Hurricane Watch'] },
  'rio de janeiro': { lat: -22.91, lng: -43.17, temp: '25°C', humidity: '70%', wind: '10 km/h', condition: 'Sunny', pressure: '1018 hPa', seismic: 'Stable', risk: 'low', alerts: [] },
  'moscow': { lat: 55.76, lng: 37.62, temp: '8°C', humidity: '65%', wind: '18 km/h', condition: 'Overcast', pressure: '1010 hPa', seismic: 'Inactive', risk: 'low', alerts: [] },
  'bangkok': { lat: 13.76, lng: 100.50, temp: '35°C', humidity: '80%', wind: '8 km/h', condition: 'Thunderstorm', pressure: '1003 hPa', seismic: 'Stable', risk: 'high', alerts: ['Urban Flooding'] },
  'singapore': { lat: 1.35, lng: 103.82, temp: '31°C', humidity: '84%', wind: '10 km/h', condition: 'Rain', pressure: '1010 hPa', seismic: 'Inactive', risk: 'low', alerts: [] },
  'paris': { lat: 48.86, lng: 2.35, temp: '20°C', humidity: '55%', wind: '14 km/h', condition: 'Clear', pressure: '1020 hPa', seismic: 'Inactive', risk: 'low', alerts: [] },
  'los angeles': { lat: 34.05, lng: -118.24, temp: '28°C', humidity: '35%', wind: '12 km/h', condition: 'Sunny', pressure: '1016 hPa', seismic: 'Active — SA fault zone', risk: 'medium', alerts: ['Wildfire Risk'] },
  'beijing': { lat: 39.90, lng: 116.40, temp: '30°C', humidity: '60%', wind: '10 km/h', condition: 'Haze', pressure: '1011 hPa', seismic: 'Stable', risk: 'low', alerts: [] },
  'jakarta': { lat: -6.21, lng: 106.84, temp: '32°C', humidity: '82%', wind: '8 km/h', condition: 'Cloudy', pressure: '1008 hPa', seismic: 'Active zone', risk: 'high', alerts: ['Flood Warning', 'Seismic Advisory'] },
  'kathmandu': { lat: 27.72, lng: 85.32, temp: '22°C', humidity: '78%', wind: '6 km/h', condition: 'Partly Cloudy', pressure: '1009 hPa', seismic: 'Active — Himalayan fault', risk: 'high', alerts: ['Earthquake Risk'] },
  'lisbon': { lat: 38.72, lng: -9.14, temp: '24°C', humidity: '50%', wind: '18 km/h', condition: 'Sunny', pressure: '1018 hPa', seismic: 'Low activity', risk: 'medium', alerts: ['Wildfire Season'] },
  'reykjavik': { lat: 64.15, lng: -21.94, temp: '6°C', humidity: '75%', wind: '30 km/h', condition: 'Windy', pressure: '1005 hPa', seismic: 'Active — volcanic zone', risk: 'high', alerts: ['Volcanic Activity'] },
};

// ══════════════════════════════════════
//  3D Globe for Explore View
// ══════════════════════════════════════
function latLngToVector3(lat, lng, radius = 1.02) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function SearchedPoint({ lat, lng }) {
  const pos = useMemo(() => latLngToVector3(lat, lng), [lat, lng]);
  const ref = useRef();
  const ringRef = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      const s = 1 + Math.sin(clock.getElapsedTime() * 3) * 0.2;
      ref.current.scale.setScalar(s);
    }
    if (ringRef.current) {
      const t = clock.getElapsedTime();
      const rs = 1 + (t % 2);
      ringRef.current.scale.setScalar(rs);
      ringRef.current.material.opacity = Math.max(0, 1 - (t % 2) / 2);
    }
  });
  return (
    <group position={pos}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color="#FF4D2E" />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.03, 0.04, 32]} />
        <meshBasicMaterial color="#FF4D2E" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <pointLight color="#FF4D2E" intensity={1.5} distance={0.5} />
    </group>
  );
}

function ExploreGlobeScene({ targetLat, targetLng, hasTarget }) {
  const groupRef = useRef();
  const targetRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (hasTarget) {
      const phi = (90 - targetLat) * (Math.PI / 180);
      const theta = (targetLng + 180) * (Math.PI / 180);
      targetRotation.current = { x: -(phi - Math.PI / 2) * 0.5, y: -theta + Math.PI };
    }
  }, [hasTarget, targetLat, targetLng]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    if (hasTarget) {
      groupRef.current.rotation.y += (targetRotation.current.y - groupRef.current.rotation.y) * 0.02;
      groupRef.current.rotation.x += (targetRotation.current.x - groupRef.current.rotation.x) * 0.02;
    } else {
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 3, 5]} intensity={0.5} color="#ECEDEF" />
      <pointLight position={[-3, -2, 4]} intensity={0.2} color="#FF4D2E" />
      <Stars radius={80} depth={50} count={1500} factor={3} saturation={0} fade speed={0.3} />
      <group ref={groupRef}>
        {/* Globe */}
        <Sphere args={[1, 64, 64]}>
          <meshStandardMaterial color="#0d0f14" roughness={0.8} metalness={0.2} transparent opacity={0.9} />
        </Sphere>
        <Sphere args={[1.005, 48, 48]}>
          <meshBasicMaterial color="#1a1d25" wireframe transparent opacity={0.25} />
        </Sphere>
        {/* Lat rings */}
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
        {/* Atmosphere */}
        <Sphere args={[1.08, 32, 32]}>
          <meshBasicMaterial color="#FF4D2E" transparent opacity={0.03} side={THREE.BackSide} />
        </Sphere>
        {/* Searched location marker */}
        {hasTarget && <SearchedPoint lat={targetLat} lng={targetLng} />}
      </group>
    </>
  );
}

// ══════════════════════════════════════
//  AI Agent Panel (animated)
// ══════════════════════════════════════
function AgentPanel({ agent, isActive, delay }) {
  const [lines, setLines] = useState([]);
  const [typing, setTyping] = useState(false);
  const lineIdx = useRef(0);
  const charIdx = useRef(0);

  useEffect(() => {
    if (!isActive) { setLines([]); lineIdx.current = 0; charIdx.current = 0; return; }
    setTyping(true);
    const interval = setInterval(() => {
      if (lineIdx.current >= agent.log.length) {
        setTyping(false);
        clearInterval(interval);
        return;
      }
      const currentLine = agent.log[lineIdx.current];
      charIdx.current++;
      if (charIdx.current >= currentLine.length) {
        setLines(prev => {
          const copy = [...prev];
          copy[lineIdx.current] = currentLine;
          return copy;
        });
        lineIdx.current++;
        charIdx.current = 0;
      } else {
        setLines(prev => {
          const copy = [...prev];
          copy[lineIdx.current] = currentLine.substring(0, charIdx.current);
          return copy;
        });
      }
    }, 20);
    return () => clearInterval(interval);
  }, [isActive, agent.log]);

  const Icon = agent.icon;

  return (
    <div style={{
      background: 'rgba(16,18,22,0.75)',
      backdropFilter: 'blur(20px)',
      border: `1px solid ${isActive ? agent.color + '40' : 'rgba(255,255,255,0.05)'}`,
      borderRadius: '14px',
      padding: '1.25rem',
      transition: 'all 0.5s ease',
      opacity: isActive ? 1 : 0.35,
      boxShadow: isActive ? `0 0 30px ${agent.color}10` : 'none',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: `${agent.color}12`, border: `1px solid ${agent.color}25`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={16} color={agent.color} />
        </div>
        <div style={{ flex: 1 }}>
          <div className="font-display font-bold" style={{ fontSize: '0.875rem' }}>{agent.title}</div>
          <div className="font-mono" style={{ fontSize: '0.5625rem', color: 'var(--color-text-dim)' }}>{agent.subtitle}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{
            width: '5px', height: '5px', borderRadius: '50%',
            background: isActive ? agent.color : 'var(--color-text-dim)',
            boxShadow: isActive ? `0 0 8px ${agent.color}` : 'none',
            animation: isActive ? 'glow-pulse 1.5s ease-in-out infinite' : 'none',
          }} />
          <span className="font-mono" style={{
            fontSize: '0.5625rem', color: isActive ? agent.color : 'var(--color-text-dim)',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            {isActive ? 'Processing' : 'Idle'}
          </span>
        </div>
      </div>
      {/* Log */}
      <div style={{
        background: 'rgba(0,0,0,0.35)', borderRadius: '8px', padding: '0.75rem',
        fontFamily: 'var(--font-mono)', fontSize: '0.625rem', lineHeight: 1.8,
        color: 'var(--color-text-muted)', minHeight: '100px',
        border: '1px solid rgba(255,255,255,0.02)',
      }}>
        {lines.map((line, i) => (
          <div key={i}><span style={{ color: agent.color, marginRight: '5px' }}>&rsaquo;</span>{line}</div>
        ))}
        {typing && (
          <span style={{
            display: 'inline-block', width: '6px', height: '12px',
            background: agent.color, animation: 'blink-caret 0.7s step-end infinite',
          }} />
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════
//  MAIN EXPLORE VIEW
// ══════════════════════════════════════
export default function ExploreView({ onBack }) {
  const [query, setQuery] = useState('');
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [climateData, setClimateData] = useState(null);
  const [agentsActive, setAgentsActive] = useState([false, false, false]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 500);
  }, []);

  const agents = useMemo(() => [
    { title: 'Monitor', subtitle: 'Scanning data sources', icon: Radio, color: '#FF4D2E', log: [] },
    { title: 'Analyzer', subtitle: 'Threat assessment', icon: Brain, color: '#7B8CFF', log: [] },
    { title: 'Responder', subtitle: 'Action planning', icon: Rocket, color: '#3ECF8E', log: [] },
  ], []);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) return;

    const data = climateDB[q];
    if (!data) {
      // Generate generic data for unknown locations
      setClimateData({
        lat: Math.random() * 140 - 70,
        lng: Math.random() * 360 - 180,
        temp: `${Math.floor(Math.random() * 35 + 5)}°C`,
        humidity: `${Math.floor(Math.random() * 60 + 30)}%`,
        wind: `${Math.floor(Math.random() * 30 + 5)} km/h`,
        condition: 'Data Limited',
        pressure: `${Math.floor(Math.random() * 30 + 1000)} hPa`,
        seismic: 'No data',
        risk: 'low',
        alerts: [],
      });
      setSearchedLocation({ name: query.trim(), lat: 0, lng: 0 });
    } else {
      setClimateData(data);
      setSearchedLocation({ name: query.trim(), lat: data.lat, lng: data.lng });
    }

    // Simulate agents activating sequentially
    setLoading(true);
    setAgentsActive([false, false, false]);

    // Dynamically build agent logs based on location
    const locationName = query.trim();
    const d = data || climateDB[q];

    agents[0].log = [
      `Initializing scan for "${locationName}"...`,
      'Connecting to USGS Seismic Network...',
      'Querying Open-Meteo Weather API...',
      'Pulling NASA FIRMS satellite data...',
      `4 sources responding — latency 18ms`,
      `Location verified: ${d ? d.lat + '°, ' + d.lng + '°' : 'coordinates pending'}`,
      'Data aggregation complete — forwarding to Analyzer',
    ];
    agents[1].log = [
      'Receiving raw data from Monitor...',
      `Temperature: ${d?.temp || 'N/A'} | Humidity: ${d?.humidity || 'N/A'}`,
      `Wind speed: ${d?.wind || 'N/A'} | Pressure: ${d?.pressure || 'N/A'}`,
      `Seismic status: ${d?.seismic || 'Unknown'}`,
      'Cross-referencing historical disaster patterns...',
      `Threat level assessment: ${(d?.risk || 'low').toUpperCase()}`,
      d?.alerts?.length ? `Active alerts: ${d.alerts.join(', ')}` : 'No active alerts detected',
      'Analysis complete — escalating to Responder',
    ];
    agents[2].log = [
      'Receiving analysis from Analyzer...',
      `Generating response plan for ${locationName}...`,
      d?.risk === 'high' ? 'HIGH RISK — activating emergency protocols' : 'Standard monitoring protocols active',
      ...(d?.alerts?.length ? d.alerts.map(a => `Alert issued: ${a}`) : ['No immediate action required']),
      'Notifying regional monitoring stations...',
      'Response plan generated successfully',
      `${locationName} — monitoring active`,
    ];

    setTimeout(() => {
      setAgentsActive([true, false, false]);
      setLoading(false);
    }, 600);
    setTimeout(() => setAgentsActive([true, true, false]), 2500);
    setTimeout(() => setAgentsActive([true, true, true]), 4500);
  }, [query, agents]);

  const riskColor = climateData?.risk === 'high' ? '#FF4D2E' : climateData?.risk === 'medium' ? '#FFB020' : '#3ECF8E';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'var(--color-bg-base)',
      display: 'flex',
      animation: 'fadeSlideIn 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
    }}>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* LEFT SIDE — Globe */}
      <div style={{ flex: '1 1 55%', position: 'relative' }}>
        <Canvas
          camera={{ position: [0, 0, 2.6], fov: 45 }}
          dpr={[1, 1.5]}
          style={{ background: 'transparent' }}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <ExploreGlobeScene
              targetLat={searchedLocation?.lat || 0}
              targetLng={searchedLocation?.lng || 0}
              hasTarget={!!searchedLocation}
            />
          </Suspense>
        </Canvas>

        {/* Glow behind globe */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px', height: '500px', borderRadius: '50%',
          background: searchedLocation
            ? `radial-gradient(circle, ${riskColor}12 0%, transparent 70%)`
            : 'radial-gradient(circle, rgba(255,77,46,0.05) 0%, transparent 70%)',
          pointerEvents: 'none', transition: 'background 1s ease',
        }} />

        {/* Back button */}
        <button
          onClick={onBack}
          className="interactive"
          style={{
            position: 'absolute', top: '1.5rem', left: '1.5rem',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.625rem 1.25rem', borderRadius: '10px',
            background: 'rgba(16,18,22,0.7)', backdropFilter: 'blur(12px)',
            border: '1px solid var(--color-border)', color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-display)', fontSize: '0.8125rem', fontWeight: 600,
            cursor: 'none', transition: 'border-color 0.3s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-accent-hero)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
        >
          <ArrowLeft size={14} /> Back
        </button>

        {/* Location label on globe */}
        {searchedLocation && (
          <div style={{
            position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1.25rem', borderRadius: '20px',
            background: 'rgba(16,18,22,0.8)', backdropFilter: 'blur(12px)',
            border: '1px solid var(--color-border)',
          }}>
            <MapPin size={12} color="var(--color-accent-hero)" />
            <span className="font-display font-semibold" style={{ fontSize: '0.8125rem' }}>
              {searchedLocation.name}
            </span>
            <span className="font-mono" style={{ fontSize: '0.5625rem', color: 'var(--color-text-dim)' }}>
              {searchedLocation.lat.toFixed(2)}°, {searchedLocation.lng.toFixed(2)}°
            </span>
          </div>
        )}
      </div>

      {/* RIGHT SIDE — Search + Climate + Agents */}
      <div style={{
        flex: '0 0 420px', padding: '1.5rem', overflowY: 'auto',
        borderLeft: '1px solid var(--color-border)',
        display: 'flex', flexDirection: 'column', gap: '1rem',
      }}>
        {/* Search bar */}
        <form onSubmit={handleSearch}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem 1rem', borderRadius: '12px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--color-border)',
            transition: 'border-color 0.3s ease',
          }}>
            <Search size={16} color="var(--color-text-dim)" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a city (e.g. Tokyo, Mumbai, Houston...)"
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)',
                fontSize: '0.875rem', cursor: 'none',
              }}
            />
            {query && (
              <button type="button" onClick={() => setQuery('')}
                style={{ background: 'none', border: 'none', cursor: 'none', padding: '2px' }}
                className="interactive">
                <X size={14} color="var(--color-text-dim)" />
              </button>
            )}
          </div>
        </form>

        {/* Climate data card */}
        {climateData && searchedLocation && (
          <div style={{
            background: 'rgba(16,18,22,0.65)', backdropFilter: 'blur(20px)',
            border: '1px solid var(--color-border)', borderRadius: '14px',
            padding: '1.25rem',
            animation: 'fadeSlideIn 0.5s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <div className="text-eyebrow" style={{ marginBottom: '4px', fontSize: '0.625rem' }}>CLIMATE DATA</div>
                <div className="font-display font-bold" style={{ fontSize: '1.125rem' }}>{searchedLocation.name}</div>
              </div>
              <div style={{
                padding: '4px 12px', borderRadius: '20px',
                background: `${riskColor}15`, border: `1px solid ${riskColor}30`,
              }}>
                <span className="font-mono" style={{ fontSize: '0.5625rem', color: riskColor, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {climateData.risk} risk
                </span>
              </div>
            </div>

            {/* Climate grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {[
                { icon: Thermometer, label: 'Temperature', value: climateData.temp, color: '#FF4D2E' },
                { icon: Droplets, label: 'Humidity', value: climateData.humidity, color: '#7B8CFF' },
                { icon: Wind, label: 'Wind', value: climateData.wind, color: '#C9CDD3' },
                { icon: CloudRain, label: 'Condition', value: climateData.condition, color: '#3ECF8E' },
              ].map(({ icon: I, label, value, color }) => (
                <div key={label} style={{
                  padding: '0.75rem', borderRadius: '10px',
                  background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.03)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <I size={12} color={color} />
                    <span className="font-mono" style={{ fontSize: '0.5625rem', color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
                  </div>
                  <div className="font-display font-bold" style={{ fontSize: '1rem' }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Extra info */}
            <div style={{ marginTop: '0.75rem', padding: '0.75rem', borderRadius: '10px', background: 'rgba(0,0,0,0.2)' }}>
              <div className="font-mono" style={{ fontSize: '0.5625rem', color: 'var(--color-text-dim)', marginBottom: '4px' }}>
                SEISMIC: <span style={{ color: 'var(--color-text-muted)' }}>{climateData.seismic}</span>
              </div>
              <div className="font-mono" style={{ fontSize: '0.5625rem', color: 'var(--color-text-dim)' }}>
                PRESSURE: <span style={{ color: 'var(--color-text-muted)' }}>{climateData.pressure}</span>
              </div>
            </div>

            {/* Alerts */}
            {climateData.alerts?.length > 0 && (
              <div style={{ marginTop: '0.75rem' }}>
                {climateData.alerts.map((alert, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '6px 10px', borderRadius: '6px', marginBottom: '4px',
                    background: 'rgba(255,77,46,0.06)', border: '1px solid rgba(255,77,46,0.12)',
                  }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#FF4D2E' }} />
                    <span className="font-mono" style={{ fontSize: '0.625rem', color: '#FF4D2E' }}>{alert}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', gap: '0.5rem' }}>
            <Loader2 size={16} color="var(--color-accent-hero)" style={{ animation: 'spin 1s linear infinite' }} />
            <span className="font-mono" style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>Agents initializing...</span>
          </div>
        )}

        {/* Agent panels */}
        {searchedLocation && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="text-eyebrow" style={{ fontSize: '0.625rem', marginTop: '0.25rem' }}>AI AGENTS</div>
            {agents.map((agent, i) => (
              <AgentPanel
                key={agent.title}
                agent={agent}
                isActive={agentsActive[i]}
                delay={i * 1500}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!searchedLocation && (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '1rem', opacity: 0.5, textAlign: 'center', padding: '2rem',
          }}>
            <MapPin size={32} color="var(--color-text-dim)" />
            <div>
              <div className="font-display font-semibold" style={{ fontSize: '0.9375rem', marginBottom: '0.5rem' }}>
                Search a location
              </div>
              <p className="font-mono" style={{ fontSize: '0.6875rem', color: 'var(--color-text-dim)', lineHeight: 1.6 }}>
                Type a city name to view climate data and activate the AI agent pipeline.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
