import InputField from "@/Components/InputField";

export default function Stage3POForm({
    currentPR,
    isCurrentStage,
    handleStageDataChange,
}) {
    if (!currentPR) return null;

    const po = currentPR.stage_data?.po ?? {};
    const rfq = currentPR.stage_data?.rfq ?? {};

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField
                label="P.O. Number"
                placeholder="PO-2026-XXXX"
                value={po.po_no ?? ""}
                onChange={(e) =>
                    handleStageDataChange(
                        currentPR.id,
                        "po",
                        "po_no",
                        e.target.value,
                    )
                }
                disabled={!isCurrentStage}
            />

            <InputField
                label="Supplier Name"
                placeholder="Enter supplier name..."
                value={po.supplier_name ?? rfq.winner_bidder ?? ""}
                onChange={(e) =>
                    handleStageDataChange(
                        currentPR.id,
                        "po",
                        "supplier_name",
                        e.target.value,
                    )
                }
                disabled={!isCurrentStage}
            />

            <InputField
                label="Date of P.O."
                type="date"
                value={po.po_date ?? ""}
                onChange={(e) =>
                    handleStageDataChange(
                        currentPR.id,
                        "po",
                        "po_date",
                        e.target.value,
                    )
                }
                disabled={!isCurrentStage}
            />

            <InputField
                label="Date of Contract"
                type="date"
                value={po.contract_date ?? ""}
                onChange={(e) =>
                    handleStageDataChange(
                        currentPR.id,
                        "po",
                        "contract_date",
                        e.target.value,
                    )
                }
                disabled={!isCurrentStage}
            />

            <InputField
                label="Contract Amount"
                type="number"
                placeholder="0.00"
                value={po.amount ?? rfq.contract_amount ?? ""}
                onChange={(e) =>
                    handleStageDataChange(
                        currentPR.id,
                        "po",
                        "amount",
                        e.target.value,
                    )
                }
                disabled={!isCurrentStage}
            />

            <InputField
                label="Allotment Class"
                placeholder="e.g. MOOE / Capital Outlay"
                value={po.allotment_class ?? ""}
                onChange={(e) =>
                    handleStageDataChange(
                        currentPR.id,
                        "po",
                        "allotment_class",
                        e.target.value,
                    )
                }
                disabled={!isCurrentStage}
                fullWidth
            />
        </div>
    );
}
