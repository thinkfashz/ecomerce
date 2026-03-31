'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface AnimatedGridProps {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}

export function AnimatedGrid({ children, className = '', dark = false }: AnimatedGridProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = ref.current?.querySelectorAll('.product-card');
      if (!cards?.length) return;

      gsap.set(cards, { opacity: 0, y: 48, scale: 0.97 });

      ScrollTrigger.batch(cards, {
        onEnter: (elements) => {
          gsap.to(elements, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            stagger: 0.1,
            ease: 'power3.out',
          });
        },
        onLeaveBack: (elements) => {
          gsap.to(elements, {
            opacity: 0,
            y: 48,
            scale: 0.97,
            duration: 0.4,
            stagger: 0.05,
            ease: 'power2.in',
          });
        },
        start: 'top 90%',
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
