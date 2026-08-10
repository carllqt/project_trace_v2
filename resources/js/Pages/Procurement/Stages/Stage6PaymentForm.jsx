import InputField from "@/Components/InputField";

export default function Stage6PaymentForm({
    currentPR,
    isCurrentStage,
    handleStageDataChange,
}) {
    if (!currentPR) return null;

    const payment = currentPR.stage_data?.payment ?? {};
    const capa = currentPR.stage_data?.capa ?? {};

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
                label="O.R.S. No."
                placeholder="ORS-2026-XXXX"
                value={payment.ors_no ?? ""}
                onChange={(val) =>
                    handleStageDataChange(
                        currentPR.id,
                        "payment",
                        "ors_no",
                        val,
                    )
                }
                disabled={!isCurrentStage}
            />

            <InputField
                label="ORS Date"
                type="date"
                value={payment.ors_date ?? ""}
                onChange={(val) =>
                    handleStageDataChange(
                        currentPR.id,
                        "payment",
                        "ors_date",
                        val,
                    )
                }
                disabled={!isCurrentStage}
            />

            <InputField
                label="Date Prepared"
                type="date"
                value={payment.date_prepared ?? ""}
                onChange={(val) =>
                    handleStageDataChange(
                        currentPR.id,
                        "payment",
                        "date_prepared",
                        val,
                    )
                }
                disabled={!isCurrentStage}
            />

            <InputField
                label="Date Crediting"
                type="date"
                value={payment.date_crediting ?? ""}
                onChange={(val) =>
                    handleStageDataChange(
                        currentPR.id,
                        "payment",
                        "date_crediting",
                        val,
                    )
                }
                disabled={!isCurrentStage}
            />

            <InputField
                label="CAPA: Calendar of Activities"
                type="date"
                value={capa.calendar_of_activities ?? ""}
                onChange={(val) =>
                    handleStageDataChange(
                        currentPR.id,
                        "capa",
                        "calendar_of_activities",
                        val,
                    )
                }
                disabled={!isCurrentStage}
                fullWidth
            />
        </div>
    );
}
