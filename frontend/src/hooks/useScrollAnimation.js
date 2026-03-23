/**
 * src/hooks/useScrollAnimation.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Generic scroll-animation hook. Accepts a ref and animation type.
 * All animations use gsap.context() for proper React cleanup on unmount.
 *
 * Usage:
 *   const ref = useRef(null);
 *   useScrollAnimation(ref, 'fade-up');
 *   useScrollAnimation(ref, 'stagger', { stagger: 0.12, childSelector: '.card' });
 *   useScrollAnimation(ref, 'counter', { end: 8450 });
 *   useScrollAnimation(ref, 'line-draw');
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { useEffect } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap';

/**
 * @param {React.RefObject} ref           — DOM ref to animate
 * @param {'fade-up'|'stagger'|'counter'|'line-draw'} type
 * @param {object}          options       — override defaults
 */
export const useScrollAnimation = (ref, type = 'fade-up', options = {}) => {
  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const el = ref.current;

      switch (type) {
        // ── Fade + slide up ──────────────────────────────────────────────────
        case 'fade-up': {
          gsap.fromTo(
            el,
            { y: options.y ?? 40, opacity: 0, force3D: true },
            {
              y: 0,
              opacity: 1,
              duration: options.duration ?? 0.9,
              delay: options.delay ?? 0,
              ease: options.ease ?? 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: options.start ?? 'top 88%',
                once: true,
                markers: import.meta.env.DEV && options.markers,
              },
            }
          );
          break;
        }

        // ── Stagger children ─────────────────────────────────────────────────
        case 'stagger': {
          const children = options.childSelector
            ? el.querySelectorAll(options.childSelector)
            : el.children;
          if (!children.length) break;

          gsap.fromTo(
            Array.from(children),
            { y: options.y ?? 40, opacity: 0, force3D: true },
            {
              y: 0,
              opacity: 1,
              stagger: options.stagger ?? 0.1,
              duration: options.duration ?? 0.8,
              ease: options.ease ?? 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: options.start ?? 'top 88%',
                once: true,
                markers: import.meta.env.DEV && options.markers,
              },
            }
          );
          break;
        }

        // ── Counting number ──────────────────────────────────────────────────
        case 'counter': {
          const end = options.end ?? 100;
          const obj = { val: options.from ?? 0 };
          gsap.to(obj, {
            val: end,
            duration: options.duration ?? 2,
            ease: 'power2.out',
            snap: { val: options.decimals ? Math.pow(10, -options.decimals) : 1 },
            onUpdate() {
              const v = options.decimals
                ? obj.val.toFixed(options.decimals)
                : Math.round(obj.val).toLocaleString();
              el.textContent = `${options.prefix ?? ''}${v}${options.suffix ?? ''}`;
            },
            scrollTrigger: {
              trigger: el,
              start: options.start ?? 'top 88%',
              once: true,
              markers: import.meta.env.DEV && options.markers,
            },
          });
          break;
        }

        // ── Line draw (scaleX) ───────────────────────────────────────────────
        case 'line-draw': {
          gsap.fromTo(
            el,
            { scaleX: 0, transformOrigin: 'left center', force3D: true },
            {
              scaleX: 1,
              duration: options.duration ?? 1.2,
              ease: options.ease ?? 'power3.inOut',
              scrollTrigger: {
                trigger: el,
                start: options.start ?? 'top 85%',
                once: true,
                markers: import.meta.env.DEV && options.markers,
              },
            }
          );
          break;
        }

        default:
          break;
      }
    }, ref); // scope context to the ref element

    return () => ctx.revert(); // cleanup all GSAP animations on unmount
  }, [type]); // eslint-disable-line react-hooks/exhaustive-deps
};

// ── Magnetic button hook ─────────────────────────────────────────────────────
/**
 * Gives a button element a subtle magnetic cursor-follow effect.
 * @param {React.RefObject} ref — button DOM ref
 * @param {object} opts         — { strength: 0.35, ease: 0.1 }
 */
export const useMagneticButton = (ref, opts = {}) => {
  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;
    const el = ref.current;
    const strength = opts.strength ?? 0.35;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: 'power2.out', force3D: true });
    };

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)', force3D: true });
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      gsap.killTweensOf(el);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
};
