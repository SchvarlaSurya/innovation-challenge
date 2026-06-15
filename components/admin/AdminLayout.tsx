/**
 * components/admin/AdminLayout.tsx
 * Wrapper for admin pages.
 * NOTE: app/admin/layout.tsx already provides AdminSidebar + TopBar.
 * This component is kept as a no-op passthrough so legacy child-page
 * imports still work, but the rendering is just a clean container.
 *
 * UI: Material 3 palette.
 */
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function AdminLayout({ children }: Props) {
  return <div className="w-full">{children}</div>;
}
