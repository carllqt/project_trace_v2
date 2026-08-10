import InputField from "@/Components/InputField";

export default function Stage1PRForm({
    currentPR,
    isCurrentStage,
    handleStageDataChange,
}) {
    if (!currentPR) return null;

    const pr = currentPR.stage_data?.pr ?? {};

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField
                label="PR No."
                value={pr.pr_no || currentPR.pr_no || ""}
                disabled
            />

            <InputField
                label="Project Title"
                value={pr.project_title || ""}
                onChange={(val) =>
                    handleStageDataChange(
                        currentPR.id,
                        "pr",
                        "project_title",
                        val,
                    )
                }
                disabled={!isCurrentStage}
            />

            <InputField
                label="Purpose"
                value={pr.purpose || ""}
                onChange={(val) =>
                    handleStageDataChange(currentPR.id, "pr", "purpose", val)
                }
                disabled={!isCurrentStage}
                fullWidth
            />

            <InputField
                label="End User Department"
                value={pr.end_user || ""}
                onChange={(val) =>
                    handleStageDataChange(currentPR.id, "pr", "end_user", val)
                }
                disabled={!isCurrentStage}
            />

            <InputField
                label="ABC (Approved Budget)"
                type="number"
                value={pr.abc || ""}
                onChange={(val) =>
                    handleStageDataChange(currentPR.id, "pr", "abc", val)
                }
                disabled={!isCurrentStage}
            />

            <InputField
                label="Mode of Procurement"
                value={pr.mode_of_procurement || ""}
                onChange={(val) =>
                    handleStageDataChange(
                        currentPR.id,
                        "pr",
                        "mode_of_procurement",
                        val,
                    )
                }
                disabled={!isCurrentStage}
            />

            <InputField
                label="Date of Implementation"
                type="date"
                value={pr.date_of_implementation || ""}
                onChange={(val) =>
                    handleStageDataChange(
                        currentPR.id,
                        "pr",
                        "date_of_implementation",
                        val,
                    )
                }
                disabled={!isCurrentStage}
            />
        </div>
    );
}
