import InputField from "@/Components/InputField";

export default function Stage4DeliveryForm({
    currentPR,
    isCurrentStage,
    handleStageDataChange,
}) {
    if (!currentPR) return null;

    const delivery = currentPR.stage_data?.delivery ?? {};

    const getValue = (e) => (e?.target ? e.target.value : e);

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField
                label="IAR No. (Inspection Report)"
                placeholder="IAR-2026-XXXX"
                value={delivery.iar_no ?? ""}
                onChange={(e) =>
                    handleStageDataChange(
                        currentPR.id,
                        "delivery",
                        "iar_no",
                        getValue(e),
                    )
                }
                disabled={!isCurrentStage}
            />

            <InputField
                label="Date of Delivery"
                type="date"
                value={delivery.delivery_date ?? ""}
                onChange={(e) =>
                    handleStageDataChange(
                        currentPR.id,
                        "delivery",
                        "delivery_date",
                        getValue(e),
                    )
                }
                disabled={!isCurrentStage}
            />

            <InputField
                label="Date of Inspection"
                type="date"
                value={delivery.inspection_date ?? ""}
                onChange={(e) =>
                    handleStageDataChange(
                        currentPR.id,
                        "delivery",
                        "inspection_date",
                        getValue(e),
                    )
                }
                disabled={!isCurrentStage}
            />

            <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-600">
                    Delivery Status
                </label>

                <select
                    value={delivery.delivery_status ?? "Complete"}
                    onChange={(e) =>
                        handleStageDataChange(
                            currentPR.id,
                            "delivery",
                            "delivery_status",
                            e.target.value,
                        )
                    }
                    disabled={!isCurrentStage}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-slate-100"
                >
                    <option value="Complete">Complete Delivery</option>

                    <option value="Partial">Partial Delivery</option>
                </select>
            </div>
        </div>
    );
}
