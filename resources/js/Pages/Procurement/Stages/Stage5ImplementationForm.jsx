import InputField from "@/Components/InputField";

export default function Stage5ImplementationForm({
    currentPR,
    isCurrentStage,
    handleStageDataChange,
}) {
    if (!currentPR) return null;

    const implementation = currentPR.stage_data?.implementation ?? {};

    const getValue = (e) => (e?.target ? e.target.value : e);

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField
                label="Implementation Date"
                type="date"
                value={implementation.implementation_date ?? ""}
                onChange={(e) =>
                    handleStageDataChange(
                        currentPR.id,
                        "implementation",
                        "implementation_date",
                        getValue(e),
                    )
                }
                disabled={!isCurrentStage}
            />

            <InputField
                label="Attendance Sheet Doc Reference"
                placeholder="e.g. Att_Sheet_Signed.pdf"
                value={implementation.attendance_sheet_name ?? ""}
                onChange={(e) =>
                    handleStageDataChange(
                        currentPR.id,
                        "implementation",
                        "attendance_sheet_name",
                        getValue(e),
                    )
                }
                disabled={!isCurrentStage}
            />

            <InputField
                label="Terminal Report Reference"
                placeholder="e.g. Final_Terminal_Report.pdf"
                value={implementation.terminal_report_name ?? ""}
                onChange={(e) =>
                    handleStageDataChange(
                        currentPR.id,
                        "implementation",
                        "terminal_report_name",
                        getValue(e),
                    )
                }
                disabled={!isCurrentStage}
                fullWidth
            />
        </div>
    );
}
