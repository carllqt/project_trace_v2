import { AlertCircle, FileCheck, Lock } from "lucide-react";

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

    // Permissions from ProcurementDrawerModal
    canEdit = false,
    canUpload = false,
    canAccessCurrentStage = false,
}) {
    if (!currentPR) {
        return null;
    }

    /*
|--------------------------------------------------------------------------
| RECEIVE
|--------------------------------------------------------------------------
|
| Only the department currently assigned to the procurement can
| acknowledge receipt.
|
*/

    const shouldReceive =
        currentPR.route_status === "in_transit" && canAccessCurrentStage;

    /*
|--------------------------------------------------------------------------
| FILE HANDLER
|--------------------------------------------------------------------------
*/

    const handleFilesChange = (stageId, files) => {
        // Extra protection against unauthorized file changes
        if (!canUpload) {
            return;
        }

        setStageFiles?.((prev) => ({
            ...prev,
            [stageId]: files,
        }));
    };

    /*
|--------------------------------------------------------------------------
| STAGE ACCESS
|--------------------------------------------------------------------------
|
| The user can only edit/upload on the CURRENT stage.
|
| Example:
|
| PR is at Stage 2 and assigned to BAC Secretariat:
|
| Stage 1 → View only
| Stage 2 → Editable by BAC Secretariat
| Stage 3+ → Locked
|
*/

    return (
        <div className="space-y-6">
            {/* --------------------------------------------------------- */}
            {/* RECEIVE BANNER */}
            {/* --------------------------------------------------------- */}

            {shouldReceive && (
                <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-600" />

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
                        className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-amber-700"
                    >
                        <FileCheck className="h-4 w-4" />

                        <span>Acknowledge Receipt</span>
                    </button>
                </div>
            )}

            {/* --------------------------------------------------------- */}
            {/* READ ONLY WARNING */}
            {/* --------------------------------------------------------- */}

            {!canAccessCurrentStage && currentPR.status !== "completed" && (
                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <Lock className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-400" />

                    <div>
                        <p className="text-xs font-bold text-slate-700">
                            Read-Only Access
                        </p>

                        <p className="mt-1 text-[11px] text-slate-500">
                            This procurement is currently assigned to{" "}
                            <strong>
                                {currentPR.current_department ||
                                    "another department"}
                            </strong>
                            . You can view the records, but you cannot modify
                            forms, upload documents, receive, or dispatch the
                            procurement.
                        </p>
                    </div>
                </div>
            )}

            {/* --------------------------------------------------------- */}
            {/* COMPLETED WARNING */}
            {/* --------------------------------------------------------- */}

            {currentPR.status === "completed" && (
                <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                    <FileCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />

                    <div>
                        <p className="text-xs font-bold text-emerald-800">
                            Procurement Completed
                        </p>

                        <p className="mt-1 text-[11px] text-emerald-700">
                            This procurement has been completed. All stage
                            records and documents are now read-only.
                        </p>
                    </div>
                </div>
            )}

            {/* --------------------------------------------------------- */}
            {/* STAGE FORMS */}
            {/* --------------------------------------------------------- */}

            {PROCUREMENT_STAGES.map((stage) => {
                const StageForm = STAGE_COMPONENTS[stage.id];

                if (!StageForm) {
                    return null;
                }

                const currentStage = Number(currentPR.stage);
                const stageId = Number(stage.id);

                const isCurrentStage = currentStage === stageId;

                const isPassedStage =
                    currentStage > stageId || currentPR.status === "completed";

                /*
            |--------------------------------------------------------------------------
            | FORM ACCESS
            |--------------------------------------------------------------------------
            |
            | Must satisfy BOTH conditions:
            |
            | 1. This is the current stage.
            | 2. User's department currently owns the PR.
            |
            */

                const canEditThisStage = isCurrentStage && canEdit;

                /*
            |--------------------------------------------------------------------------
            | DOCUMENT UPLOAD ACCESS
            |--------------------------------------------------------------------------
            |
            | Only the current assigned department can upload
            | documents for the current stage.
            |
            */

                const canUploadThisStage = isCurrentStage && canUpload;

                return (
                    <StageFormCard
                        key={stage.id}
                        stage={stage}
                        isCurrentStage={isCurrentStage}
                        isPassedStage={isPassedStage}
                        canEditStage={canEditThisStage}
                        canUploadDocuments={canUploadThisStage}
                        files={stageFiles?.[stage.id] ?? []}
                        onFilesChange={(files) =>
                            handleFilesChange(stage.id, files)
                        }
                        onFileError={(message) => {
                            console.error(
                                `Stage ${stage.id} file error:`,
                                message,
                            );
                        }}
                    >
                        <StageForm
                            currentPR={currentPR}
                            /*
                        |--------------------------------------------------
                        | CURRENT STAGE / EDIT ACCESS
                        |--------------------------------------------------
                        */

                            isCurrentStage={canEditThisStage}
                            canEdit={canEditThisStage}
                            handleStageDataChange={handleStageDataChange}
                        />
                    </StageFormCard>
                );
            })}
        </div>
    );
}
