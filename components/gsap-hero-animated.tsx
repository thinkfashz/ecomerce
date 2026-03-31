'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export function GsapHeroAnimated() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo('.hero-eyebrow', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 })
        .fromTo(
          '.hero-title',
          { opacity: 0, y: 60, clipPath: 'inset(100% 0 0 0)' },
          { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)', duration: 0.9 },
          '-=0.3'
        )
        .fromTo(
          '.hero-desc',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.4'
        )
        .fromTo(
          '.hero-cta',
          { opacity: 0, y: 20, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6 },
          '-=0.3'
        )
        .fromTo(
          '.hero-badge',
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.5 },
          '-=0.4'
        )
        .fromTo(
          '.hero-panel',
          { opacity: 0, x: 60, scale: 0.96 },
          { opacity: 1, x: 0, scale: 1, duration: 0.9, ease: 'power2.out' },
          0.2
        );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="page-shell grid gap-8 py-16 lg:grid-cols-[1fr_1fr] lg:py-24 lg:gap-16 items-center"
    >
      {/* Left: text */}
      <div className="flex flex-col gap-8">
        <div className="space-y-5">
          <p className="hero-eyebrow inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
            <span className="h-px w-8 bg-accent" />
            Everyday pieces
          </p>
          <h1 className="hero-title max-w-xl font-display text-6xl leading-none text-balance sm:text-7xl lg:text-[5.5rem] overflow-hidden">
            Modern essentials for a{' '}
            <span className="relative">
              quieter
              <span
                className="absolute bottom-2 left-0 h-[6px] w-full rounded-full"
                style={{ backgroundColor: '#f5c200' }}
              />
            </span>{' '}
            home.
          </h1>
          <p className="hero-desc max-w-md text-base text-muted-foreground sm:text-lg leading-relaxed">
            Thoughtful furniture, lighting, and tableware designed to settle naturally into daily life.
          </p>
        </div>

        <div className="hero-cta flex flex-wrap gap-3 items-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(245,194,0,0.4)]"
            style={{ backgroundColor: '#f5c200', color: '#0a0a0a' }}
          >
            Shop collection
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full border border-black/15 px-6 py-3.5 text-sm font-medium hover:bg-black hover:text-white transition-all duration-300"
          >
            View all
          </Link>
        </div>

        <div className="hero-badge flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-7 w-7 rounded-full border-2 border-white bg-black/10 -ml-2 first:ml-0"
                style={{ zIndex: 4 - i }}
              />
            ))}
          </div>
          <span>500+ happy customers this month</span>
        </div>
      </div>

      {/* Right: visual panel */}
      <div className="hero-panel relative">
        <div className="glass-panel overflow-hidden p-4">
          <div className="grid gap-3 md:grid-cols-[1.4fr_0.6fr]">
            <div
              className="relative min-h-[380px] overflow-hidden rounded-xl bg-muted"
              style={{
                backgroundImage:
                  'url(https://images.unsplash.com/photo-1499933374294-4584851497cc?auto=format&fit=crop&w=1600&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="flex flex-col gap-3">
              <div className="flex-1 rounded-xl bg-black p-5 text-white">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">New edit</p>
                <ul className="mt-4 space-y-2 text-xs text-white/70 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    Soft living room anchors
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    Bedroom layers
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    Dining essentials
                  </li>
                </ul>
              </div>
              <div className="rounded-xl p-5" style={{ backgroundColor: '#f5c200' }}>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/60">InsForge</p>
                <p className="mt-3 font-display text-3xl text-black">Simple flow</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating accent dot */}
        <div
          className="absolute -top-4 -right-4 h-16 w-16 rounded-full opacity-80 blur-sm"
          style={{ backgroundColor: '#f5c200' }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
