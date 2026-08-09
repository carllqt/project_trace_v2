import {
    Briefcase,
    Building2,
    Eye,
    FileText,
    MapPin,
    Send,
    UserCheck,
    Wallet,
} from "lucide-react";

import { PROCUREMENT_STAGES } from "@/constants";
import DynamicTable from "./DynamicTable";
import FilterToggle from "./FilterButtons/FillterToggle";

export default function ProcurementRegistry({
    procurements = [],
    queryParams,
    departments,
}) {
    queryParams = queryParams || {};
    const allColumns = [
        {
            key: "procurement",
            label: "PR Number & Title",
        },
        {
            key: "end_user",
            label: "Origin",
        },
        {
            key: "abc",
            label: "Approved Budget",
        },
        {
            key: "stage",
            label: "Current Stage",
        },
        {
            key: "current_location",
            label: "Current Location",
        },
        {
            key: "route_status",
            label: "Route Status",
        },

        {
            key: "status_display",
            label: "Status",
        },
        {
            key: "actions",
            label: "Action",
            className: "text-right",
            cellClassName: "text-right",
            stopPropagation: true,
        },
    ];
    const columnRenderers = {
        procurement: (procurement) => (
            <div className="min-w-[220px]">
                <div className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 shrink-0 text-blue-500" />

                    <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800">
                            {procurement.pr_no}
                        </div>

                        <div className="mt-0.5 max-w-[260px] truncate text-xs font-medium text-slate-600">
                            {procurement.project_title ||
                                "Untitled Procurement"}
                        </div>
                    </div>
                </div>

                <div className="ml-5 mt-1 text-[10px] text-slate-400">
                    {procurement.mode_of_procurement || "—"}
                </div>
            </div>
        ),

        abc: (procurement) => (
            <div className="flex items-center gap-1.5 whitespace-nowrap">
                <Wallet className="h-3.5 w-3.5 text-slate-400" />

                <span className="text-xs font-semibold text-slate-700">
                    ₱
                    {Number(procurement.abc ?? 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
                </span>
            </div>
        ),

        stage: (procurement) => {
            const stageIndex = PROCUREMENT_STAGES.findIndex(
                (stage) => stage.value === procurement.status,
            );

            const currentStage = PROCUREMENT_STAGES[stageIndex];

            if (!currentStage) {
                return <span className="text-xs text-slate-400">—</span>;
            }

            return (
                <div className="min-w-[210px]">
                    <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-50 text-[10px] font-bold text-blue-600">
                            {stageIndex + 1}
                        </span>

                        <div className="min-w-0">
                            <div className="truncate text-xs font-semibold text-slate-700">
                                {currentStage.label}
                            </div>

                            <div className="text-[10px] text-slate-400">
                                Stage {stageIndex + 1} of{" "}
                                {PROCUREMENT_STAGES.length}
                            </div>
                        </div>
                    </div>
                </div>
            );
        },

        end_user: (procurement) => (
            <div className="flex max-w-[160px] items-center gap-2">
                <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-400" />

                <span className="truncate text-xs font-medium text-slate-700">
                    {procurement.end_user || "—"}
                </span>
            </div>
        ),

        current_location: (procurement) => {
            const route = procurement.route;

            return (
                <div className="min-w-[180px]">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />

                        <span className="truncate text-xs font-semibold text-slate-700">
                            {procurement.current_department || "Unknown"}
                        </span>
                    </div>

                    {route?.received_by && (
                        <div className="ml-5 mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                            <UserCheck className="h-3 w-3" />
                            {route.received_by}
                        </div>
                    )}

                    {!route?.received_by && route?.forwarded_by && (
                        <div className="ml-5 mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                            <Send className="h-3 w-3" />
                            {route.forwarded_by}
                        </div>
                    )}
                </div>
            );
        },

        route_status: (procurement) => {
            if (procurement.is_completed) {
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                        Completed
                    </span>
                );
            }

            if (procurement.requires_my_action) {
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700">
                        Action Required
                    </span>
                );
            }

            return (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                    <Send className="h-3 w-3" />
                    {procurement.route?.action || "In Route"}
                </span>
            );
        },

        status_display: (procurement) => (
            <StatusBadge completed={procurement.is_completed} />
        ),

        actions: (procurement) => (
            <button
                type="button"
                onClick={() => setSelectedProcurement(procurement)}
                title="View procurement"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
            >
                <Eye className="h-4 w-4" />
            </button>
        ),
    };
    return (
        <div className="space-y-4">
            {/* Filter Toolbar */}
            <FilterToggle
                queryParams={queryParams}
                visibleFilters={["department", "queue", "status"]}
                departments={departments}
                clearRouteName="dashboard"
            />
            {/* Registry Table */}
            <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/70 shadow-[0_8px_30px_rgba(0,0,0,0.03)] backdrop-blur-xl">
                {/* Table Header */}
                <div className="flex items-center justify-between border-b border-slate-100/80 bg-white/40 px-6 py-4">
                    <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                        <Briefcase className="h-4 w-4 text-blue-600" />
                        <span>Procurement Registry & Routing Status</span>
                    </h2>
                </div>

                <DynamicTable
                    data={procurements.data}
                    allColumns={allColumns}
                    columnRenderers={columnRenderers}
                    pagination={procurements}
                    onRowClick={(procurement) =>
                        setSelectedProcurement(procurement)
                    }
                />
            </div>
        </div>
    );
}
function StatusBadge({ completed }) {
    return (
        <span
            className={`inline-flex rounded-md px-2 py-1 text-[10px] font-semibold ${
                completed
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-blue-50 text-blue-700"
            }`}
        >
            {completed ? "Completed" : "In Progress"}
        </span>
    );
}
