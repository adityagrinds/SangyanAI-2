import { useCallback, useEffect } from 'react';

export default function ClickRipple() {
  const createRipple = useCallback((e) => {
    // Check if reduced motion is preferred
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const el = e.target.closest('a, button, [role="button"], .interactive, .glass-card, .nav-link');
    if (!el) return;

    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = (e.clientX - 75) + 'px';
    ripple.style.top = (e.clientY - 75) + 'px';
    document.body.appendChild(ripple);

    setTimeout(() => ripple.remove(), 700);
  }, []);

  useEffect(() => {
    window.addEventListener('click', createRipple);
    return () => window.removeEventListener('click', createRipple);
  }, [createRipple]);

  return null;
}
