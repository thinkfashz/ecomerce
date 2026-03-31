import { NextRequest, NextResponse } from 'next/server';
import { mpPreference } from '@/lib/mercadopago';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, email, totalCents, items } = body as {
      orderId: string;
      email: string;
      totalCents: number;
      items: Array<{ id: string; title: string; quantity: number; unitPriceCents: number }>;
    };

    if (!orderId || !email || !totalCents) {
      return NextResponse.json({ error: 'Faltan campos requeridos.' }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

    // Construir los ítems para Mercado Pago.
    // Los precios en la DB están en centavos (1 peso CLP = 100 "cents").
    // unit_price en CLP debe ser entero.
    const mpItems = items?.length
      ? items.map((item) => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          unit_price: Math.round(item.unitPriceCents / 100),
          currency_id: 'CLP',
        }))
      : [
          {
            id: orderId,
            title: 'Pedido LosRoquesStore',
            quantity: 1,
            unit_price: Math.round(totalCents / 100),
            currency_id: 'CLP',
          },
        ];

    const preference = await mpPreference.create({
      body: {
        external_reference: orderId,
        items: mpItems,
        payer: { email },
        back_urls: {
          success: `${appUrl}/account/orders?placed=${orderId}`,
          failure: `${appUrl}/checkout?error=pago_rechazado`,
          pending: `${appUrl}/account/orders?placed=${orderId}`,
        },
        auto_return: 'approved',
        notification_url: `${appUrl}/api/webhooks/mercadopago`,
        statement_descriptor: 'LosRoquesStore',
        metadata: { order_id: orderId },
      },
    });

    return NextResponse.json({ init_point: preference.init_point });
  } catch (error) {
    console.error('[/api/checkout] Error al crear preferencia MP:', error);
    return NextResponse.json(
      { error: 'No se pudo iniciar el pago. Inténtalo de nuevo.' },
      { status: 500 },
    );
  }
}
