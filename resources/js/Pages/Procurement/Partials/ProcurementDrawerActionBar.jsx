import { CornerUpLeft, Send } from "lucide-react";

export default function ProcurementDrawerActionBar({
    currentPR,
    stages,
    onReturn,
    onForward,
}) {
    if (!currentPR) return null;

    const isCompleted = currentPR.status === "completed";
    const currentStage = Number(currentPR.stage);

    const canReturn = currentStage > 1 && !isCompleted;
    const canForward = !isCompleted;

    return (
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
            {/* Active Department */}
            <div>
                <span className="text-[11px] text-slate-400 font-semibold block">
                    Active Holder Department:
                </span>

                <span className="text-xs font-bold text-slate-800">
                    {currentPR.current_department || "Not assigned"}
                </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                {canReturn && (
                    <button
                        type="button"
                        onClick={() => onReturn?.()}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                        <CornerUpLeft className="w-4 h-4" />

                        <span>Return / Revise</span>
                    </button>
                )}

                {canForward && (
                    <button
                        type="button"
                        onClick={() => onForward?.()}
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
                    >
                        <Send className="w-4 h-4" />

                        <span>
                            {currentStage === stages.length
                                ? "Finalize & Close Payment"
                                : "Dispatch / Forward Stage"}
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
}
