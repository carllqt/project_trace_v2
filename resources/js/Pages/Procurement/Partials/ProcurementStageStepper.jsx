import { Check } from "lucide-react";

export default function ProcurementStageStepper({ stages, currentPR }) {
    if (!currentPR) return null;

    return (
        <div className="px-6 py-3 bg-slate-50/80 border-b border-slate-100 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[500px]">
                {stages.map((stage, index) => {
                    const isDone =
                        Number(stage.id) < Number(currentPR.stage) ||
                        currentPR.status === "completed";

                    const isCurrent =
                        Number(stage.id) === Number(currentPR.stage) &&
                        currentPR.status !== "completed";

                    const isLastStage = index === stages.length - 1;

                    return (
                        <div
                            key={stage.id}
                            className="flex items-center flex-1"
                        >
                            <div className="flex flex-col items-center">
                                <div
                                    className={`
                                        w-7 h-7 rounded-lg flex items-center
                                        justify-center font-bold text-xs
                                        transition-all shadow-sm
                                        ${
                                            isDone
                                                ? "bg-emerald-500 text-white"
                                                : isCurrent
                                                  ? "bg-blue-600 text-white ring-4 ring-blue-100"
                                                  : "bg-slate-200 text-slate-500"
                                        }
                                    `}
                                >
                                    {isDone ? (
                                        <Check className="w-3.5 h-3.5" />
                                    ) : (
                                        stage.id
                                    )}
                                </div>

                                <span
                                    className={`
                                        text-[10px] font-bold mt-1
                                        max-w-[65px] text-center truncate
                                        ${
                                            isCurrent
                                                ? "text-blue-700"
                                                : "text-slate-500"
                                        }
                                    `}
                                >
                                    {stage.name}
                                </span>
                            </div>

                            {!isLastStage && (
                                <div
                                    className={`
                                        h-0.5 flex-1 mx-1
                                        ${
                                            Number(stage.id) <
                                            Number(currentPR.stage)
                                                ? "bg-emerald-500"
                                                : "bg-slate-200"
                                        }
                                    `}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
