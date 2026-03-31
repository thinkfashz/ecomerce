import Link from 'next/link';
import { AuthShell } from '@/components/auth-shell';
import { SignUpForm } from '@/components/sign-up-form';
import { getAuthConfig } from '@/lib/auth-actions';

export const dynamic = 'force-dynamic';

export default async function SignUpPage() {
  const config = await getAuthConfig();

  return (
    <AuthShell
      eyebrow="Crear cuenta"
      title="Empieza a comprar"
      description="Correo, contraseña, códigos de verificación y OAuth conectados directamente a tu perfil de cliente."
    >
      <SignUpForm
        providers={config.oAuthProviders ?? []}
        verifyEmailMethod={config.verifyEmailMethod}
      />

      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tienes una cuenta?{' '}
        <Link href="/auth/sign-in" className="text-foreground underline-offset-4 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </AuthShell>
  );
}
