import { CornerUpLeft, Send, Lock, RotateCcw } from "lucide-react";

export default function ProcurementDrawerActionBar({
    currentPR,
    stages,
    onReturn,
    onForward,
    onRetrieve,
    canRoute,
    canRetrieve,
}) {
    if (!currentPR) {
        return null;
    }

    const isCompleted = currentPR.status === "completed";

    const currentStage = Number(currentPR.stage) || 1;

    /*
    |--------------------------------------------------------------------------
    | FIND PREVIOUS FORWARDED ROUTE
    |--------------------------------------------------------------------------
    |
    | Determines whether this procurement was previously forwarded by
    | the current department to the next stage.
    |
    */

    const routes = currentPR.routes ?? [];

    const getNextStageRoute = () => {
        const nextStage = currentStage + 1;

        return [...routes].reverse().find((route) => {
            const routeStage = Number(
                String(route.stage ?? "").replace("stage_", ""),
            );

            return (
                routeStage === nextStage &&
                String(route.action ?? "").toLowerCase() === "forwarded"
            );
        });
    };

    const nextStageRoute = getNextStageRoute();

    /*
    |--------------------------------------------------------------------------
    | RETRIEVE PERMISSION
    |--------------------------------------------------------------------------
    |
    | A procurement can be retrieved when:
    |
    | 1. It is not completed.
    | 2. There is a previous forward route to the next stage.
    |
    */

    /*
    |--------------------------------------------------------------------------
    | ACTION PERMISSIONS
    |--------------------------------------------------------------------------
    */

    const canReturn = currentStage > 1 && !isCompleted && canRoute;

    const canForward = !isCompleted && canRoute;

    const isFinalStage = currentStage >= stages.length;

    return (
        <div className="shrink-0 border-t border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
                {/* -------------------------------------------------- */}
                {/* ACTIVE HOLDER */}
                {/* -------------------------------------------------- */}

                <div className="min-w-0">
                    <span className="block text-[11px] font-semibold text-slate-400">
                        Active Holder Department:
                    </span>

                    <span className="block truncate text-xs font-bold text-slate-800">
                        {currentPR.current_department || "Not assigned"}
                    </span>
                </div>

                {/* -------------------------------------------------- */}
                {/* ACTIONS */}
                {/* -------------------------------------------------- */}

                <div className="flex shrink-0 items-center gap-2">
                    {/* RETRIEVE */}

                    {canRetrieve && (
                        <button
                            type="button"
                            onClick={() => onRetrieve?.()}
                            className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-bold text-amber-700 transition-all hover:border-amber-300 hover:bg-amber-100 hover:text-amber-800"
                        >
                            <RotateCcw className="h-4 w-4" />
                            <span>Retrieve</span>
                        </button>
                    )}

                    {/* RETURN */}

                    {canReturn && (
                        <button
                            type="button"
                            onClick={() => onReturn?.()}
                            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                        >
                            <CornerUpLeft className="h-4 w-4" />

                            <span>Return / Revise</span>
                        </button>
                    )}

                    {/* FORWARD */}

                    {canForward && (
                        <button
                            type="button"
                            onClick={() => onForward?.()}
                            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:from-blue-700 hover:to-indigo-700"
                        >
                            <Send className="h-4 w-4" />

                            <span>
                                {isFinalStage
                                    ? "Finalize & Close Payment"
                                    : "Dispatch / Forward Stage"}
                            </span>
                        </button>
                    )}

                    {/* COMPLETED */}

                    {isCompleted && (
                        <div className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700">
                            <Lock className="h-4 w-4" />

                            <span>Procurement Completed</span>
                        </div>
                    )}
                </div>
            </div>

            {/* ------------------------------------------------------ */}
            {/* READ-ONLY MESSAGE */}
            {/* ------------------------------------------------------ */}

            {!isCompleted && !canRoute && (
                <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                    <Lock className="h-3.5 w-3.5 text-slate-400" />

                    <span>
                        Routing actions are available only to the department
                        currently holding this procurement.
                    </span>
                </div>
            )}
        </div>
    );
}
