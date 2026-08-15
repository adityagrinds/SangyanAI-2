import { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Droplets, Wind, Flame, Mountain, MapPin, Clock } from 'lucide-react';
import { useFakeLiveFeed, useRevealOnScroll } from '../hooks/useAnimations';

const typeIcons = {
  earthquake: AlertTriangle,
  flood: Droplets,
  storm: Wind,
  wildfire: Flame,
  volcano: Mountain,
};

const severityColors = {
  high: '#FF4D2E',
  medium: '#FFB020',
  low: '#3ECF8E',
};

function IncidentCard({ incident, isNew }) {
  const Icon = typeIcons[incident.type] || AlertTriangle;
  const color = severityColors[incident.severity];
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const update = () => {
      const diff = Math.floor((Date.now() - incident.time) / 1000);
      if (diff < 60) setTimeAgo(`${diff}s ago`);
      else if (diff < 3600) setTimeAgo(`${Math.floor(diff / 60)}m ago`);
      else setTimeAgo(`${Math.floor(diff / 3600)}h ago`);
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [incident.time]);

  return (
    <div
      className="glass-card interactive"
      style={{
        padding: '1rem 1.25rem',
        marginBottom: '0.75rem',
        transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
        opacity: isNew ? 0 : 1,
        transform: isNew ? 'translateY(-10px)' : 'translateY(0)',
        borderLeft: `3px solid ${color}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: `${color}12`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={16} color={color} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="font-display font-semibold" style={{ fontSize: '0.8125rem' }}>
              {incident.type.charAt(0).toUpperCase() + incident.type.slice(1)}
              {incident.magnitude ? ` M${incident.magnitude}` : ''}
            </span>
            <span
              className="font-mono"
              style={{
                fontSize: '0.5625rem',
                color: color,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                padding: '2px 6px',
                borderRadius: '4px',
                background: `${color}12`,
              }}
            >
              {incident.severity}
            </span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '4px',
            color: 'var(--color-text-dim)',
            fontSize: '0.6875rem',
          }}>
            <MapPin size={10} /> {incident.location}
            <span style={{ margin: '0 2px' }}>·</span>
            <Clock size={10} /> {timeAgo}
          </div>
          <p className="font-mono" style={{
            fontSize: '0.625rem',
            color: 'var(--color-text-dim)',
            marginTop: '6px',
            lineHeight: 1.4,
          }}>
            {incident.description}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Mini Map placeholder ──
function MiniMap() {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '200px',
      borderRadius: '8px',
      background: 'rgba(0,0,0,0.4)',
      border: '1px solid rgba(255,255,255,0.05)',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Grid overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '30px 30px',
      }} />
      {/* Dots representing incidents */}
      {[
        { x: '15%', y: '30%', c: '#FF4D2E' },
        { x: '70%', y: '25%', c: '#FFB020' },
        { x: '45%', y: '55%', c: '#3ECF8E' },
        { x: '80%', y: '60%', c: '#FF4D2E' },
        { x: '25%', y: '70%', c: '#FFB020' },
        { x: '55%', y: '35%', c: '#FF4D2E' },
        { x: '35%', y: '45%', c: '#3ECF8E' },
      ].map((dot, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: dot.x,
          top: dot.y,
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: dot.c,
          boxShadow: `0 0 10px ${dot.c}60`,
          animation: `radar-ping ${2 + i * 0.3}s ease-out infinite`,
          animationDelay: `${i * 0.5}s`,
        }} />
      ))}
      <span className="font-mono" style={{
        fontSize: '0.625rem',
        color: 'var(--color-text-dim)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        position: 'relative',
      }}>
        Global Threat Map
      </span>
    </div>
  );
}

export default function Dashboard() {
  const { ref, visible } = useRevealOnScroll();
  const incidents = useFakeLiveFeed(5000);

  return (
    <section
      id="dashboard"
      ref={ref}
      className={`reveal ${visible ? 'visible' : ''}`}
      style={{
        padding: '6rem 2rem',
        maxWidth: '1100px',
        margin: '0 auto',
      }}
    >
      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div className="text-eyebrow" style={{ marginBottom: '1rem' }}>LIVE PREVIEW</div>
        <h2 className="text-section-title">
          Real-time{' '}
          <span style={{ color: 'var(--color-accent-hero)' }}>intelligence</span>
          {' '}feed
        </h2>
      </div>

      {/* Browser frame */}
      <div className="browser-frame" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Toolbar */}
        <div className="browser-toolbar">
          <div className="browser-dot" style={{ background: '#FF5F57' }} />
          <div className="browser-dot" style={{ background: '#FFBD2E' }} />
          <div className="browser-dot" style={{ background: '#28C840' }} />
          <div style={{
            flex: 1,
            marginLeft: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <div style={{
              flex: 1,
              maxWidth: '350px',
              height: '28px',
              borderRadius: '6px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              padding: '0 10px',
            }}>
              <span className="font-mono" style={{ fontSize: '0.625rem', color: 'var(--color-text-dim)' }}>
                app.sangyanai.com/dashboard
              </span>
            </div>
            {/* Live badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '20px',
              background: 'rgba(62,207,142,0.1)',
              border: '1px solid rgba(62,207,142,0.2)',
            }}>
              <div style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: '#3ECF8E',
                animation: 'glow-pulse 1.5s ease-in-out infinite',
              }} />
              <span className="font-mono" style={{ fontSize: '0.5625rem', color: '#3ECF8E', fontWeight: 600 }}>
                LIVE
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: '1rem',
          padding: '1.5rem',
          minHeight: '400px',
        }}>
          {/* Incident feed */}
          <div style={{ maxHeight: '450px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {incidents
              .sort((a, b) => b.time - a.time)
              .slice(0, 8)
              .map((inc) => (
                <IncidentCard key={inc.id} incident={inc} />
              ))}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <MiniMap />

            {/* Stats mini cards */}
            {[
              { label: 'Active Alerts', value: incidents.filter(i => i.severity === 'high').length, color: '#FF4D2E' },
              { label: 'Agents Online', value: '3/3', color: '#3ECF8E' },
              { label: 'Avg Response', value: '342ms', color: '#7B8CFF' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass-card"
                style={{ padding: '1rem', textAlign: 'center' }}
              >
                <div className="font-display font-bold" style={{ fontSize: '1.5rem', color: stat.color }}>
                  {stat.value}
                </div>
                <div className="font-mono" style={{ fontSize: '0.5625rem', color: 'var(--color-text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '4px' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive note: stack on mobile */}
      <style>{`
        @media (max-width: 768px) {
          #dashboard .browser-frame > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
