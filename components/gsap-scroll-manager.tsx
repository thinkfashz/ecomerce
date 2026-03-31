'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function GsapScrollManager() {
  const progressBarRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // --- Scroll progress bar ---
    const bar = progressBarRef.current;
    if (bar) {
      gsap.to(bar, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          start: 0,
          end: 'max',
          scrub: 0.3,
        },
      });
    }

    // --- Header reactive to dark sections ---
    const darkSections = document.querySelectorAll('[data-theme="dark"]');
    const header = document.getElementById('site-header');

    if (header) {
      darkSections.forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 72px',
          end: 'bottom 72px',
          onEnter: () => header.setAttribute('data-theme', 'dark'),
          onLeave: () => header.setAttribute('data-theme', 'light'),
          onEnterBack: () => header.setAttribute('data-theme', 'dark'),
          onLeaveBack: () => header.setAttribute('data-theme', 'light'),
        });
      });
    }

    // --- Section headings reveal on scroll ---
    const sectionHeadings = document.querySelectorAll('.section-heading');
    sectionHeadings.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          },
        }
      );
    });

    // --- Eyebrow labels stagger in ---
    const eyebrows = document.querySelectorAll('.section-eyebrow');
    eyebrows.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
          },
        }
      );
    });

    // --- Category cards reveal ---
    const categoryCards = document.querySelectorAll('.category-card');
    if (categoryCards.length) {
      gsap.fromTo(
        categoryCards,
        { opacity: 0, y: 60, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: categoryCards[0],
            start: 'top 85%',
          },
        }
      );
    }
  });

  return (
    <div
      ref={progressBarRef}
      className="scroll-progress-bar"
      aria-hidden="true"
    />
  );
}
