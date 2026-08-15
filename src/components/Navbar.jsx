import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Activity
            size={24}
            color="#FF4D2E"
            strokeWidth={2.5}
            style={{ filter: 'drop-shadow(0 0 8px rgba(255,77,46,0.5))' }}
          />
          <div style={{
            position: 'absolute', inset: '-4px', borderRadius: '50%',
            border: '1px solid rgba(255,77,46,0.3)',
            animation: 'radar-ping 2.5s ease-out infinite',
          }} />
        </div>
        <span className="font-display text-lg font-bold tracking-tight">
          Sangyan<span style={{ color: 'var(--color-accent-hero)' }}>AI</span>
        </span>
      </div>

      {/* Minimal nav — no extra links */}
      <div />
    </nav>
  );
}
