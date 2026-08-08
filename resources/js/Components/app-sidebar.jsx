import { Link } from "@inertiajs/react";
import {
    CheckCircle2Icon,
    ChevronDownIcon,
    Clock3Icon,
    FileTextIcon,
    HomeIcon,
    Layers3Icon,
    UserRoundCheckIcon,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarLogout } from "./SidebarLogout";

const navItems = [
    {
        title: "Dashboard",
        href: route("dashboard"),
        icon: HomeIcon,
        active: true,
    },
    {
        title: "My Action Queue",
        href: "#",
        icon: Clock3Icon,
    },
    {
        title: "In Progress PRs",
        href: "#",
        icon: FileTextIcon,
        badge: "2",
    },
    {
        title: "Completed PRs",
        href: "#",
        icon: CheckCircle2Icon,
    },
];

const navLinkBaseClass =
    "flex h-9 w-full items-center justify-start gap-2 rounded-2xl px-3.5 text-xs font-extrabold";

export function AppSidebar({ ...props }) {
    return (
        <Sidebar
            variant="sidebar"
            className="border-r border-slate-100 bg-white [--sidebar:#ffffff] [--sidebar-accent:#eff6ff] [--sidebar-accent-foreground:#1d4ed8] [--sidebar-border:#e2e8f0] [--sidebar-foreground:#334155] [--sidebar-primary:#1d4ed8] [--sidebar-primary-foreground:#ffffff]"
            {...props}
        >
            <SidebarHeader className="border-b border-slate-100 px-5.5 py-3.5">
                <Link
                    href={route("dashboard")}
                    className="flex items-center gap-2.5"
                >
                    <span className="flex size-9 items-center justify-center rounded-xl bg-blue-700 text-white shadow-lg shadow-blue-700/25">
                        <Layers3Icon className="size-5" strokeWidth={2.35} />
                    </span>
                    <span className="text-xl font-extrabold leading-none tracking-normal text-blue-700">
                        ProcureTrack
                    </span>
                </Link>
            </SidebarHeader>

            <SidebarContent className="px-3 pt-6">
                <SidebarMenu className="w-full gap-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <SidebarMenuItem
                                key={item.title}
                                className="w-full"
                            >
                                <Link
                                    href={item.href}
                                    className={
                                        item.active
                                            ? `${navLinkBaseClass} bg-blue-700 text-white shadow-lg shadow-blue-700/25 [&_svg]:text-white`
                                            : `${navLinkBaseClass} text-slate-700 hover:bg-blue-50 hover:text-blue-700 [&_svg]:text-slate-400`
                                    }
                                >
                                    <Icon
                                        className="size-4"
                                        strokeWidth={2.05}
                                    />
                                    <span className="min-w-0 truncate">
                                        {item.title}
                                    </span>
                                    {item.badge ? (
                                        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-100 px-1.5 text-xs font-extrabold text-blue-600">
                                            {item.badge}
                                        </span>
                                    ) : null}
                                </Link>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="px-3.5 pb-4">
                <SidebarLogout />
            </SidebarFooter>
        </Sidebar>
    );
}
