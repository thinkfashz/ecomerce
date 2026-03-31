import Link from 'next/link';
import { EmptyState } from '@/components/empty-state';
import { ProductCard } from '@/components/product-card';
import { ProductsSearch } from '@/components/products-search';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { AnimatedGrid } from '@/components/gsap-animated-grid';
import { getCategories, getProducts } from '@/lib/store';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const params = await searchParams;
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ category: params.category, search: params.search }),
  ]);
  const activeCategory = params.category ?? null;

  function buildCatalogHref(category?: string) {
    const nextParams = new URLSearchParams();
    if (category) nextParams.set('category', category);
    if (params.search?.trim()) nextParams.set('search', params.search.trim());
    const query = nextParams.toString();
    return query ? `/products?${query}` : '/products';
  }

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <main className="page-shell space-y-10 py-12">
        {/* Header */}
        <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
              Catalog
            </p>
            <h1 className="mt-2 font-display text-6xl text-balance">
              Everything in the{' '}
              <span className="relative inline-block">
                collection.
                <span
                  className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full"
                  style={{ backgroundColor: '#f5c200' }}
                />
              </span>
            </h1>
          </div>
          <ProductsSearch />
        </section>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2.5">
          <Link
            className={`rounded-full border px-5 py-2 text-sm font-medium transition-all duration-200 ${
              !activeCategory
                ? 'border-black bg-black text-white'
                : 'border-black/15 text-foreground hover:border-[#f5c200] hover:bg-[#f5c200] hover:text-black'
            }`}
            href={buildCatalogHref()}
          >
            All
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              className={`rounded-full border px-5 py-2 text-sm font-medium transition-all duration-200 ${
                activeCategory === category.slug
                  ? 'border-black bg-black text-white'
                  : 'border-black/15 text-foreground hover:border-[#f5c200] hover:bg-[#f5c200] hover:text-black'
              }`}
              href={buildCatalogHref(category.slug)}
            >
              {category.name}
            </Link>
          ))}
        </div>

        {/* Product grid */}
        {products.length ? (
          <AnimatedGrid className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                imageFetchPriority={index === 0 ? 'high' : 'auto'}
                imageLoading={index === 0 ? 'eager' : 'lazy'}
              />
            ))}
          </AnimatedGrid>
        ) : (
          <EmptyState
            actionHref="/products"
            actionLabel="Reset catalog"
            description="No products matched that category and search combination. Try a broader term or clear the current filter."
            eyebrow="No matches"
            title="Nothing surfaced yet."
          />
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
