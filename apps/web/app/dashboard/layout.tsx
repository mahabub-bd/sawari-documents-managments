import { Footer } from "@/components/common/footer";
import Navbar from "@/components/common/header/Navbar";
import DashboardTopNav from "@/components/dashboard/DashboardTopNav";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30 dark:bg-background">
      <Navbar />
      <DashboardTopNav />

      <main className="container mx-auto min-w-0 flex-1 overflow-x-hidden px-4 py-6 sm:px-6 lg:py-8">
        {children}
      </main>

      <Footer />
    </div>
  );
}
