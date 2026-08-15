import { useState, useEffect, useCallback, useRef } from 'react';
import { mockIncidents } from '../data/mockIncidents';

// ── useFakeLiveFeed — simulates real-time incident updates ──
export function useFakeLiveFeed(interval = 5000) {
  const [incidents, setIncidents] = useState(mockIncidents);

  useEffect(() => {
    const timer = setInterval(() => {
      setIncidents(prev => {
        const copy = [...prev];
        const idx = Math.floor(Math.random() * copy.length);
        copy[idx] = {
          ...copy[idx],
          time: Date.now() - Math.floor(Math.random() * 10000),
          severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        };
        return copy;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [interval]);

  return incidents;
}

// ── useCountUp — animated counter ──
export function useCountUp(target, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(!startOnView);
  const ref = useRef(null);

  const start = useCallback(() => setStarted(true), []);

  useEffect(() => {
    if (startOnView && ref.current) {
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { start(); observer.disconnect(); } },
        { threshold: 0.3 }
      );
      observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, [start, startOnView]);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    let animFrame;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.floor(eased * target));
      if (progress < 1) animFrame = requestAnimationFrame(step);
    };
    animFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrame);
  }, [started, target, duration]);

  return { count, ref };
}

// ── useScrollProgress ──
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return progress;
}

// ── useRevealOnScroll ──
export function useRevealOnScroll(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ── useRelativeTime ──
export function useRelativeTime(timestamp) {
  const [text, setText] = useState('');
  useEffect(() => {
    const update = () => {
      const diff = Math.floor((Date.now() - timestamp) / 1000);
      if (diff < 60) setText(`${diff}s ago`);
      else if (diff < 3600) setText(`${Math.floor(diff / 60)}m ago`);
      else setText(`${Math.floor(diff / 3600)}h ago`);
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [timestamp]);
  return text;
}

// ── useTypewriter ──
export function useTypewriter(lines, speed = 30, lineDelay = 500) {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const activate = useCallback(() => setIsActive(true), []);

  useEffect(() => {
    if (!isActive || currentLine >= lines.length) return;
    if (currentChar < lines[currentLine].length) {
      const timer = setTimeout(() => {
        setDisplayedLines(prev => {
          const copy = [...prev];
          copy[currentLine] = (copy[currentLine] || '') + lines[currentLine][currentChar];
          return copy;
        });
        setCurrentChar(c => c + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setCurrentLine(l => l + 1);
        setCurrentChar(0);
      }, lineDelay);
      return () => clearTimeout(timer);
    }
  }, [isActive, currentLine, currentChar, lines, speed, lineDelay]);

  return { displayedLines, activate, isComplete: currentLine >= lines.length };
}
