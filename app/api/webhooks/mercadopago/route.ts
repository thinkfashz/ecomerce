import { NextRequest, NextResponse } from 'next/server';
import { mpPayment } from '@/lib/mercadopago';

// Actualiza el payment_status del pedido directamente en la DB de InsForge
// usando la REST API (PostgREST) con la clave admin.
async function updateOrderPaymentStatus(
  orderId: string,
  paymentStatus: string,
  mpPaymentId: string,
) {
  const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL;
  const apiKey = process.env.INSFORGE_API_KEY;

  if (!baseUrl || !apiKey) {
    console.error('[Webhook MP] Faltan NEXT_PUBLIC_INSFORGE_URL o INSFORGE_API_KEY.');
    return;
  }

  const status = paymentStatus === 'approved' ? 'paid' : 'pending';

  const res = await fetch(`${baseUrl}/rest/v1/orders?id=eq.${orderId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      apikey: apiKey,
      Authorization: `Bearer ${apiKey}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      payment_status: status,
      // Guardamos el ID de pago de MP para referencia
      ...(paymentStatus === 'approved' && { status: 'confirmed' }),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('[Webhook MP] Error actualizando pedido:', res.status, text);
  } else {
    console.log(`[Webhook MP] Pedido ${orderId} actualizado: payment_status=${status}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Mercado Pago envía notificaciones de tipo "payment"
    if (body.type === 'payment' && body.data?.id) {
      const paymentId = String(body.data.id);

      // Consultar los detalles del pago directamente a MP
      const paymentData = await mpPayment.get({ id: paymentId });

      const orderId = paymentData.external_reference ?? paymentData.metadata?.order_id;
      const paymentStatus = paymentData.status; // approved | pending | rejected | cancelled

      console.log(
        `[Webhook MP] Pago ${paymentId} - Estado: ${paymentStatus} - Pedido: ${orderId}`,
      );

      if (orderId && (paymentStatus === 'approved' || paymentStatus === 'rejected')) {
        await updateOrderPaymentStatus(orderId, paymentStatus, paymentId);
      }
    }

    // Siempre responder 200 para que MP no reintente
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Webhook MP] Error procesando notificación:', error);
    // Aun así responder 200 para evitar reintentos en errores transitorios
    return NextResponse.json({ received: true });
  }
}
