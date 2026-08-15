import { useRef, useEffect, useState, useMemo } from 'react';
import { Radio, Brain, Rocket } from 'lucide-react';
import { mockAgentPipeline } from '../data/mockIncidents';
import { useTypewriter, useRevealOnScroll } from '../hooks/useAnimations';

const agents = [
  {
    key: 'monitor',
    title: 'Monitor',
    subtitle: 'Real-time scanning',
    icon: Radio,
    color: '#FF4D2E',
    data: mockAgentPipeline.monitor,
  },
  {
    key: 'analyzer',
    title: 'Analyzer',
    subtitle: 'Threat assessment',
    icon: Brain,
    color: '#7B8CFF',
    data: mockAgentPipeline.analyzer,
  },
  {
    key: 'responder',
    title: 'Responder',
    subtitle: 'Action deployment',
    icon: Rocket,
    color: '#3ECF8E',
    data: mockAgentPipeline.responder,
  },
];

function AgentCard({ agent, isActive, delay }) {
  const { displayedLines, activate } = useTypewriter(agent.data.log, 25, 400);
  const Icon = agent.icon;

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => activate(), delay);
      return () => clearTimeout(timer);
    }
  }, [isActive, activate, delay]);

  return (
    <div
      className="glass-card"
      style={{
        padding: '2rem',
        flex: '1 1 300px',
        maxWidth: '380px',
        transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
        borderColor: isActive ? agent.color + '40' : undefined,
        boxShadow: isActive ? `0 0 40px ${agent.color}15, inset 0 0 30px ${agent.color}05` : undefined,
        opacity: isActive ? 1 : 0.5,
        transform: isActive ? 'scale(1)' : 'scale(0.97)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: `${agent.color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px solid ${agent.color}30`,
        }}>
          <Icon size={20} color={agent.color} />
        </div>
        <div>
          <div className="font-display font-bold" style={{ fontSize: '1.125rem' }}>
            {agent.title}
          </div>
          <div className="font-mono" style={{ fontSize: '0.6875rem', color: 'var(--color-text-dim)' }}>
            {agent.subtitle}
          </div>
        </div>
        {/* Status indicator */}
        <div style={{
          marginLeft: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: isActive ? agent.color : 'var(--color-text-dim)',
            boxShadow: isActive ? `0 0 8px ${agent.color}` : 'none',
            animation: isActive ? 'glow-pulse 2s ease-in-out infinite' : 'none',
          }} />
          <span className="font-mono" style={{
            fontSize: '0.625rem',
            color: isActive ? agent.color : 'var(--color-text-dim)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            {agent.data.status}
          </span>
        </div>
      </div>

      {/* Terminal-style log */}
      <div style={{
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '8px',
        padding: '1rem',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6875rem',
        lineHeight: '1.7',
        color: 'var(--color-text-muted)',
        minHeight: '140px',
        border: '1px solid rgba(255,255,255,0.03)',
      }}>
        {displayedLines.map((line, i) => (
          <div key={i} style={{ marginBottom: '2px' }}>
            <span style={{ color: agent.color, marginRight: '6px' }}>›</span>
            {line}
          </div>
        ))}
        {isActive && displayedLines.length < agent.data.log.length && (
          <span style={{
            display: 'inline-block',
            width: '7px',
            height: '14px',
            background: agent.color,
            marginLeft: '2px',
            animation: 'blink-caret 0.8s step-end infinite',
          }} />
        )}
      </div>
    </div>
  );
}

// ── SVG Connector ──
function PipelineConnector({ color = '#FF4D2E', isActive }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: '0 0 80px',
      position: 'relative',
    }}>
      <svg width="80" height="40" viewBox="0 0 80 40" style={{ overflow: 'visible' }}>
        {/* Static line */}
        <line x1="0" y1="20" x2="80" y2="20" stroke="rgba(255,255,255,0.07)" strokeWidth="2" />
        {/* Animated line overlay */}
        <line
          x1="0" y1="20" x2="80" y2="20"
          stroke={color}
          strokeWidth="2"
          style={{
            opacity: isActive ? 0.5 : 0,
            transition: 'opacity 0.6s ease',
          }}
        />
        {/* Traveling dot */}
        {isActive && (
          <circle r="4" fill={color} style={{
            filter: `drop-shadow(0 0 6px ${color})`,
          }}>
            <animateMotion dur="2s" repeatCount="indefinite" path="M0,20 L80,20" />
          </circle>
        )}
        {/* Arrow */}
        <polygon
          points="72,14 80,20 72,26"
          fill={isActive ? color : 'rgba(255,255,255,0.1)'}
          style={{ transition: 'fill 0.4s ease' }}
        />
      </svg>
    </div>
  );
}

export default function Pipeline() {
  const { ref, visible } = useRevealOnScroll(0.1);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (!visible) return;
    const timers = [
      setTimeout(() => setActiveIndex(0), 400),
      setTimeout(() => setActiveIndex(1), 2000),
      setTimeout(() => setActiveIndex(2), 3800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [visible]);

  return (
    <section
      id="pipeline"
      ref={ref}
      className={`reveal ${visible ? 'visible' : ''}`}
      style={{
        padding: '6rem 2rem',
        maxWidth: '1300px',
        margin: '0 auto',
      }}
    >
      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div className="text-eyebrow" style={{ marginBottom: '1rem' }}>HOW IT WORKS</div>
        <h2 className="text-section-title">
          Three agents.{' '}
          <span style={{ color: 'var(--color-accent-hero)' }}>One mission.</span>
        </h2>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1.0625rem',
          color: 'var(--color-text-muted)',
          marginTop: '1rem',
          maxWidth: '550px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          A coordinated AI pipeline that detects, analyzes, and responds to global crises autonomously.
        </p>
      </div>

      {/* Pipeline cards */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0',
        flexWrap: 'wrap',
      }}>
        {agents.map((agent, i) => (
          <div key={agent.key} style={{ display: 'flex', alignItems: 'center' }}>
            <AgentCard agent={agent} isActive={activeIndex >= i} delay={i * 200} />
            {i < agents.length - 1 && (
              <PipelineConnector
                color={agents[i + 1].color}
                isActive={activeIndex > i}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
