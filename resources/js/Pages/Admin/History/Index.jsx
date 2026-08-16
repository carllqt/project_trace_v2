import {
    ArrowRight,
    CheckCircle2,
    Clock3,
    GitBranch,
    History,
    PackageCheck,
    RotateCcw,
} from "lucide-react";

import { Head, usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { toast } from "sonner";

import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import MainLayout from "@/Layouts/MainLayout";
import DynamicTable from "@/Components/DynamicTable";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";
import { PROCUREMENT_STAGES } from "@/constants";

export default function Index({ routes, departments = [], queryParams = {} }) {
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }

        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const breadcrumbs = [
        {
            label: "Procurement History",
            showOnMobile: true,
        },
    ];

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleString("en-PH", {
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStageLabel = (stage) => {
        if (!stage) return "—";

        const stages = {
            stage_1: "Purchase Request",
            stage_2: "Request for Quotation",
            stage_3: "Purchase Order",
            stage_4: "Delivery",
            stage_5: "Implementation",
            stage_6: "Payment",
            stage_7: "Completed",
        };

        return stages[stage] ?? stage;
    };

    const getActionConfig = (action) => {
        const normalized = String(action ?? "").toLowerCase();

        if (normalized.includes("forward")) {
            return {
                label: "Forwarded",
                icon: ArrowRight,
                className: "border-blue-200 bg-blue-50 text-blue-700",
            };
        }

        if (
            normalized.includes("retrieve") ||
            normalized.includes("received")
        ) {
            return {
                label: "Retrieved",
                icon: RotateCcw,
                className: "border-emerald-200 bg-emerald-50 text-emerald-700",
            };
        }

        if (normalized.includes("complete")) {
            return {
                label: "Completed",
                icon: CheckCircle2,
                className: "border-violet-200 bg-violet-50 text-violet-700",
            };
        }

        return {
            label: action || "—",
            icon: History,
            className: "border-slate-200 bg-slate-50 text-slate-600",
        };
    };

    /*
    |--------------------------------------------------------------------------
    | Table Columns
    |--------------------------------------------------------------------------
    */

    const allColumns = [
        {
            key: "procurement.pr_no",
            label: "PR No.",
        },
        {
            key: "procurement.project_title",
            label: "Project",
        },
        {
            key: "route",
            label: "Route",
        },
        {
            key: "action",
            label: "Action",
        },
        {
            key: "stage",
            label: "Stage",
        },
        {
            key: "forwardedBy.name",
            label: "Forwarded By",
        },
        {
            key: "forwarded_at",
            label: "Date",
        },
    ];

    /*
    |--------------------------------------------------------------------------
    | Table Renderers
    |--------------------------------------------------------------------------
    */

    const columnRenderers = {
        "procurement.pr_no": (route) => (
            <div className="w-[125px]">
                <p className="truncate text-sm font-bold text-slate-800">
                    {route.procurement?.pr_no ?? "—"}
                </p>

                <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                    Route #{route.id}
                </p>
            </div>
        ),

        "procurement.project_title": (route) => (
            <div className="w-[190px]">
                <p className="whitespace-normal break-words text-sm font-semibold leading-snug text-slate-700">
                    {route.procurement?.project_title ?? "—"}
                </p>

                {route.procurement?.end_user && (
                    <p className="mt-1 whitespace-normal break-words text-[11px] leading-snug text-slate-400">
                        {route.procurement.end_user}
                    </p>
                )}
            </div>
        ),

        route: (route) => (
            <div className="w-[210px]">
                <div className="flex items-center gap-2">
                    <div className="min-w-0 flex-1">
                        <p className="whitespace-normal break-words text-xs font-semibold leading-snug text-slate-700">
                            {route.from_department?.name ??
                                "Unknown Department"}
                        </p>

                        {route.from_department?.code && (
                            <p className="mt-0.5 text-[9px] font-medium uppercase tracking-wider text-slate-400">
                                {route.from_department.code}
                            </p>
                        )}
                    </div>

                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-blue-400" />

                    <div className="min-w-0 flex-1">
                        <p className="whitespace-normal break-words text-xs font-semibold leading-snug text-slate-700">
                            {route.to_department?.name ?? "Unknown Department"}
                        </p>

                        {route.to_department?.code && (
                            <p className="mt-0.5 text-[9px] font-medium uppercase tracking-wider text-slate-400">
                                {route.to_department.code}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        ),

        action: (route) => {
            const config = getActionConfig(route.action);
            const Icon = config.icon;

            return (
                <span
                    className={`inline-flex whitespace-nowrap items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] font-semibold ${config.className}`}
                >
                    <Icon className="h-3 w-3" />

                    {config.label}
                </span>
            );
        },

        stage: (route) => {
            const stage = PROCUREMENT_STAGES.find(
                (item) => item.value === route.stage,
            );

            if (!stage) {
                return (
                    <span className="text-xs text-slate-400">
                        Unknown Stage
                    </span>
                );
            }

            return (
                <div className="w-[230px]">
                    <div className="flex items-center gap-2">
                        <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${stage.color} text-[10px] font-bold text-white shadow-sm`}
                        >
                            {stage.id}
                        </div>

                        <div className="min-w-0">
                            <p
                                className="truncate text-xs font-bold text-slate-800"
                                title={stage.name}
                            >
                                {stage.name}
                            </p>

                            <p
                                className="truncate text-[10px] text-slate-400"
                                title={stage.label}
                            >
                                {stage.label}
                            </p>
                        </div>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1">
                        <span className="rounded-md bg-slate-50 px-1.5 py-0.5 text-[9px] font-medium text-slate-500">
                            {stage.actor}
                        </span>

                        <span className="rounded-md bg-slate-50 px-1.5 py-0.5 text-[9px] font-medium text-slate-500">
                            {stage.department}
                        </span>
                    </div>

                    {stage.docs?.length > 0 && (
                        <p className="mt-1 text-[9px] text-slate-400">
                            {stage.docs.length} document
                            {stage.docs.length !== 1 ? "s" : ""}
                        </p>
                    )}
                </div>
            );
        },

        "forwardedBy.name": (route) => (
            <div className="w-[125px]">
                <p
                    className="truncate text-xs font-semibold text-slate-700"
                    title={route.forwarded_by?.name}
                >
                    {route.forwarded_by?.name ?? "System"}
                </p>

                {route.forwarded_by?.position && (
                    <p
                        className="mt-0.5 truncate text-[10px] text-slate-400"
                        title={route.forwarded_by.position}
                    >
                        {route.forwarded_by.position}
                    </p>
                )}
            </div>
        ),

        forwarded_at: (route) => (
            <div className="w-[145px] whitespace-nowrap">
                <p className="text-xs font-semibold text-slate-700">
                    {formatDate(route.forwarded_at)}
                </p>

                {route.received_at && (
                    <div className="mt-1 flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                        <PackageCheck className="h-3 w-3" />
                        Received
                    </div>
                )}
            </div>
        ),
    };

    return (
        <MainLayout>
            <Head title="Procurement History" />

            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-7">
                {/* ======================================================
                    Header
                ====================================================== */}

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <GitBranch className="h-5 w-5 text-blue-600" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Procurement History
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Track procurement routing, department movements,
                                processing stages, and transaction history.
                            </p>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 shadow-sm backdrop-blur-xl">
                        <Clock3 className="h-4 w-4 text-blue-600" />

                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                Total Routes
                            </p>

                            <p className="text-sm font-bold text-slate-800">
                                {routes?.total ?? 0}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ======================================================
                    Filters
                ====================================================== */}

                <FilterToggle
                    queryParams={queryParams}
                    visibleFilters={[
                        "department",
                        "origin_department",
                        "date",
                        "status",
                    ]}
                    departments={departments}
                    clearRouteName="route.index"
                />

                {/* ======================================================
                    Registry
                ====================================================== */}

                <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/70 shadow-[0_8px_30px_rgba(0,0,0,0.03)] backdrop-blur-xl">
                    {/* Table Header */}

                    <div className="flex flex-col gap-3 border-b border-slate-100/80 bg-white/40 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                            <History className="h-4 w-4 text-blue-600" />

                            <div>
                                <h2 className="text-sm font-bold text-slate-800">
                                    Procurement Routing History
                                </h2>

                                <p className="mt-0.5 text-xs text-slate-400">
                                    Complete record of procurement movements and
                                    routing actions.
                                </p>
                            </div>
                        </div>
                    </div>

                    <DynamicTable
                        data={routes?.data ?? []}
                        allColumns={allColumns}
                        columnRenderers={columnRenderers}
                        pagination={routes}
                    />
                </div>
            </div>
        </MainLayout>
    );
}
