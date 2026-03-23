/**
 * src/lib/gsap.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Central GSAP configuration — import this everywhere instead of 'gsap' directly.
 * Registers ScrollTrigger once and exports reusable animation presets.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Global defaults ────────────────────────────────────────────────────────────
gsap.defaults({ ease: 'power3.out', duration: 0.9 });

ScrollTrigger.config({
  // Avoid layout recalculations on resize by debouncing
  autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
});

// ── Reduced motion guard ───────────────────────────────────────────────────────
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Reusable animation presets ─────────────────────────────────────────────────

/**
 * Fade + slide up a single element on scroll.
 * Returns the ScrollTrigger instance so callers can kill() it on cleanup.
 */
export const fadeUp = (el, options = {}) => {
  if (!el || prefersReducedMotion()) return null;
  return gsap.fromTo(
    el,
    { y: 40, opacity: 0, force3D: true },
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
        ...options.scrollTrigger,
      },
    }
  );
};

/**
 * Stagger-reveal a list of elements on scroll.
 */
export const staggerIn = (els, options = {}) => {
  if (!els || !els.length || prefersReducedMotion()) return null;
  return gsap.fromTo(
    els,
    { y: 40, opacity: 0, force3D: true },
    {
      y: 0,
      opacity: 1,
      stagger: options.stagger ?? 0.1,
      duration: options.duration ?? 0.8,
      ease: options.ease ?? 'power3.out',
      scrollTrigger: {
        trigger: els[0],
        start: options.start ?? 'top 88%',
        once: true,
        markers: import.meta.env.DEV && options.markers,
        ...options.scrollTrigger,
      },
    }
  );
};

/**
 * Scale-in animation (used for icons / badges).
 */
export const scaleIn = (el, options = {}) => {
  if (!el || prefersReducedMotion()) return null;
  return gsap.fromTo(
    el,
    { scale: 0.85, opacity: 0, force3D: true },
    {
      scale: 1,
      opacity: 1,
      duration: options.duration ?? 0.7,
      delay: options.delay ?? 0,
      ease: 'back.out(1.4)',
      scrollTrigger: {
        trigger: el,
        start: options.start ?? 'top 90%',
        once: true,
        ...options.scrollTrigger,
      },
    }
  );
};

/**
 * Animate a DOM element's textContent as a counting number.
 * @param {HTMLElement} el   - element whose innerText will be updated
 * @param {number}      end  - target number
 * @param {object}      opts - duration, prefix, suffix, decimals
 */
export const counterUp = (el, end, opts = {}) => {
  if (!el || prefersReducedMotion()) {
    if (el) el.textContent = opts.prefix
      ? `${opts.prefix}${end}${opts.suffix ?? ''}`
      : `${end}${opts.suffix ?? ''}`;
    return null;
  }
  const obj = { val: 0 };
  return gsap.to(obj, {
    val: end,
    duration: opts.duration ?? 2,
    ease: 'power2.out',
    snap: { val: opts.decimals ? Math.pow(10, -opts.decimals) : 1 },
    onUpdate() {
      const v = opts.decimals ? obj.val.toFixed(opts.decimals) : Math.round(obj.val);
      el.textContent = `${opts.prefix ?? ''}${v.toLocaleString()}${opts.suffix ?? ''}`;
    },
    scrollTrigger: {
      trigger: el,
      start: opts.start ?? 'top 88%',
      once: true,
      ...opts.scrollTrigger,
    },
  });
};

export { gsap, ScrollTrigger };
