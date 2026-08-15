import { useRevealOnScroll } from '../hooks/useAnimations';
import { techStack } from '../data/mockIncidents';
import { Database, Cloud, Shield, Cpu, Wifi, Layers } from 'lucide-react';

const archNodes = [
  { id: 'data', label: 'Data Sources', sublabel: 'USGS · Open-Meteo · NASA', icon: Cloud, x: 10, y: 30 },
  { id: 'ingest', label: 'Ingestion Layer', sublabel: 'WebSocket · REST API', icon: Wifi, x: 35, y: 15 },
  { id: 'monitor', label: 'Monitor Agent', sublabel: 'Real-time scanner', icon: Shield, x: 35, y: 55 },
  { id: 'engine', label: 'AI Engine', sublabel: 'Multi-model pipeline', icon: Cpu, x: 60, y: 30 },
  { id: 'db', label: 'Data Store', sublabel: 'Event log · Cache', icon: Database, x: 60, y: 65 },
  { id: 'output', label: 'Response Layer', sublabel: 'Alerts · Actions', icon: Layers, x: 85, y: 30 },
];

const connections = [
  ['data', 'ingest'],
  ['data', 'monitor'],
  ['ingest', 'engine'],
  ['monitor', 'engine'],
  ['engine', 'db'],
  ['engine', 'output'],
];

export default function TechShowcase() {
  const { ref, visible } = useRevealOnScroll();

  return (
    <section
      id="tech"
      ref={ref}
      className={`reveal ${visible ? 'visible' : ''}`}
      style={{
        padding: '6rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div className="text-eyebrow" style={{ marginBottom: '1rem' }}>ARCHITECTURE</div>
        <h2 className="text-section-title">
          Built for{' '}
          <span style={{ color: 'var(--color-accent-hero)' }}>scale</span>
        </h2>
        <p style={{
          color: 'var(--color-text-muted)',
          marginTop: '1rem',
          maxWidth: '500px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          A modular, event-driven architecture designed for real-time crisis intelligence.
        </p>
      </div>

      {/* Architecture diagram */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '900px',
        margin: '0 auto 4rem',
        height: '340px',
      }}>
        {/* SVG connections */}
        <svg
          viewBox="0 0 100 80"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
          }}
          preserveAspectRatio="xMidYMid meet"
        >
          {connections.map(([fromId, toId], i) => {
            const from = archNodes.find(n => n.id === fromId);
            const to = archNodes.find(n => n.id === toId);
            return (
              <g key={i}>
                <line
                  x1={from.x + 5}
                  y1={from.y + 5}
                  x2={to.x + 5}
                  y2={to.y + 5}
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="0.3"
                />
                {/* Animated pulse */}
                <circle r="0.6" fill="#FF4D2E" opacity="0.6"
                  filter="url(#glow)">
                  <animateMotion
                    dur={`${2.5 + i * 0.3}s`}
                    repeatCount="indefinite"
                    path={`M${from.x + 5},${from.y + 5} L${to.x + 5},${to.y + 5}`}
                  />
                </circle>
              </g>
            );
          })}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* Nodes */}
        {archNodes.map((node, i) => {
          const Icon = node.icon;
          return (
            <div
              key={node.id}
              className="glass-card interactive"
              style={{
                position: 'absolute',
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                animation: visible ? `float ${3 + i * 0.5}s ease-in-out infinite` : 'none',
                animationDelay: `${i * 0.2}s`,
                whiteSpace: 'nowrap',
              }}
            >
              <Icon size={18} color="var(--color-accent-hero)" style={{
                filter: 'drop-shadow(0 0 4px rgba(255,77,46,0.3))',
              }} />
              <div>
                <div className="font-display font-semibold" style={{ fontSize: '0.75rem' }}>{node.label}</div>
                <div className="font-mono" style={{ fontSize: '0.5625rem', color: 'var(--color-text-dim)' }}>{node.sublabel}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tech stack pills */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}>
        {techStack.map((tech) => (
          <div
            key={tech.name}
            className="glass-card interactive"
            style={{
              padding: '0.625rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8125rem',
              fontWeight: 500,
            }}
          >
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: tech.color,
              boxShadow: `0 0 8px ${tech.color}60`,
            }} />
            {tech.name}
          </div>
        ))}
      </div>
    </section>
  );
}
