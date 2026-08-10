import { Send, History } from "lucide-react";

export default function RoutingHistoryTab({ currentPR }) {
    if (!currentPR) return null;

    const routes = currentPR.routes ?? [];
    const activityLogs = currentPR.activity_logs ?? [];

    return (
        <div className="space-y-6">
            {/* Procurement Routing Trail */}
            <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Send className="w-4 h-4 text-blue-600" />
                    <span>Procurement Routing Trail</span>
                </h3>

                {routes.length > 0 ? (
                    <div className="relative border-l-2 border-blue-100 pl-4 space-y-6 ml-2">
                        {routes.map((rt) => (
                            <div key={rt.id} className="relative group">
                                <div className="absolute -left-[21px] top-1 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-blue-50 border-2 border-white" />

                                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:border-blue-300 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="text-xs font-bold text-blue-700">
                                                {rt.action}
                                            </span>

                                            <p className="text-[11px] font-semibold text-slate-800">
                                                From: {rt.from_dept} → To:{" "}
                                                {rt.to_dept}
                                            </p>
                                        </div>

                                        <span className="text-[10px] text-slate-400 font-medium">
                                            {rt.forwarded_at}
                                        </span>
                                    </div>

                                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                                        "{rt.remarks || "No remarks added."}"
                                    </p>

                                    <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                                        <span>
                                            Dispatched by:{" "}
                                            <strong className="text-slate-600">
                                                {rt.forwarded_by}
                                            </strong>
                                        </span>

                                        {rt.received_by && (
                                            <span>
                                                Received by:{" "}
                                                <strong className="text-emerald-700">
                                                    {rt.received_by}
                                                </strong>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                        <p className="text-xs font-medium text-slate-400">
                            No routing history available.
                        </p>
                    </div>
                )}
            </div>

            {/* System Audit Logs */}
            <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <History className="w-4 h-4 text-indigo-600" />
                    <span>System Audit Trail</span>
                </h3>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 space-y-3">
                    {activityLogs.length > 0 ? (
                        activityLogs.map((log) => (
                            <div
                                key={log.id}
                                className="text-xs flex items-start justify-between border-b border-slate-200/40 pb-2 last:border-0 last:pb-0"
                            >
                                <div>
                                    <span className="font-bold text-slate-800">
                                        {log.user}
                                    </span>

                                    <span className="text-slate-500 mx-1.5">
                                        •
                                    </span>

                                    <span className="font-semibold text-blue-600">
                                        {log.action}
                                    </span>

                                    <p className="text-slate-500 text-[11px] mt-0.5">
                                        {log.details || log.remarks}
                                    </p>
                                </div>

                                <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                                    {log.timestamp}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-xs text-slate-400 text-center py-2">
                            No system activity recorded.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
