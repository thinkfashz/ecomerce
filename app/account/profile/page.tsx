import { AccountHeader } from '@/components/account-header';
import { AddressBook } from '@/components/address-book';
import { SiteHeader } from '@/components/site-header';
import { requireAuthenticatedSession } from '@/lib/auth-session';
import { getSavedAddresses } from '@/lib/store';
import { getInitials } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const { viewer, accessToken } = await requireAuthenticatedSession();

  const label = viewer.name?.trim() || viewer.email?.trim() || 'Cuenta';
  const initials = getInitials(label);
  const addresses = await getSavedAddresses(viewer.id, accessToken);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="page-shell space-y-8 py-10">
        <AccountHeader
          activeTab="profile"
          description="Mantén tu perfil de cliente actualizado y gestiona las direcciones guardadas que aparecen en el proceso de pago."
          title="Perfil."
        />

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="glass-panel grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="flex size-24 items-center justify-center overflow-hidden rounded-full bg-secondary text-2xl font-medium text-secondary-foreground">
              {viewer.avatarUrl ? (
                <img
                  alt={label}
                  className="h-full w-full object-cover"
                  height={96}
                  referrerPolicy="no-referrer"
                  src={viewer.avatarUrl}
                  width={96}
                />
              ) : (
                initials
              )}
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Nombre</p>
                <p className="mt-2 text-lg text-foreground">{viewer.name || 'No configurado'}</p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Correo</p>
                <p className="mt-2 text-lg text-foreground break-all">{viewer.email}</p>
              </div>
            </div>
          </div>

          <div className="glass-panel space-y-4 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Libreta de direcciones</p>
            <h2 className="font-display text-4xl">{addresses.length} {addresses.length === 1 ? 'dirección guardada' : 'direcciones guardadas'}</h2>
            <p className="text-sm text-muted-foreground">
              Establece aquí tus preferencias de envío y facturación para que el pago comience con el destino correcto.
            </p>
          </div>
        </section>

        <AddressBook addresses={addresses} />
      </main>
    </div>
  );
}
