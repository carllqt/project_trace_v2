import InputField from "@/Components/InputField";

export default function Stage6PaymentForm({
    currentPR,
    isCurrentStage,
    handleStageDataChange,
}) {
    if (!currentPR) return null;

    const payment = currentPR.stage_data?.payment ?? {};
    const capa = currentPR.stage_data?.capa ?? {};

    const getValue = (e) => (e?.target ? e.target.value : e);

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField
                label="O.R.S. No."
                placeholder="ORS-2026-XXXX"
                value={payment.ors_no ?? ""}
                onChange={(e) =>
                    handleStageDataChange(
                        currentPR.id,
                        "payment",
                        "ors_no",
                        getValue(e),
                    )
                }
                disabled={!isCurrentStage}
            />

            <InputField
                label="ORS Date"
                type="date"
                value={payment.ors_date ?? ""}
                onChange={(e) =>
                    handleStageDataChange(
                        currentPR.id,
                        "payment",
                        "ors_date",
                        getValue(e),
                    )
                }
                disabled={!isCurrentStage}
            />

            <InputField
                label="Date Prepared"
                type="date"
                value={payment.date_prepared ?? ""}
                onChange={(e) =>
                    handleStageDataChange(
                        currentPR.id,
                        "payment",
                        "date_prepared",
                        getValue(e),
                    )
                }
                disabled={!isCurrentStage}
            />

            <InputField
                label="Date Crediting"
                type="date"
                value={payment.date_crediting ?? ""}
                onChange={(e) =>
                    handleStageDataChange(
                        currentPR.id,
                        "payment",
                        "date_crediting",
                        getValue(e),
                    )
                }
                disabled={!isCurrentStage}
            />

            <InputField
                label="CAPA: Calendar of Activities"
                type="date"
                value={capa.calendar_of_activities ?? ""}
                onChange={(e) =>
                    handleStageDataChange(
                        currentPR.id,
                        "capa",
                        "calendar_of_activities",
                        getValue(e),
                    )
                }
                disabled={!isCurrentStage}
                fullWidth
            />
        </div>
    );
}
