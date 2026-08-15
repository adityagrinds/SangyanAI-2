import { Activity, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      padding: '3rem 2rem 2rem',
      borderTop: '1px solid var(--color-border)',
      maxWidth: '1200px',
      margin: '0 auto',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={18} color="var(--color-accent-hero)" />
          <span className="font-display font-bold" style={{ fontSize: '0.9375rem' }}>
            Sangyan<span style={{ color: 'var(--color-accent-hero)' }}>AI</span>
          </span>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '2rem' }}>
          {['Documentation', 'API Reference', 'Changelog', 'License'].map((link) => (
            <a
              key={link}
              href="#"
              className="nav-link interactive"
              style={{ fontSize: '0.75rem' }}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Socials */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {[
            { icon: Github, href: 'https://github.com' },
            { icon: Twitter, href: '#' },
            { icon: Linkedin, href: '#' },
            { icon: Mail, href: '#' },
          ].map(({ icon: Icon, href }) => (
            <a
              key={href + Icon.displayName}
              href={href}
              target="_blank"
              rel="noopener"
              className="interactive"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'border-color 0.3s ease, background 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-accent-hero)';
                e.currentTarget.style.background = 'rgba(255,77,46,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <Icon size={14} color="var(--color-text-muted)" />
            </a>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        marginTop: '2rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}>
        <span className="font-mono" style={{
          fontSize: '0.625rem',
          color: 'var(--color-text-dim)',
          letterSpacing: '0.05em',
        }}>
          © 2026 SangyanAI. Built with purpose.
        </span>
        <span className="font-mono" style={{
          fontSize: '0.625rem',
          color: 'var(--color-text-dim)',
        }}>
          Made with <span style={{ color: 'var(--color-accent-hero)' }}>♥</span> for a safer world
        </span>
      </div>
    </footer>
  );
}
