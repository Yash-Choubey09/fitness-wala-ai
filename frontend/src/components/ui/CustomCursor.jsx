/**
 * src/components/ui/CustomCursor.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Premium custom cursor: instant inner dot + lagging outer ring.
 * Enlarges on hover over [data-cursor="hover"] elements.
 * Hides native OS cursor via global CSS.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';

export const CustomCursor = () => {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Don't show on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Start off-screen until first mouse move
    let mouseX = -100, mouseY = -100;
    let ringX  = -100, ringY  = -100;

    // Snap dot to cursor instantly
    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.set(dot, { x: mouseX, y: mouseY });
    };

    // Cursor state changes
    const onEnterHover = () => {
      gsap.to(ring, { scale: 1.8, opacity: 0.5, borderColor: '#00E0FF', duration: 0.3, ease: 'power2.out' });
      gsap.to(dot,  { scale: 1.5, duration: 0.2, ease: 'power2.out' });
    };
    const onLeaveHover = () => {
      gsap.to(ring, { scale: 1, opacity: 0.7, borderColor: 'rgba(0,224,255,0.6)', duration: 0.4, ease: 'elastic.out(1, 0.5)' });
      gsap.to(dot,  { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' });
    };
    const onEnterText = () => {
      gsap.to(ring, { scaleX: 0.08, scaleY: 1.4, opacity: 0.6, duration: 0.25, ease: 'power2.out' });
    };

    // Lagging ring via GSAP ticker
    const tickRing = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      gsap.set(ring, { x: ringX, y: ringY });
    };

    gsap.ticker.add(tickRing);
    window.addEventListener('mousemove', onMove, { passive: true });

    // Delegate hover detection using event delegation
    const onOver = (e) => {
      const el = e.target.closest('[data-cursor="hover"], a, button, [role="button"]');
      const tx = e.target.closest('[data-cursor="text"]');
      if (tx)  onEnterText();
      else if (el) onEnterHover();
    };
    const onOut = (e) => {
      const el = e.target.closest('[data-cursor="hover"], a, button, [role="button"], [data-cursor="text"]');
      if (el) onLeaveHover();
    };

    document.addEventListener('mouseover', onOver,  { passive: true });
    document.addEventListener('mouseout',  onOut,   { passive: true });

    // Show cursor after first move
    const onFirstMove = () => {
      gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
      window.removeEventListener('mousemove', onFirstMove);
    };
    window.addEventListener('mousemove', onFirstMove, { passive: true });

    return () => {
      gsap.ticker.remove(tickRing);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout',  onOut);
    };
  }, []);

  return (
    <>
      {/* Inner dot — instant */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 8, height: 8,
          borderRadius: '50%',
          background: '#00E0FF',
          pointerEvents: 'none',
          zIndex: 99999,
          opacity: 0,
          transform: 'translate(-50%, -50%)',
          willChange: 'transform',
          boxShadow: '0 0 10px rgba(0,224,255,0.8)',
        }}
      />
      {/* Outer ring — lagging */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 38, height: 38,
          borderRadius: '50%',
          border: '1.5px solid rgba(0,224,255,0.6)',
          pointerEvents: 'none',
          zIndex: 99998,
          opacity: 0,
          transform: 'translate(-50%, -50%)',
          willChange: 'transform',
          backdropFilter: 'none',
        }}
      />
    </>
  );
};
