import { useRevealOnScroll } from '../hooks/useAnimations';
import { ShieldCheck, Clock, Users, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Proactive Detection',
    description: 'AI agents continuously scan multiple data sources, identifying threats before they escalate into full-scale emergencies.',
  },
  {
    icon: Clock,
    title: 'Sub-Second Response',
    description: 'From detection to actionable intelligence in under 400ms. Every millisecond counts when lives are at stake.',
  },
  {
    icon: Users,
    title: 'Coordinated Action',
    description: 'Automated response plans that coordinate across emergency services, shelters, and regional alert systems.',
  },
  {
    icon: BarChart3,
    title: 'Predictive Intelligence',
    description: 'Machine learning models that analyze historical patterns to predict crisis trajectories and optimize resource allocation.',
  },
];

export default function Impact() {
  const { ref, visible } = useRevealOnScroll();

  return (
    <section
      id="impact"
      ref={ref}
      className={`reveal ${visible ? 'visible' : ''}`}
      style={{
        padding: '6rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'center',
      }}>
        {/* Text content */}
        <div>
          <div className="text-eyebrow" style={{ marginBottom: '1rem' }}>WHY IT MATTERS</div>
          <h2 className="text-section-title" style={{ marginBottom: '1.5rem' }}>
            Saving lives with{' '}
            <span style={{ color: 'var(--color-accent-hero)' }}>intelligence</span>
          </h2>
          <p style={{
            color: 'var(--color-text-muted)',
            lineHeight: 1.7,
            marginBottom: '2.5rem',
          }}>
            Every natural disaster follows a pattern. SangyanAI reads that pattern in real-time,
            giving responders the intelligence they need before the crisis peaks. Not after.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="interactive"
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '1rem',
                    borderRadius: '12px',
                    transition: 'background 0.3s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(255,77,46,0.08)',
                    border: '1px solid rgba(255,77,46,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={18} color="var(--color-accent-hero)" />
                  </div>
                  <div>
                    <div className="font-display font-semibold" style={{ fontSize: '0.9375rem', marginBottom: '4px' }}>
                      {f.title}
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                      {f.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3D-style illustration (CSS-only premium visual) */}
        <div style={{
          position: 'relative',
          height: '500px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Concentric radar rings */}
          {[1, 2, 3, 4].map((ring) => (
            <div key={ring} style={{
              position: 'absolute',
              width: `${ring * 100}px`,
              height: `${ring * 100}px`,
              borderRadius: '50%',
              border: `1px solid rgba(255,77,46,${0.15 - ring * 0.03})`,
              animation: `radar-ping ${3 + ring}s ease-out infinite`,
              animationDelay: `${ring * 0.5}s`,
            }} />
          ))}

          {/* Central shield */}
          <div style={{
            position: 'relative',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,77,46,0.15) 0%, transparent 70%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 60px rgba(255,77,46,0.15)',
          }}>
            <ShieldCheck size={48} color="var(--color-accent-hero)" style={{
              filter: 'drop-shadow(0 0 20px rgba(255,77,46,0.5))',
            }} />
          </div>

          {/* Orbiting dots */}
          {[0, 60, 120, 180, 240, 300].map((deg, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: i % 2 === 0 ? '#FF4D2E' : '#7B8CFF',
              boxShadow: `0 0 12px ${i % 2 === 0 ? 'rgba(255,77,46,0.5)' : 'rgba(123,140,255,0.5)'}`,
              animation: `float ${2 + i * 0.3}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
              left: `${50 + 38 * Math.cos((deg * Math.PI) / 180)}%`,
              top: `${50 + 38 * Math.sin((deg * Math.PI) / 180)}%`,
              transform: 'translate(-50%, -50%)',
            }} />
          ))}

          {/* Scan line */}
          <div style={{
            position: 'absolute',
            width: '200px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,77,46,0.3), transparent)',
            transformOrigin: 'center',
            animation: 'spin 4s linear infinite',
          }} />
          <style>{`
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          `}</style>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          #impact > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
