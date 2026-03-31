'use client';

import { Loader2 } from 'lucide-react';
import { startTransition, useState } from 'react';
import { toast } from 'sonner';
import {
  ADDRESS_FORM_FIELDS,
  createEmptyAddressFields,
  formatSavedAddressInline,
  type AddressFieldState,
} from '@/lib/address-form';
import { placeOrderAction } from '@/lib/store-actions';
import type { CartItem, SavedAddress } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function CheckoutForm({
  addresses,
  userEmail,
  totalCents,
  cartItems,
}: {
  addresses: SavedAddress[];
  userEmail: string;
  totalCents: number;
  cartItems: CartItem[];
}) {
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    addresses.find((address) => address.is_default_shipping)?.id ?? addresses[0]?.id ?? null,
  );
  const [fields, setFields] = useState<AddressFieldState>(() => createEmptyAddressFields());
  const [note, setNote] = useState('');
  const [useNewAddress, setUseNewAddress] = useState(addresses.length === 0);
  const [isPending, setIsPending] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsPending(true);

    startTransition(async () => {
      try {
        // 1. Crear el pedido (payment_status: pending)
        const { orderId } = await placeOrderAction({
          addressId: useNewAddress ? undefined : selectedAddressId ?? undefined,
          address: useNewAddress ? fields : undefined,
          note: note.trim() || undefined,
        });

        // 2. Crear la preferencia de pago en Mercado Pago
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            email: userEmail,
            totalCents,
            items: cartItems.map((item) => ({
              id: item.product?.id ?? item.id,
              title: item.product?.name ?? 'Producto',
              quantity: item.quantity,
              unitPriceCents: item.unit_price_cents,
            })),
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error((data as { error?: string }).error ?? 'No se pudo iniciar el pago.');
        }

        const { init_point } = await res.json() as { init_point: string };

        // 3. Redirigir a Mercado Pago para completar el pago
        window.location.href = init_point;
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Error al procesar el pago.');
        setIsPending(false);
      }
    });
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {addresses.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-3xl">Envío</h2>
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setUseNewAddress((value) => !value)}
            >
              {useNewAddress ? 'Usar dirección guardada' : 'Agregar nueva dirección'}
            </button>
          </div>

          {!useNewAddress ? (
            <div className="grid gap-3">
              {addresses.map((address) => (
                <label
                  key={address.id}
                  className="flex cursor-pointer items-start gap-3 rounded-[22px] border border-border bg-white/55 p-4"
                >
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddressId === address.id}
                    onChange={() => setSelectedAddressId(address.id)}
                  />
                  <div className="text-sm">
                    <p className="font-medium">{address.recipient_name}</p>
                    <p className="text-muted-foreground">{formatSavedAddressInline(address)}</p>
                  </div>
                </label>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {useNewAddress ? (
        <div className="space-y-4">
          <h2 className="font-display text-3xl">Dirección de envío</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {ADDRESS_FORM_FIELDS.map((field) => (
              <label key={field.key} className="space-y-2.5 text-sm">
                <span className="inline-flex items-center gap-1">
                  {field.label}
                  {field.required ? <span className="text-destructive">*</span> : null}
                </span>
                <input
                  className="h-11 w-full rounded-2xl border border-input bg-background px-4"
                  required={field.required}
                  value={fields[field.key]}
                  onChange={(event) =>
                    setFields((current) => ({
                      ...current,
                      [field.key]: event.target.value,
                    }))
                  }
                />
              </label>
            ))}
          </div>
        </div>
      ) : null}

      <label className="block space-y-2.5 text-sm">
        <span>Nota del pedido</span>
        <textarea
          className="min-h-28 w-full rounded-[22px] border border-input bg-background px-4 py-3"
          placeholder="Instrucciones de entrega o notas especiales"
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
      </label>

      {/* Botón de pago con Mercado Pago */}
      <div className="space-y-3">
        <Button
          className="w-full rounded-full px-8 py-3 text-sm font-semibold sm:w-auto"
          disabled={isPending}
          type="submit"
          style={{ backgroundColor: '#009ee3', color: '#fff' }}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Preparando pago…
            </>
          ) : (
            'Pagar con Mercado Pago'
          )}
        </Button>
        <p className="text-xs text-muted-foreground">
          Serás redirigido de forma segura a Mercado Pago para completar el pago.
        </p>
      </div>
    </form>
  );
}
