import { AdminSidebar, AdminTopBar } from "@/components/admin/AdminLayoutComponents";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full h-[calc(100vh-theme(spacing.16))] sm:h-screen overflow-hidden bg-background text-on-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <AdminTopBar />
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </div>
      
      {/* Floating Action Button for mobile */}
      <a href="/admin/sitaan/tambah" className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center z-50">
        <span className="material-symbols-outlined">add</span>
      </a>
    </div>
  );
}
