import InputField from "@/Components/InputField";

export default function Stage5ImplementationForm({
    currentPR,
    isCurrentStage,
    handleStageDataChange,
}) {
    if (!currentPR) return null;

    const implementation = currentPR.stage_data?.implementation ?? {};

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
                label="Implementation Date"
                type="date"
                value={implementation.implementation_date ?? ""}
                onChange={(val) =>
                    handleStageDataChange(
                        currentPR.id,
                        "implementation",
                        "implementation_date",
                        val,
                    )
                }
                disabled={!isCurrentStage}
            />

            <InputField
                label="Attendance Sheet Doc Reference"
                placeholder="e.g. Att_Sheet_Signed.pdf"
                value={implementation.attendance_sheet_name ?? ""}
                onChange={(val) =>
                    handleStageDataChange(
                        currentPR.id,
                        "implementation",
                        "attendance_sheet_name",
                        val,
                    )
                }
                disabled={!isCurrentStage}
            />

            <InputField
                label="Terminal Report Reference"
                placeholder="e.g. Final_Terminal_Report.pdf"
                value={implementation.terminal_report_name ?? ""}
                onChange={(val) =>
                    handleStageDataChange(
                        currentPR.id,
                        "implementation",
                        "terminal_report_name",
                        val,
                    )
                }
                disabled={!isCurrentStage}
                fullWidth
            />
        </div>
    );
}
