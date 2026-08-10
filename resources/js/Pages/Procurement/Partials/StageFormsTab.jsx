import { AlertCircle, FileCheck } from "lucide-react";

import StageFormCard from "./StageFormCard";
import Stage1PRForm from "../Stages/Stage1PRForm";
import Stage2RFQForm from "../Stages/Stage2RFQForm";
import Stage3POForm from "../Stages/Stage3POForm";
import Stage4DeliveryForm from "../Stages/Stage4DeliveryForm";
import Stage5ImplementationForm from "../Stages/Stage5ImplementationForm";
import Stage6PaymentForm from "../Stages/Stage6PaymentForm";
import { PROCUREMENT_STAGES } from "@/constants";

const STAGE_COMPONENTS = {
    1: Stage1PRForm,
    2: Stage2RFQForm,
    3: Stage3POForm,
    4: Stage4DeliveryForm,
    5: Stage5ImplementationForm,
    6: Stage6PaymentForm,
};

export default function StageFormsTab({
    currentPR,
    currentRole,
    onReceive,
    handleStageDataChange,
    stageFiles,
    setStageFiles,
}) {
    if (!currentPR) return null;

    const shouldReceive =
        currentPR.route_status === "in_transit" &&
        currentPR.current_department
            ?.toLowerCase()
            .includes(currentRole?.dept?.toLowerCase());

    const handleFilesChange = (stageId, files) => {
        setStageFiles((prev) => ({
            ...prev,
            [stageId]: files,
        }));
    };

    return (
        <div className="space-y-6">
            {/* Receive Banner */}
            {shouldReceive && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />

                        <div>
                            <p className="text-xs font-bold text-amber-900">
                                Document Dispatched to Your Office
                            </p>

                            <p className="text-[11px] text-amber-700">
                                Please confirm receipt before updating stage
                                records or forwarding.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => onReceive?.(currentPR.id)}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                    >
                        <FileCheck className="w-4 h-4" />
                        <span>Acknowledge Receipt</span>
                    </button>
                </div>
            )}

            {/* Stage Forms */}
            {PROCUREMENT_STAGES.map((stage) => {
                const StageForm = STAGE_COMPONENTS[stage.id];

                const isCurrentStage =
                    Number(currentPR.stage) === Number(stage.id);

                const isPassedStage =
                    Number(currentPR.stage) > Number(stage.id) ||
                    currentPR.status === "completed";

                if (!StageForm) return null;

                return (
                    <StageFormCard
                        key={stage.id}
                        stage={stage}
                        isCurrentStage={isCurrentStage}
                        isPassedStage={isPassedStage}
                        files={stageFiles?.[stage.id] ?? []}
                        onFilesChange={(files) =>
                            handleFilesChange(stage.id, files)
                        }
                    >
                        <StageForm
                            currentPR={currentPR}
                            isCurrentStage={isCurrentStage}
                            handleStageDataChange={handleStageDataChange}
                        />
                    </StageFormCard>
                );
            })}
        </div>
    );
}
