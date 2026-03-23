/**
 * src/hooks/useLenis.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Initialises Lenis smooth scroll and syncs it with the GSAP ticker so
 * ScrollTrigger calculations always use the virtual scroll position.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '../lib/gsap';

let lenisInstance = null; // singleton so HMR doesn't double-init

export const useLenis = () => {
  useEffect(() => {
    // Re-use existing instance on HMR
    if (lenisInstance) return;

    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo easing
      smooth: true,
      mouseMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    // Keep GSAP ticker & ScrollTrigger in sync with Lenis RAF
    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });

    // Eliminate GSAP lag compensation (Lenis handles timing)
    gsap.ticker.lagSmoothing(0);

    // Notify ScrollTrigger of virtual scroll position on every frame
    lenisInstance.on('scroll', ScrollTrigger.update);

    // Tell ScrollTrigger to use Lenis for scroll position reads
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length && lenisInstance) {
          lenisInstance.scrollTo(value, { immediate: true });
        }
        return lenisInstance ? lenisInstance.scroll : window.scrollY;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: document.documentElement.style.transform ? 'transform' : 'fixed',
    });

    // Refresh all ScrollTriggers once the proxy is set
    ScrollTrigger.addEventListener('refresh', () => lenisInstance?.scrollTo(lenisInstance.scroll, { immediate: true }));
    ScrollTrigger.refresh();

    return () => {
      lenisInstance?.destroy();
      lenisInstance = null;
      gsap.ticker.remove(() => {});
    };
  }, []);
};
