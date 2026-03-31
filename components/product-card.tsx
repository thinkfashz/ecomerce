import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

export function ProductCard({
  product,
  imageLoading = 'lazy',
  imageFetchPriority = 'auto',
  dark = false,
}: {
  product: Product;
  imageLoading?: 'lazy' | 'eager';
  imageFetchPriority?: 'auto' | 'high' | 'low';
  dark?: boolean;
}) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className={`product-card group relative overflow-hidden rounded-xl border transition-all duration-400 hover:-translate-y-1 ${
        dark
          ? 'border-white/8 bg-white/4 hover:border-[#f5c200]/40 hover:shadow-[0_20px_60px_rgba(245,194,0,0.12)]'
          : 'border-black/8 bg-white hover:border-[#f5c200]/40 hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)]'
      }`}
      style={dark ? { backgroundColor: 'rgba(255,255,255,0.04)' } : {}}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-black/5">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.image_alt || product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.05]"
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
            loading={imageLoading}
            fetchPriority={imageFetchPriority}
          />
        ) : null}

        {/* Yellow accent on hover */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-1 w-0 bg-[#f5c200] transition-all duration-500 group-hover:w-full"
          aria-hidden="true"
        />

        {/* Badge */}
        {product.badge ? (
          <div className="absolute left-3 top-3">
            <span className="rounded-full bg-[#f5c200] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-black">
              {product.badge}
            </span>
          </div>
        ) : null}
      </div>

      {/* Info */}
      <div className="space-y-2.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className={`font-display text-2xl leading-none ${dark ? 'text-white' : 'text-foreground'}`}>
            {product.name}
          </h3>
          {product.category?.name ? (
            <span className={`text-xs ${dark ? 'text-white/40' : 'text-muted-foreground'}`}>
              {product.category.name}
            </span>
          ) : null}
        </div>

        {product.short_description ? (
          <p className={`line-clamp-2 min-h-10 text-xs leading-relaxed ${dark ? 'text-white/50' : 'text-muted-foreground'}`}>
            {product.short_description}
          </p>
        ) : null}

        <div className={`flex items-center justify-between border-t pt-2.5 text-sm ${dark ? 'border-white/8' : 'border-black/8'}`}>
          <div className="flex items-center gap-2">
            <span className={`font-semibold ${dark ? 'text-white' : 'text-foreground'}`}>
              {formatCurrency(product.price_cents)}
            </span>
            {product.compare_at_price_cents ? (
              <span className={`text-xs line-through ${dark ? 'text-white/30' : 'text-muted-foreground'}`}>
                {formatCurrency(product.compare_at_price_cents)}
              </span>
            ) : null}
          </div>
          <span className={`text-xs ${dark ? 'text-white/30' : 'text-muted-foreground'}`}>
            {product.inventory_count > 0 ? `${product.inventory_count} left` : 'Sold out'}
          </span>
        </div>
      </div>
    </Link>
  );
}
