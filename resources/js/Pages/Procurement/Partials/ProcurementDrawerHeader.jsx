import RouteStatusBadge from "./RouteStatusBadge";

export default function ProcurementDrawerHeader({ currentPR }) {
    if (!currentPR) return null;

    return (
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-black text-slate-800">
                        {currentPR.id}
                    </h2>

                    <RouteStatusBadge status={currentPR.route_status} />
                </div>

                <p className="text-xs font-medium text-slate-500 mt-0.5">
                    {currentPR.project_title}
                </p>
            </div>
        </div>
    );
}
