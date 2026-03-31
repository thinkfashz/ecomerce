import Link from 'next/link';
import { AuthShell } from '@/components/auth-shell';
import { SignInForm } from '@/components/sign-in-form';
import { getAuthConfig } from '@/lib/auth-actions';

export const dynamic = 'force-dynamic';

export default async function SignInPage() {
  const config = await getAuthConfig();

  return (
    <AuthShell
      eyebrow="Iniciar sesión"
      title="Bienvenido de vuelta"
      description="Tu carrito, direcciones y pedidos te estarán esperando."
    >
      <SignInForm providers={config.oAuthProviders ?? []} />

      <p className="text-center text-sm text-muted-foreground">
        ¿No tienes una cuenta?{' '}
        <Link href="/auth/sign-up" className="text-foreground underline-offset-4 hover:underline">
          Créala aquí
        </Link>
      </p>
    </AuthShell>
  );
}
