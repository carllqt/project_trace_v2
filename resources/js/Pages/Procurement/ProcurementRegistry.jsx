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
import DynamicTable from "../../Components/DynamicTable";
import FilterToggle from "../../Components/FilterButtons/FillterToggle";
import StatusBadge from "@/Pages/Procurement/Partials/StatusBadge";
import axios from "axios";
import { useState } from "react";
import ProcurementDrawerModal from "./ProcurementDrawerModal";
export default function ProcurementRegistry({
    procurements = [],
    queryParams,
    departments,
    user,
    showFilters = true,
}) {
    queryParams = queryParams || {};
    // modal
    const [selectedProcurement, setSelectedProcurement] = useState(null);
    const [isProcurementModalOpen, setIsProcurementModalOpen] = useState(false);
    const [isLoadingProcurement, setIsLoadingProcurement] = useState(false);

    const handleViewProcurement = async (procurementId) => {
        try {
            setIsLoadingProcurement(true);
            const response = await axios.get(
                route("procurement.show", procurementId),
            );
            setSelectedProcurement(response.data);
            setIsProcurementModalOpen(true);
        } catch (error) {
            console.error("Failed to fetch procurement:", error);
        } finally {
            setIsLoadingProcurement(false);
        }
    };
    const handleClose = () => {
        setSelectedProcurement(null);
    };
    // Data table columns with explicit sizing and alignment
    const allColumns = [
        {
            key: "procurement",
            label: "PR Number & Title",
            className: "w-[25%] min-w-[220px]", // Takes most space
        },
        {
            key: "end_user",
            label: "Origin",
            className: "w-[12%] min-w-[120px]",
        },
        {
            key: "abc",
            label: "Approved Budget",
            className: "w-[12%] min-w-[130px] text-right", // Right-align money
            cellClassName: "text-right",
        },
        {
            key: "stage",
            label: "Current Stage",
            className: "w-[18%] min-w-[200px]",
        },
        {
            key: "current_location",
            label: "Current Location",
            className: "w-[15%] min-w-[160px]",
        },
        {
            key: "route_status",
            label: "Route Status",
            className: "w-[10%] min-w-[110px]",
        },
        {
            key: "status_display",
            label: "Status",
            className: "w-[8%] min-w-[100px]",
        },
        {
            key: "actions",
            label: "Action",
            className: "w-[80px] text-right",
            cellClassName: "text-right",
            stopPropagation: true,
        },
    ];

    const columnRenderers = {
        procurement: (procurement) => (
            <div className="flex flex-col justify-center min-w-0 w-full">
                <div className="flex items-center gap-2.5">
                    <FileText className="h-4 w-4 shrink-0 text-blue-500" />
                    <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-bold text-slate-800">
                            {procurement.pr_no}
                        </div>
                        <div className="truncate text-[11px] font-medium text-slate-500 mt-0.5">
                            {procurement.project_title ||
                                "Untitled Procurement"}
                        </div>
                    </div>
                </div>
                <div className="ml-6 mt-1 text-[10px] uppercase tracking-wide text-slate-400">
                    {procurement.mode_of_procurement || "—"}
                </div>
            </div>
        ),

        abc: (procurement) => (
            <div className="flex items-center justify-end gap-1.5 w-full">
                <span className="text-xs font-semibold text-slate-700 tabular-nums">
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
            if (!currentStage)
                return <span className="text-xs text-slate-400">—</span>;

            return (
                <div className="flex items-center gap-2.5 min-w-0 w-full">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-50 text-[10px] font-bold text-blue-600">
                        {stageIndex + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-semibold text-slate-700">
                            {currentStage.label}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">
                            Stage {stageIndex + 1} of{" "}
                            {PROCUREMENT_STAGES.length}
                        </div>
                    </div>
                </div>
            );
        },

        end_user: (procurement) => (
            <div className="flex items-center gap-2 min-w-0 w-full">
                <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span className="truncate text-xs font-medium text-slate-700">
                    {procurement.end_user || "—"}
                </span>
            </div>
        ),

        current_location: (procurement) => {
            const route = procurement.route;
            return (
                <div className="flex flex-col justify-center min-w-0 w-full">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                        <span className="truncate text-xs font-semibold text-slate-700">
                            {procurement.current_department || "Unknown"}
                        </span>
                    </div>
                    {route?.received_by ? (
                        <div className="ml-5 mt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
                            <UserCheck className="h-3 w-3 shrink-0" />
                            <span className="truncate">
                                {route.received_by}
                            </span>
                        </div>
                    ) : route?.forwarded_by ? (
                        <div className="ml-5 mt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
                            <Send className="h-3 w-3 shrink-0" />
                            <span className="truncate">
                                {route.forwarded_by}
                            </span>
                        </div>
                    ) : null}
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
                    <span className="truncate">
                        {procurement.route?.action || "In Route"}
                    </span>
                </span>
            );
        },

        status_display: (procurement) => (
            <StatusBadge completed={procurement.is_completed} />
        ),

        actions: (procurement) => (
            <div className="flex items-center justify-end">
                <button
                    type="button"
                    onClick={() => handleViewProcurement(procurement.id)}
                    title={`View procurement ${procurement.pr_no}`}
                    className="group flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200/80 bg-white text-slate-500 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-95"
                >
                    <Eye className="h-4 w-4 transition-transform group-hover:scale-110" />
                </button>
            </div>
        ),
    };
    return (
        <div className="min-w-0 space-y-4">
            {/* Filter Toolbar */}
            {showFilters && (
                <FilterToggle
                    queryParams={queryParams}
                    visibleFilters={["department", "queue", "status"]}
                    departments={departments}
                    clearRouteName="procurement.index"
                />
            )}
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
            <ProcurementDrawerModal
                isOpen={selectedProcurement}
                onClose={() => handleClose(false)}
                currentRole={{
                    deptId: user.department_id,
                    dept: user.department?.name,
                    name: user.name,
                }}
                initialData={selectedProcurement}
            />
        </div>
    );
}
