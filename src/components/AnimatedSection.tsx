import type { ReactNode } from 'react';
import { m, useReducedMotion } from 'framer-motion';
export default function AnimatedSection({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <m.section
      id={id}
      className={className}
      initial={false}
      whileInView={reduced ? undefined : { y: [14, 0], opacity: [0.7, 1] }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </m.section>
  );
}
