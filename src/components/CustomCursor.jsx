import { useState, useEffect, useCallback, useRef } from 'react';

// ── Custom Cursor Component ──
export default function CustomCursor() {
  const cursorRef = useRef(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const move = (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    };

    const onOver = (e) => {
      const el = e.target.closest('a, button, [role="button"], .interactive');
      setHovering(!!el);
    };

    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', onOver);
    };
  }, []);

  return <div ref={cursorRef} className={`custom-cursor ${hovering ? 'hovering' : ''}`} />;
}
