import { useState, useEffect, Suspense, lazy } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';

const Globe3D = lazy(() => import('./Globe3D'));

export default function Hero({ onExplore }) {
  const [stage, setStage] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 200);
    const t2 = setTimeout(() => setStage(2), 700);
    const t3 = setTimeout(() => setStage(3), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY / window.innerHeight);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Loading overlay */}
      <div className={`loading-overlay ${stage >= 2 ? 'hidden' : ''}`}>
        <div style={{ textAlign: 'center' }}>
          <div className="loading-line" style={{
            opacity: stage >= 1 ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }} />
        </div>
      </div>

      {/* 3D Globe — right side */}
      <div style={{
        position: 'absolute',
        right: '-10%',
        top: '0',
        width: '70%',
        height: '100%',
        pointerEvents: 'auto',
      }}>
        <Suspense fallback={null}>
          <Globe3D scrollProgress={scrollY} />
        </Suspense>
      </div>

      {/* Radial glow */}
      <div style={{
        position: 'absolute',
        right: '10%',
        top: '20%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,77,46,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
        opacity: Math.max(0, 1 - scrollY * 3),
      }} />

      {/* Hero text — LEFT ALIGNED */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'left',
        maxWidth: '680px',
        padding: '0 4rem',
        marginLeft: '4vw',
      }}>
        {/* Eyebrow */}
        <div className="text-eyebrow" style={{
          marginBottom: '1.5rem',
          opacity: stage >= 3 ? 1 : 0,
          transform: stage >= 3 ? 'translateX(0)' : 'translateX(-40px)',
          transition: 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0s',
        }}>
          AI-POWERED CRISIS INTELLIGENCE
        </div>

        {/* Headline */}
        <h1 className="text-hero" style={{
          opacity: stage >= 3 ? 1 : 0,
          transform: stage >= 3 ? 'translateX(0)' : 'translateX(-60px)',
          transition: 'all 1s cubic-bezier(0.22, 1, 0.36, 1) 0.15s',
        }}>
          AI that sees the{' '}
          <span style={{
            color: 'var(--color-accent-hero)',
            position: 'relative',
          }}>
            crisis
            <svg viewBox="0 0 200 8" style={{
              position: 'absolute', bottom: '-4px', left: '0', width: '100%', height: '8px',
            }}>
              <path d="M0 4 Q50 0 100 4 Q150 8 200 4" stroke="url(#heroGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <defs>
                <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF4D2E" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <br />
          before you do.
        </h1>

        {/* Subheadline */}
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          color: 'var(--color-text-muted)',
          lineHeight: 1.7,
          marginTop: '1.5rem',
          maxWidth: '520px',
          opacity: stage >= 3 ? 1 : 0,
          transform: stage >= 3 ? 'translateX(0)' : 'translateX(-50px)',
          transition: 'all 1s cubic-bezier(0.22, 1, 0.36, 1) 0.3s',
        }}>
          Multi-agent AI pipeline that monitors global disasters in real-time.
          From detection to response in under 400ms.
        </p>

        {/* Single CTA: Explore */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginTop: '2.5rem',
          opacity: stage >= 3 ? 1 : 0,
          transform: stage >= 3 ? 'translateX(0)' : 'translateX(-40px)',
          transition: 'all 1s cubic-bezier(0.22, 1, 0.36, 1) 0.45s',
        }}>
          <button onClick={onExplore} className="btn-primary interactive" style={{ border: 'none' }}>
            Explore <ArrowRight size={16} />
          </button>
        </div>

        {/* Quick stats */}
        <div style={{
          display: 'flex',
          gap: '2.5rem',
          marginTop: '3.5rem',
          opacity: stage >= 3 ? 1 : 0,
          transform: stage >= 3 ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 1s cubic-bezier(0.22, 1, 0.36, 1) 0.6s',
        }}>
          {[
            { val: '2,400+', label: 'Incidents' },
            { val: '<400ms', label: 'Response' },
            { val: '3', label: 'AI Agents' },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-display font-bold" style={{ fontSize: '1.25rem' }}>{s.val}</div>
              <div className="font-mono" style={{ fontSize: '0.625rem', color: 'var(--color-text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '2px' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute',
        bottom: '2rem',
        left: '4rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        opacity: stage >= 3 ? Math.max(0, 1 - scrollY * 5) : 0,
        transition: 'opacity 0.6s ease',
      }}>
        <span className="font-mono" style={{
          fontSize: '0.625rem', letterSpacing: '0.2em', color: 'var(--color-text-dim)', textTransform: 'uppercase',
        }}>
          Scroll to explore
        </span>
        <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, var(--color-accent-hero), transparent)', position: 'relative' }}>
          <ArrowDown size={10} color="var(--color-accent-hero)" style={{
            position: 'absolute', bottom: '-12px', left: '-4.5px', animation: 'float 2s ease-in-out infinite',
          }} />
        </div>
      </div>
    </section>
  );
}
