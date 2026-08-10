import RouteStatusBadge from "./RouteStatusBadge";

export default function ProcurementDrawerHeader({ currentPR }) {
    if (!currentPR) return null;

    return (
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
            <div>
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-black text-slate-800">
                        {currentPR.pr_no}
                    </h2>

                    <RouteStatusBadge status={currentPR.route_status} />
                </div>

                <p className="mt-0.5 text-xs font-medium text-slate-500">
                    {currentPR.project_title}
                </p>
            </div>
        </div>
    );
}
