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
        {/* Encabezado */}
        <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
              Catálogo
            </p>
            <h1 className="mt-2 font-display text-6xl text-balance">
              Todo en la{' '}
              <span className="relative inline-block">
                colección.
                <span
                  className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full"
                  style={{ backgroundColor: '#f5c200' }}
                />
              </span>
            </h1>
          </div>
          <ProductsSearch />
        </section>

        {/* Filtros de categoría */}
        <div className="flex flex-wrap gap-2.5">
          <Link
            className={`rounded-full border px-5 py-2 text-sm font-medium transition-all duration-200 ${
              !activeCategory
                ? 'border-black bg-black text-white'
                : 'border-black/15 text-foreground hover:border-[#f5c200] hover:bg-[#f5c200] hover:text-black'
            }`}
            href={buildCatalogHref()}
          >
            Todos
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

        {/* Grilla de productos */}
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
            actionLabel="Restablecer catálogo"
            description="Ningún producto coincide con esa categoría y búsqueda. Intenta un término más amplio o limpia el filtro actual."
            eyebrow="Sin resultados"
            title="Nada encontrado aún."
          />
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
