import { useCountUp, useRevealOnScroll } from '../hooks/useAnimations';
import { Shield, Clock, Cpu, Globe } from 'lucide-react';

const stats = [
  { value: 2400, suffix: '+', label: 'Incidents Simulated', icon: Shield },
  { value: 3, suffix: '', label: 'AI Agents', icon: Cpu },
  { value: 400, suffix: 'ms', prefix: '<', label: 'Response Time', icon: Clock },
  { value: 195, suffix: '+', label: 'Countries Covered', icon: Globe },
];

function StatCard({ value, suffix, prefix, label, icon: Icon, delay }) {
  const { count, ref: counterRef } = useCountUp(value, 2000);

  return (
    <div
      ref={counterRef}
      className="glass-card interactive"
      style={{
        padding: '2rem 1.5rem',
        textAlign: 'center',
        flex: '1 1 200px',
        minWidth: '180px',
        animationDelay: `${delay}ms`,
      }}
    >
      <Icon
        size={24}
        color="var(--color-accent-hero)"
        style={{
          marginBottom: '0.75rem',
          filter: 'drop-shadow(0 0 6px rgba(255,77,46,0.4))',
        }}
      />
      <div className="stat-value">
        {prefix || ''}{count.toLocaleString()}{suffix}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function StatsStrip() {
  const { ref, visible } = useRevealOnScroll();

  return (
    <section
      ref={ref}
      className={`reveal ${visible ? 'visible' : ''}`}
      style={{
        padding: '4rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <div style={{
        display: 'flex',
        gap: '1.5rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 100} />
        ))}
      </div>
    </section>
  );
}
