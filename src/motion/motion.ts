import { useLayoutEffect, useState, useEffect, type RefObject } from 'react';

const effects = {
  word: { time: 'hero', frames: [{ transform: 'translateY(85%) rotate(2deg)' }, { transform: 'none' }] },
  line: { time: 'reveal', frames: [{ opacity: 1, transform: 'translateX(-24px)', clipPath: 'inset(0 20% 0 0)' }, { opacity: 1, transform: 'none', clipPath: 'inset(0)' }] },
  rise: { time: 'reveal', frames: [{ opacity: 1, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }] },
  right: { time: 'reveal', frames: [{ opacity: 1, transform: 'translateX(18px)' }, { opacity: 1, transform: 'none' }] },
  picture: { time: 'picture', frames: [{ clipPath: 'inset(0 92% 0 0)' }, { clipPath: 'inset(0)' }] },
  'picture-reverse': { time: 'picture', frames: [{ clipPath: 'inset(0 0 0 92%)' }, { clipPath: 'inset(0)' }] },
  button: { time: 'control', frames: [{ opacity: 1, transform: 'translateY(14px) scale(.96)' }, { opacity: 1, transform: 'none' }] },
  page: { time: 'page', frames: [{ opacity: 1, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }] },
  'menu-open': { time: 'control', frames: [{ opacity: 1, transform: 'translateY(-12px) scale(.97)', clipPath: 'inset(0 0 85% 0)' }, { opacity: 1, transform: 'none', clipPath: 'inset(0)' }] },
  'menu-close': { time: 'exit', frames: [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-8px) scale(.98)' }] },
  'gallery-open': { time: 'control', frames: [{ opacity: 1, transform: 'translateY(28px) scale(.95)' }, { opacity: 1, transform: 'none' }] },
  'gallery-close': { time: 'exit', frames: [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(16px) scale(.97)' }] },
  'image-next': { time: 'control', frames: [{ opacity: 1, transform: 'translateX(5%) scale(.98)' }, { opacity: 1, transform: 'none' }] },
  'image-previous': { time: 'control', frames: [{ opacity: 1, transform: 'translateX(-5%) scale(.98)' }, { opacity: 1, transform: 'none' }] },
  counter: { time: 'control', frames: [{ opacity: 1, transform: 'translateY(-50%)' }, { opacity: 1, transform: 'none' }] },
} satisfies Record<string, { time: string; frames: Keyframe[] }>;

export type MotionEffect = keyof typeof effects;

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);
  return matches;
}

export function playMotion(element: Element | null, effect: MotionEffect, delay = 0): Animation | null {
  if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof element.animate !== 'function') return null;
  const preset = effects[effect];
  const style = getComputedStyle(element);
  try {
    const animation = element.animate(preset.frames, {
      id: `portfolio-${effect}`,
      duration: parseFloat(style.getPropertyValue(`--motion-${preset.time}`)) || 0,
      delay,
      easing: style.getPropertyValue('--motion-ease').trim() || 'ease-out',
      // Backwards fill holds the stagger's first frame; normal CSS always remains the final fallback.
      fill: 'backwards',
    });
    void animation.finished.catch(() => {});
    return animation;
  } catch {
    return null;
  }
}

export function motionFinished(animation: Animation | null) {
  return animation ? animation.finished.then(() => {}, () => {}) : Promise.resolve();
}

export function usePageMotion(scope: RefObject<HTMLElement | null>, page: string) {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  useLayoutEffect(() => {
    const root = scope.current;
    if (!root || reduced) return;
    const running = new Set<Animation>();
    const active = new Set<HTMLElement>();
    const stagger = parseFloat(getComputedStyle(root).getPropertyValue('--motion-stagger')) || 0;
    let frame = 0;
    const start = (element: HTMLElement) => {
      const effect = element.dataset.motion as MotionEffect;
      if (!(effect in effects)) return;
      const animation = playMotion(element, effect, Math.min(6, Number(element.dataset.order) || 0) * stagger);
      if (animation) {
        running.add(animation);
        void motionFinished(animation).then(() => running.delete(animation));
      }
    };
    const reveal = (element: HTMLElement) => {
      if (element.dataset.motion) start(element);
      if (element.hasAttribute('data-motion-group')) element.querySelectorAll<HTMLElement>('[data-motion]').forEach(start);
    };
    const updateDepth = () => {
      frame = 0;
      const readings = [...active].map(element => ({ element, rect: element.getBoundingClientRect() }));
      for (const { element, rect } of readings) {
        const progress = Math.max(-1, Math.min(1, (innerHeight / 2 - rect.top - rect.height / 2) / innerHeight));
        element.style.setProperty('--image-drift', `${progress * rect.height * 0.025}px`);
      }
    };
    const scheduleDepth = () => { if (!frame) frame = requestAnimationFrame(updateDepth); };
    const observer = typeof IntersectionObserver === 'function' ? new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        reveal(entry.target as HTMLElement);
        observer?.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -5% 0px', threshold: 0.05 }) : null;
    for (const element of root.querySelectorAll<HTMLElement>('[data-motion], [data-motion-group]')) {
      const group = element.parentElement?.closest('[data-motion-group]');
      if (group) continue;
      if (element.hasAttribute('data-start')) reveal(element);
      else observer?.observe(element);
    }
    const depth = typeof IntersectionObserver === 'function' ? new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) active.add(entry.target as HTMLElement);
        else active.delete(entry.target as HTMLElement);
      }
      scheduleDepth();
    }, { rootMargin: '10% 0px' }) : null;
    for (const element of root.querySelectorAll<HTMLElement>('[data-parallax]')) depth?.observe(element);
    const revealFocus = (event: FocusEvent) => {
      const element = (event.target as HTMLElement).closest<HTMLElement>('[data-motion]');
      element?.getAnimations().forEach(animation => { if (animation.id.startsWith('portfolio-')) animation.cancel(); });
    };
    root.addEventListener('focusin', revealFocus);
    window.addEventListener('scroll', scheduleDepth, { passive: true });
    window.addEventListener('resize', scheduleDepth);
    return () => {
      observer?.disconnect();
      depth?.disconnect();
      running.forEach(animation => animation.cancel());
      cancelAnimationFrame(frame);
      root.querySelectorAll<HTMLElement>('[data-parallax]').forEach(element => element.style.removeProperty('--image-drift'));
      root.removeEventListener('focusin', revealFocus);
      window.removeEventListener('scroll', scheduleDepth);
      window.removeEventListener('resize', scheduleDepth);
    };
  }, [scope, page, reduced]);
}
