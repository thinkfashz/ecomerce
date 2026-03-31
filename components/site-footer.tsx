import Link from 'next/link';
import { STORE_DESCRIPTION, STORE_NAME } from '@/lib/constants';

export function SiteFooter() {
  return (
    <footer className="section-dark border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
      <div className="page-shell py-14">
        <div className="grid gap-10 sm:grid-cols-[1fr_auto]">
          {/* Brand */}
          <div className="space-y-4">
            <p className="font-display text-3xl text-white">{STORE_NAME}</p>
            <p className="max-w-sm text-sm text-white/50 leading-relaxed">{STORE_DESCRIPTION}</p>
            {/* Yellow accent line */}
            <div className="h-px w-16 rounded-full" style={{ backgroundColor: '#f5c200' }} />
          </div>

          {/* Nav */}
          <div className="flex flex-wrap gap-x-10 gap-y-3 text-sm text-white/50 self-start pt-2">
            <Link href="/products" className="hover:text-[#f5c200] transition-colors duration-200">
              Shop all
            </Link>
            <Link href="/account/orders" className="hover:text-[#f5c200] transition-colors duration-200">
              Orders
            </Link>
            <Link href="/cart" className="hover:text-[#f5c200] transition-colors duration-200">
              Cart
            </Link>
          </div>
        </div>

        {/* Bottom row */}
        <div
          className="mt-10 flex flex-col gap-3 border-t pt-6 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <p>&copy; {new Date().getFullYear()} {STORE_NAME}. All rights reserved.</p>
          <p>
            Powered by{' '}
            <span style={{ color: '#f5c200' }}>InsForge</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
