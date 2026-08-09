import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "sonner";

export default function MainLayout({ children }) {
    return (
        <SidebarProvider style={{ "--sidebar-width": "252px" }}>
            <Toaster richColors />
            <AppSidebar />
            <SidebarInset className="bg-slate-50">
                <main className="min-w-0 bg-gray-100">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    );
}
