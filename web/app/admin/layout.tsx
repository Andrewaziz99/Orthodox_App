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
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:block w-64 border-r border-gray-200">
        <AdminSidebar />
      </aside>

      {/* Sidebar - Mobile */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-64 z-50 lg:hidden">
            <AdminSidebar />
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile menu button can be added here if needed */}
        
        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
