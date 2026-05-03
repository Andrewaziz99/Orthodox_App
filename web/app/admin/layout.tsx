/**
 * Admin Layout
 * Main layout for admin dashboard with sidebar and topbar
 */

'use client';

import { useState } from 'react';
import { useRequireAdmin } from '@/lib/auth/middleware';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Protect this layout - redirects to login if not authenticated
  const { isChecking } = useRequireAdmin();

  // Don't render content until authentication is verified on the client
  if (isChecking) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:block w-64 border-r border-gray-200 shrink-0">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <AdminSidebar />
        </div>
      </aside>

      {/* Sidebar - Mobile */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-64 z-50 lg:hidden h-screen overflow-y-auto bg-white">
            <AdminSidebar />
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile menu button can be added here if needed */}
        
        {/* Content area */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
