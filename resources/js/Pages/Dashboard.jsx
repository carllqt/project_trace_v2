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

export default function Page() {
    return (
        <SidebarProvider style={{ "--sidebar-width": "252px" }}>
            <AppSidebar />
            <SidebarInset className="bg-slate-50">
                <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-100 bg-white">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1 text-slate-500" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">
                                        Procurement
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-4 sm:p-6 lg:p-7">
                    <div className="w-full space-y-6">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div className="lg:ml-6">
                                <h1 className="flex flex-wrap items-center gap-2 text-xl font-extrabold leading-none tracking-tight text-slate-900">
                                    <span>Document Tracking System</span>
                                    <span className="rounded-full border border-blue-200 bg-blue-100 px-2.5 py-1 text-[10px] font-semibold leading-none tracking-normal text-blue-700">
                                        ERD Workflow Enabled
                                    </span>
                                </h1>
                                <p className="mt-2 text-xs font-medium leading-none text-slate-500">
                                    Monitor procurement routing across 6 stages
                                    with complete audit logs and document
                                    tracking.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="flex h-9 shrink-0 items-center justify-center gap-2 self-start rounded-2xl bg-blue-700 px-5 text-xs font-bold text-white shadow-lg shadow-blue-700/25 transition hover:bg-blue-800 sm:ml-auto sm:self-center"
                            >
                                <PlusIcon className="size-4" />
                                <span>Create New PR Request</span>
                            </button>
                        </div>

                        <div className="flex flex-wrap justify-start gap-4 lg:ml-6">
                            {summaryCards.map((card) => {
                                const Icon = card.icon;

                                return (
                                    <article
                                        key={card.label}
                                        className="flex h-40 w-48 items-center justify-between rounded-3xl border border-slate-100 bg-white px-5 py-5 shadow-sm"
                                    >
                                        <div className="flex flex-col">
                                            <p className="max-w-32 text-[10px] font-bold uppercase leading-snug tracking-wider text-slate-400">
                                                {card.label}
                                            </p>
                                            <p className="mt-2 text-3xl font-black tracking-tight text-slate-800">
                                                {card.value}
                                            </p>
                                            <p className="mt-auto max-w-28 text-[11px] font-semibold leading-4 text-slate-500">
                                                {card.note}
                                            </p>
                                        </div>

                                        <div
                                            className={`flex size-11 shrink-0 items-center justify-center rounded-2xl border shadow-sm ${card.iconClassName}`}
                                        >
                                            <Icon
                                                className="size-5"
                                                strokeWidth={2.5}
                                            />
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
