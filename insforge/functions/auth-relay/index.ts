// Edge Function: auth-relay
// Recibe el callback de GitHub/OAuth via InsForge
// y redirige al usuario a la app de Vercel con todos los parámetros.

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);

  // Log para debugging (visible en npx @insforge/cli logs function.logs)
  console.log('[auth-relay] params:', Object.fromEntries(url.searchParams));

  // URL destino final
  const nextUrl = new URL('https://insforge-blue.vercel.app/auth/callback');

  // Reenviar TODOS los query params (insforge_code, code, state, etc.)
  url.searchParams.forEach((value, key) => {
    nextUrl.searchParams.set(key, value);
  });

  console.log('[auth-relay] redirecting to:', nextUrl.toString());

  return Response.redirect(nextUrl.toString(), 302);
}
