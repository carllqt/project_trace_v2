import InputField from "@/Components/InputField";

export default function Stage2RFQForm({
    currentPR,
    isCurrentStage,
    handleStageDataChange,
}) {
    if (!currentPR) return null;

    const rfq = currentPR.stage_data?.rfq ?? {};

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
                label="Tax Identification No. (TIN)"
                placeholder="000-000-000-000"
                value={rfq.tin || ""}
                onChange={(e) =>
                    handleStageDataChange(
                        currentPR.id,
                        "rfq",
                        "tin",
                        e.target.value,
                    )
                }
                disabled={!isCurrentStage}
            />

            <InputField
                label="Winning Bidder / Vendor"
                placeholder="Enter winning supplier..."
                value={rfq.winner_bidder || ""}
                onChange={(e) =>
                    handleStageDataChange(
                        currentPR.id,
                        "rfq",
                        "winner_bidder",
                        e.target.value,
                    )
                }
                disabled={!isCurrentStage}
            />

            <InputField
                label="Address Contract"
                placeholder="Supplier business address"
                value={rfq.address_contract || ""}
                onChange={(e) =>
                    handleStageDataChange(
                        currentPR.id,
                        "rfq",
                        "address_contract",
                        e.target.value,
                    )
                }
                disabled={!isCurrentStage}
                fullWidth
            />

            <InputField
                label="Contact No."
                placeholder="+63 9XX XXX XXXX"
                value={rfq.contact_no || ""}
                onChange={(e) =>
                    handleStageDataChange(
                        currentPR.id,
                        "rfq",
                        "contact_no",
                        e.target.value,
                    )
                }
                disabled={!isCurrentStage}
            />

            <InputField
                label="Contract Amount (PHP)"
                type="number"
                placeholder="0.00"
                value={rfq.contract_amount || ""}
                onChange={(e) =>
                    handleStageDataChange(
                        currentPR.id,
                        "rfq",
                        "contract_amount",
                        e.target.value,
                    )
                }
                disabled={!isCurrentStage}
            />
        </div>
    );
}
