import { AppSidebar } from "@/components/app-sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import {
    CheckCircle2Icon,
    Clock3Icon,
    FileTextIcon,
    PlusIcon,
    TrendingUpIcon,
} from "lucide-react";

const summaryCards = [
    {
        label: "Total PRs Registered",
        value: "3",
        note: "Across all stages",
        icon: FileTextIcon,
        iconClassName: "border-blue-200 bg-blue-50 text-blue-600",
    },
    {
        label: "Action Required (My Queue)",
        value: "0",
        note: "Assigned to IT / HR Dept",
        icon: Clock3Icon,
        iconClassName: "border-orange-200 bg-orange-50 text-orange-500",
    },
    {
        label: "In Progress Routing",
        value: "2",
        note: "Stages 1 - 5 active",
        icon: TrendingUpIcon,
        iconClassName: "border-purple-200 bg-purple-50 text-purple-600",
    },
    {
        label: "Completed & Paid",
        value: "1",
        note: "Finalized in Stage 6",
        icon: CheckCircle2Icon,
        iconClassName: "border-emerald-200 bg-emerald-50 text-emerald-600",
    },
];

export default function MainLayout({ children }) {
    return (
        <SidebarProvider style={{ "--sidebar-width": "252px" }}>
            <AppSidebar />
            <SidebarInset className="bg-slate-50">
                <main className="min-w-0 bg-gray-100">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    );
}
