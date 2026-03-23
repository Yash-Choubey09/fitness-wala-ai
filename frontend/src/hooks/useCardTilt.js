/**
 * src/hooks/useCardTilt.js
 * ─────────────────────────────────────────────────────────────────────────────
 * 3D perspective tilt on mouse move for any card element.
 * Returns { ref, handlers } to spread onto the card container.
 *
 * Usage:
 *   const { ref, handlers } = useCardTilt();
 *   <div ref={ref} {...handlers}>…</div>
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { useRef, useCallback } from 'react';
import { gsap } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/gsap';

/**
 * @param {object} opts
 * @param {number} opts.maxTilt   — max deg rotation (default 10)
 * @param {number} opts.scale     — hover scale (default 1.03)
 * @param {number} opts.speed     — GSAP duration seconds (default 0.4)
 * @param {string} opts.perspective — CSS perspective (default '800px')
 * @param {number} opts.glowAlpha — glow opacity on hover (default 0.12)
 */
export const useCardTilt = (opts = {}) => {
  const ref = useRef(null);
  const {
    maxTilt     = 10,
    scale       = 1.03,
    speed       = 0.4,
    perspective = '800px',
    glowAlpha   = 0.12,
  } = opts;

  const onMouseMove = useCallback((e) => {
    if (!ref.current || prefersReducedMotion()) return;
    const card = ref.current;
    const rect = card.getBoundingClientRect();

    // Normalized -1 → 1 position inside card
    const nx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
    const ny = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;

    gsap.to(card, {
      rotateY:  nx * maxTilt,
      rotateX: -ny * maxTilt,
      scale,
      duration: speed,
      ease: 'power2.out',
      transformPerspective: parseInt(perspective),
      force3D: true,
    });
  }, [maxTilt, scale, speed, perspective]);

  const onMouseEnter = useCallback(() => {
    if (!ref.current || prefersReducedMotion()) return;
    gsap.to(ref.current, {
      scale,
      duration: 0.25,
      ease: 'power2.out',
      force3D: true,
    });
  }, [scale]);

  const onMouseLeave = useCallback(() => {
    if (!ref.current || prefersReducedMotion()) return;
    gsap.to(ref.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.7,
      ease: 'elastic.out(1, 0.4)',
      force3D: true,
    });
  }, []);

  return {
    ref,
    handlers: { onMouseMove, onMouseEnter, onMouseLeave },
  };
};
