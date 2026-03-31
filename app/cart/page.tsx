import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CartItemRow } from '@/components/cart-item-row';
import { EmptyState } from '@/components/empty-state';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { getCurrentAuthState } from '@/lib/auth-state';
import { calculateCartTotals, getActiveCart } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function CartPage() {
  const { viewer, accessToken } = await getCurrentAuthState();

  if (!viewer.isAuthenticated || !viewer.id) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="page-shell py-16">
          <EmptyState
            actionHref="/auth/sign-in"
            actionLabel="Ir a iniciar sesión"
            className="mx-auto max-w-xl"
            description="El carrito se guarda por usuario, por lo que necesitas iniciar sesión antes de crear uno."
            eyebrow="Carrito"
            title="Inicia sesión para ver tu carrito."
          />
        </main>
      </div>
    );
  }

  if (!accessToken) {
    redirect('/auth/sign-in');
  }

  const cart = await getActiveCart(viewer.id, accessToken);
  const totals = calculateCartTotals(cart?.items ?? []);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="page-shell grid gap-8 py-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-5">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Carrito</p>
            <h1 className="mt-2 font-display text-6xl">Tu selección actual.</h1>
          </div>

          {cart?.items.length ? (
            cart.items.map((item) => <CartItemRow key={item.id} item={item} />)
          ) : (
            <EmptyState
              actionHref="/products"
              actionLabel="Ver productos"
              description="Comienza en la página de un producto, elige una configuración y agrégalo aquí para continuar al pago."
              eyebrow="Carrito"
              title="Tu carrito está vacío."
            />
          )}
        </section>

        <aside className="glass-panel h-fit space-y-5 p-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Resumen</p>
            <h2 className="mt-2 font-display text-4xl">Total del pedido</h2>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Envío</span>
              <span>{formatCurrency(totals.shipping)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Impuesto</span>
              <span>{formatCurrency(totals.tax)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3 font-medium">
              <span>Total</span>
              <span>{formatCurrency(totals.total)}</span>
            </div>
          </div>

          <Link
            aria-disabled={!cart?.items.length}
            className={`inline-flex h-12 w-full items-center justify-center rounded-full text-sm font-medium transition ${
              cart?.items.length
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'pointer-events-none bg-primary/50 text-primary-foreground/80'
            }`}
            href="/checkout"
          >
            Continuar al pago
          </Link>
        </aside>
      </main>

      <SiteFooter />
    </div>
  );
}
