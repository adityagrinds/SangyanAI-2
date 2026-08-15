import { useRevealOnScroll } from '../hooks/useAnimations';
import { ArrowRight, Zap } from 'lucide-react';

export default function CTASection() {
  const { ref, visible } = useRevealOnScroll();

  return (
    <section
      id="cta"
      ref={ref}
      className={`reveal ${visible ? 'visible' : ''}`}
      style={{
        padding: '8rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated gradient mesh background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse at 20% 50%, rgba(255,77,46,0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 50%, rgba(123,140,255,0.05) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 100%, rgba(62,207,142,0.04) 0%, transparent 50%)
        `,
        backgroundSize: '200% 200%',
        animation: 'gradient-shift 10s ease infinite',
      }} />

      {/* Noise texture overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.02'/%3E%3C/svg%3E")`,
        opacity: 0.5,
        pointerEvents: 'none',
      }} />

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: `${1 + Math.random() * 2}px`,
          height: `${1 + Math.random() * 2}px`,
          borderRadius: '50%',
          background: 'rgba(255,77,46,0.3)',
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 3}s`,
          pointerEvents: 'none',
        }} />
      ))}

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        textAlign: 'center',
        maxWidth: '700px',
        margin: '0 auto',
      }}>
        <div className="text-eyebrow" style={{ marginBottom: '1.5rem' }}>
          GET STARTED
        </div>
        <h2 className="text-section-title" style={{ marginBottom: '1.5rem' }}>
          Ready to see the future of{' '}
          <span style={{ color: 'var(--color-accent-hero)' }}>crisis response</span>?
        </h2>
        <p style={{
          color: 'var(--color-text-muted)',
          fontSize: '1.0625rem',
          lineHeight: 1.7,
          marginBottom: '2.5rem',
          maxWidth: '500px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          Experience the live demo or dive into the codebase. SangyanAI is open-source
          and ready for deployment.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#dashboard" className="btn-primary interactive" style={{
            padding: '1rem 2.5rem',
            fontSize: '1rem',
            position: 'relative',
          }}>
            <Zap size={18} />
            Launch Live Demo
            <ArrowRight size={16} />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener"
            className="btn-secondary interactive"
            style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}
          >
            Star on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
