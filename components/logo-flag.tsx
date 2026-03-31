'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

// Colores de la bandera de Venezuela
const YELLOW = '#FFD100';
const BLUE = '#003DA5';
const RED = '#CC0001';

export function LogoFlag({ className = '' }: { className?: string }) {
  const flagRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Animación de ondeo: cada franja se mueve ligeramente distinto
      // para simular la tela moviéndose por el viento
      const stripes = flagRef.current?.querySelectorAll('.flag-stripe');
      if (!stripes) return;

      // Animación principal de la bandera completa
      gsap.to(flagRef.current, {
        skewY: 2.5,
        scaleX: 0.95,
        duration: 1.1,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      // Cada franja ondea con un desfase (stagger effect)
      stripes.forEach((stripe, i) => {
        gsap.to(stripe, {
          scaleY: 1.08,
          skewX: i % 2 === 0 ? 4 : -4,
          duration: 0.9 + i * 0.15,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: i * 0.12,
        });
      });

      // Las estrellas de la bandera parpadean suavemente
      gsap.to('.flag-stars', {
        opacity: 0.6,
        scale: 0.9,
        duration: 1.4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    },
    { scope: flagRef }
  );

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Bandera */}
      <div
        ref={flagRef}
        className="relative h-6 w-10 overflow-hidden rounded-sm shadow-md"
        style={{ transformOrigin: 'left center' }}
        aria-hidden="true"
      >
        {/* Franja amarilla */}
        <div
          className="flag-stripe absolute left-0 right-0 top-0"
          style={{
            height: '40%',
            backgroundColor: YELLOW,
            transformOrigin: 'left center',
          }}
        />
        {/* Franja azul */}
        <div
          className="flag-stripe absolute left-0 right-0"
          style={{
            top: '40%',
            height: '30%',
            backgroundColor: BLUE,
            transformOrigin: 'left center',
          }}
        />
        {/* Franja roja */}
        <div
          className="flag-stripe absolute left-0 right-0 bottom-0"
          style={{
            top: '70%',
            height: '30%',
            backgroundColor: RED,
            transformOrigin: 'left center',
          }}
        />
        {/* Arco de estrellas (simplificado) */}
        <div
          className="flag-stars pointer-events-none absolute inset-0 flex items-center justify-center"
          style={{ top: '38%', height: '30%' }}
        >
          <div className="flex gap-[1.5px]">
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                style={{
                  display: 'block',
                  width: 2,
                  height: 2,
                  borderRadius: '50%',
                  backgroundColor: 'white',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Texto del logo */}
      <span className="logo-text font-display text-2xl tracking-tight">
        LosRoquesStore
      </span>
    </div>
  );
}
