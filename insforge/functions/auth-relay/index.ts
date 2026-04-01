// Edge Function: auth-relay
// Recibe el callback de InsForge (con tokens en query params)
// y redirige al usuario a la app de Vercel con los mismos parámetros.

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);

  // URL destino final (nuestra app en Vercel)
  const next = 'https://insforge-blue.vercel.app/auth/callback';
  const nextUrl = new URL(next);

  // Reenviar todos los query params que InsForge agregó (tokens, etc.)
  url.searchParams.forEach((value, key) => {
    nextUrl.searchParams.set(key, value);
  });

  return Response.redirect(nextUrl.toString(), 302);
}
