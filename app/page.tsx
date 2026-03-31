import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { GsapHeroAnimated } from '@/components/gsap-hero-animated';
import { AnimatedGrid } from '@/components/gsap-animated-grid';
import { getCategories, getFeaturedProducts, getProducts } from '@/lib/store';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [categories, featuredProducts, latestProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
    getProducts(),
  ]);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        {/* ── HERO: White section ────────────────────────── */}
        <section className="section-light overflow-hidden relative">
          {/* Subtle grid background */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(#0a0a0a 1px, transparent 1px), linear-gradient(90deg, #0a0a0a 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
            aria-hidden="true"
          />
          <GsapHeroAnimated />
        </section>

        {/* ── FEATURED PRODUCTS: Dark section ───────────── */}
        <section className="section-dark py-20 lg:py-28" data-theme="dark">
          <div className="page-shell space-y-12">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="section-eyebrow text-xs font-semibold uppercase tracking-[0.4em] text-white/40">
                  Featured edit
                </p>
                <h2 className="section-heading mt-3 font-display text-5xl text-white lg:text-6xl text-balance">
                  Pieces chosen to feel warm, useful, and lived in.
                </h2>
              </div>
              <Link
                href="/products"
                className="link-underline shrink-0 text-sm text-white/50 hover:text-accent transition-colors"
              >
                Browse every product →
              </Link>
            </div>

            <AnimatedGrid className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} dark />
              ))}
            </AnimatedGrid>
          </div>
        </section>

        {/* ── CATEGORIES: Yellow section ─────────────────── */}
        <section className="section-yellow py-20 lg:py-28" data-theme="yellow">
          <div className="page-shell space-y-10">
            <div>
              <p className="section-eyebrow text-xs font-semibold uppercase tracking-[0.4em] text-black/50">
                Browse by room
              </p>
              <h2 className="section-heading mt-3 font-display text-5xl text-black lg:text-6xl">
                Shop the collection by category.
              </h2>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className="category-card group flex min-h-60 flex-col justify-between rounded-xl border-2 border-black/10 bg-black p-6 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
                >
                  <div
                    className="size-10 rounded-full border-2 border-white/20"
                    style={{ backgroundColor: category.accent_color ?? '#f5c200' }}
                  />
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/40">Category</p>
                    <h3 className="mt-2 font-display text-4xl text-white transition-transform group-hover:translate-x-1 duration-300">
                      {category.name}
                    </h3>
                    <p className="mt-2 max-w-sm text-sm text-white/60">{category.description}</p>
                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent">
                      Shop now <ArrowRight className="size-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── LATEST PRODUCTS: Dark section ─────────────── */}
        <section className="section-dark py-20 lg:py-28" data-theme="dark">
          <div className="page-shell space-y-12">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="section-eyebrow text-xs font-semibold uppercase tracking-[0.4em] text-white/40">
                  New in store
                </p>
                <h2 className="section-heading mt-3 font-display text-5xl text-white lg:text-6xl">
                  Fresh arrivals for living, dining, and rest.
                </h2>
              </div>
              <Link
                href="/products"
                className="link-underline shrink-0 text-sm text-white/50 hover:text-accent transition-colors"
              >
                See all arrivals →
              </Link>
            </div>

            <AnimatedGrid className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {latestProducts.slice(0, 3).map((product) => (
                <ProductCard key={product.id} product={product} dark />
              ))}
            </AnimatedGrid>
          </div>
        </section>

        {/* ── CTA STRIP: Yellow ─────────────────────────── */}
        <section className="section-yellow py-16">
          <div className="page-shell flex flex-col items-center text-center gap-6">
            <h2 className="font-display text-5xl text-black lg:text-6xl max-w-2xl">
              Ready to transform your space?
            </h2>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-black px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(0,0,0,0.4)]"
            >
              Explore the full collection
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
