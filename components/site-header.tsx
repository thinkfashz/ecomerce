import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { AccountDropdown } from '@/components/account-dropdown';
import { LogoFlag } from '@/components/logo-flag';
import { getCurrentAuthState } from '@/lib/auth-state';
import { getActiveCart } from '@/lib/store';
import { cn, getInitials, getViewerLabel } from '@/lib/utils';

const navItems = [
  { href: '/products', label: 'Tienda' },
  { href: '/products?category=living', label: 'Sala' },
  { href: '/products?category=bedroom', label: 'Dormitorio' },
  { href: '/products?category=dining', label: 'Comedor' },
];

export async function SiteHeader({ compact = false }: { compact?: boolean }) {
  const { viewer, accessToken } = await getCurrentAuthState();
  const cart = viewer.isAuthenticated && viewer.id && accessToken
    ? await getActiveCart(viewer.id, accessToken).catch(() => null)
    : null;
  const cartCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const viewerLabel = getViewerLabel(viewer.name, viewer.email);
  const viewerInitials = getInitials(viewerLabel);

  return (
    <header
      id="site-header"
      className={cn(
        'sticky top-0 z-40 border-b bg-white/95 backdrop-blur-xl',
        compact && 'relative bg-transparent'
      )}
      style={{ borderColor: 'rgba(10,10,10,0.08)' }}
    >
      <div className="page-shell flex h-[72px] items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <LogoFlag />
          </Link>

          {/* Nav escritorio */}
          <nav className="hidden items-center gap-6 text-sm md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link relative text-muted-foreground transition-colors hover:text-foreground after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2 sm:gap-3">
          {viewer.isAuthenticated ? (
            <AccountDropdown
              avatarUrl={viewer.avatarUrl}
              email={viewer.email}
              viewerInitials={viewerInitials}
              viewerLabel={viewerLabel}
            />
          ) : (
            <Link
              href="/auth/sign-in"
              className="signin-btn inline-flex rounded-full border px-4 py-2 text-sm transition-all duration-300 hover:bg-foreground hover:text-background"
              style={{ borderColor: 'rgba(10,10,10,0.15)' }}
            >
              Iniciar sesión
            </Link>
          )}

          <Link
            href="/cart"
            className="cart-btn inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: '#0a0a0a', color: '#ffffff' }}
          >
            <ShoppingBag className="size-4" />
            Carrito
            {cartCount > 0 && (
              <span
                className="rounded-full px-2 py-0.5 text-xs font-bold"
                style={{ backgroundColor: '#f5c200', color: '#0a0a0a' }}
              >
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
