import { NextResponse } from 'next/server';
import { exchangeAuthCode } from '@/lib/auth-actions';

export async function GET(request: Request) {
  const url = new URL(request.url);

  // InsForge puede enviar el código como 'insforge_code' o 'code'
  const code = url.searchParams.get('insforge_code') ?? url.searchParams.get('code');

  if (!code) {
    console.error('[auth/callback] No code param. Params:', Object.fromEntries(url.searchParams));
    return NextResponse.redirect(new URL('/auth/sign-in?error=no_code', request.url));
  }

  const result = await exchangeAuthCode(code);

  if (result.success) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  console.error('[auth/callback] exchangeAuthCode failed:', result.error);
  return NextResponse.redirect(new URL('/auth/sign-in?error=oauth_failed', request.url));
}
