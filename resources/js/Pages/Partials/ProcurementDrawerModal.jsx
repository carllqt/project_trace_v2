import React, { useState, useEffect } from "react";

import {
    X,
    Check,
    FileText,
    History,
    Paperclip,
    AlertCircle,
    FileCheck,
    Download,
    Send,
    CornerUpLeft,
    RotateCcw,
    FileSpreadsheet,
} from "lucide-react";
import SidebarModal from "@/Components/SidebarModal";
import InputField from "@/Components/InputField";
import FileUploadField from "@/Components/FileUploadField";
import { DEPARTMENTS } from "@/constants";

// --- CONSTANTS ---
const STAGES = [
    {
        id: 1,
        name: "PR Preparation",
        actor: "End-User Dept",
        color: "from-blue-500 to-indigo-600",
        department: "BAC Secretariat",
        docs: ["Purchase Request", "PPMP"],
    },
    {
        id: 2,
        name: "RFQ & Bidding",
        actor: "BAC Secretariat",
        color: "from-indigo-500 to-purple-600",
        department: "BAC Secretariat",
        docs: ["RFQ Form", "Abstract of Bids"],
    },
    {
        id: 3,
        name: "Purchase Order",
        actor: "Procurement / Finance",
        color: "from-purple-500 to-pink-600",
        department: "Budget & Accounting",
        docs: ["Purchase Order", "NOA / NTP"],
    },
    {
        id: 4,
        name: "Delivery & Inspection",
        actor: "Supply & Property",
        color: "from-amber-500 to-orange-600",
        department: "Supply & Property Office",
        docs: ["Delivery Receipt", "Inspection Report (IAR)"],
    },
    {
        id: 5,
        name: "Implementation",
        actor: "End-User / Project Lead",
        color: "from-teal-500 to-emerald-600",
        department: "End User Department",
        docs: ["Activity Report", "Attendance Sheet"],
    },
    {
        id: 6,
        name: "Payment & CAPA",
        actor: "Accounting & Cashier",
        color: "from-emerald-500 to-green-600",
        department: "Accounting Office",
        docs: ["Disbursement Voucher", "ORS / BARS"],
    },
];

// Initial sample PR record
const SAMPLE_PR = {
    id: "PR-2026-0892",
    project_title: "Procurement of IT Equipment & Office Workstations",
    purpose: "Supplies and Hardware Upgrade for Q3 System Rollout",
    end_user: "IT Infrastructure Division",
    abc: "450000",
    mode_of_procurement: "Small Value Procurement (Sec 53.9)",
    stage: 2,
    status: "in_progress",
    route_status: "in_transit",
    current_department: "BAC Secretariat",
    stage_data: {
        pr: {
            pr_no: "PR-2026-0892",
            project_title: "Procurement of IT Equipment & Office Workstations",
            purpose: "Supplies and Hardware Upgrade for Q3 System Rollout",
            end_user: "IT Infrastructure Division",
            abc: "450000",
            mode_of_procurement: "Small Value Procurement (Sec 53.9)",
        },
        rfq: {
            tin: "123-456-789-000",
            winner_bidder: "TechCorp Solutions Inc.",
            address_contract: "123 Tech Avenue, Cyberzone, QC",
            contact_no: "+63 917 123 4567",
            contract_amount: "425000",
        },
        po: {
            po_no: "",
            po_date: "",
            contract_date: "",
            amount: "",
            allotment_class: "",
        },
        delivery: {
            iar_no: "",
            delivery_date: "",
            inspection_date: "",
            delivery_status: "Complete",
        },
        implementation: {
            implementation_date: "",
            attendance_sheet_name: "",
            terminal_report_name: "",
        },
        payment: {
            ors_no: "",
            ors_date: "",
            date_prepared: "",
            date_crediting: "",
        },
        capa: { calendar_of_activities: "" },
    },
    routes: [
        {
            id: 1,
            action: "Forwarded for RFQ",
            from_dept: "End User Department",
            to_dept: "BAC Secretariat",
            forwarded_at: "2026-08-01 09:30 AM",
            forwarded_by: "Juan Dela Cruz",
            received_by: "Maria Santos",
            remarks: "Complete document package submitted for canvas.",
        },
        {
            id: 2,
            action: "In Transit",
            from_dept: "BAC Secretariat",
            to_dept: "BAC Secretariat",
            forwarded_at: "2026-08-05 02:15 PM",
            forwarded_by: "Maria Santos",
            received_by: null,
            remarks: "Abstract of Bids completed. Awaiting acknowledgment.",
        },
    ],
    activity_logs: [
        {
            id: 1,
            user: "Juan Dela Cruz",
            action: "Created PR Record",
            details: "Initial PR draft generated.",
            timestamp: "2026-08-01 09:00 AM",
        },
        {
            id: 2,
            user: "Maria Santos",
            action: "Acknowledged Document",
            remarks: "PR accepted at BAC Secretariat",
            timestamp: "2026-08-01 10:00 AM",
        },
    ],
    documents: [
        {
            id: 1,
            name: "Approved_PR_2026_0892.pdf",
            stage: 1,
            type: "PDF Document",
            size: "1.2 MB",
        },
        {
            id: 2,
            name: "PPMP_Attachment_2026.pdf",
            stage: 1,
            type: "PDF Document",
            size: "3.4 MB",
        },
    ],
};

// --- HELPER / UI COMPONENTS ---
function RouteStatusBadge({ status }) {
    const styles = {
        in_transit: "bg-amber-100 text-amber-800 border-amber-300",
        received: "bg-emerald-100 text-emerald-800 border-emerald-300",
        returned: "bg-red-100 text-red-800 border-red-300",
        completed: "bg-blue-100 text-blue-800 border-blue-300",
    };

    const labels = {
        in_transit: "In Transit",
        received: "Received",
        returned: "Returned",
        completed: "Completed",
    };

    return (
        <span
            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${styles[status] || "bg-slate-100 text-slate-700"}`}
        >
            {labels[status] || status}
        </span>
    );
}

function TabButton({ label, icon, active, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`py-3 flex items-center gap-2 border-b-2 font-bold transition-all ${
                active
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}

// --- MAIN DRAWER MODAL COMPONENT ---
export default function ProcurementDrawerModal({
    isOpen,
    onClose,
    initialData,
    currentRole,
}) {
    if (!initialData) {
        return null;
    }
    const [currentPR, setCurrentPR] = useState(initialData);
    const [activeDrawerTab, setActiveDrawerTab] = useState("stage_form");
    const [showRoutingModal, setShowRoutingModal] = useState(false);
    const [routingType, setRoutingType] = useState("forward");
    const [targetDept, setTargetDept] = useState(DEPARTMENTS[1]);
    const [routingRemarks, setRoutingRemarks] = useState("");

    useEffect(() => {
        if (initialData) {
            setCurrentPR(initialData);
        }
    }, [initialData]);

    // Handle stage form input edits
    const handleStageDataChange = (prId, stageKey, field, value) => {
        setCurrentPR((prev) => ({
            ...prev,
            stage_data: {
                ...prev.stage_data,
                [stageKey]: {
                    ...prev.stage_data[stageKey],
                    [field]: value,
                },
            },
        }));
    };

    // Acknowledge Receipt Handler
    const handleReceivePR = (prId) => {
        const timestamp = new Date().toLocaleString();
        setCurrentPR((prev) => ({
            ...prev,
            route_status: "received",
            routes: prev.routes.map((rt, idx) =>
                idx === prev.routes.length - 1
                    ? { ...rt, received_by: currentRole.name }
                    : rt,
            ),
            activity_logs: [
                {
                    id: Date.now(),
                    user: currentRole.name,
                    action: "Acknowledged Document",
                    remarks: `Received document package at ${currentRole.dept}`,
                    timestamp,
                },
                ...prev.activity_logs,
            ],
        }));
    };

    // Dispatch / Forward Handler
    const handleForwardPR = (e) => {
        e.preventDefault();
        const timestamp = new Date().toLocaleString();
        const nextStage = Math.min(
            6,
            currentPR.stage + (currentPR.stage === 6 ? 0 : 1),
        );
        const isFinalStage = currentPR.stage === 6;

        setCurrentPR((prev) => ({
            ...prev,
            stage: nextStage,
            status: isFinalStage ? "completed" : "in_progress",
            route_status: isFinalStage ? "completed" : "in_transit",
            current_department: targetDept,
            routes: [
                ...prev.routes,
                {
                    id: Date.now(),
                    action: isFinalStage
                        ? "Finalized & Closed"
                        : `Forwarded to Stage ${nextStage}`,
                    from_dept: currentPR.current_department,
                    to_dept: targetDept,
                    forwarded_at: timestamp,
                    forwarded_by: currentRole.name,
                    received_by: null,
                    remarks: routingRemarks,
                },
            ],
            activity_logs: [
                {
                    id: Date.now(),
                    user: currentRole.name,
                    action: isFinalStage
                        ? "Completed Procurement"
                        : `Forwarded to ${targetDept}`,
                    details: routingRemarks,
                    timestamp,
                },
                ...prev.activity_logs,
            ],
        }));

        setRoutingRemarks("");
        setShowRoutingModal(false);
    };

    // Return Handler
    const handleReturnPR = (e) => {
        e.preventDefault();
        const timestamp = new Date().toLocaleString();
        const prevStage = Math.max(1, currentPR.stage - 1);

        setCurrentPR((prev) => ({
            ...prev,
            stage: prevStage,
            route_status: "returned",
            current_department: targetDept,
            routes: [
                ...prev.routes,
                {
                    id: Date.now(),
                    action: `Returned to Stage ${prevStage}`,
                    from_dept: currentPR.current_department,
                    to_dept: targetDept,
                    forwarded_at: timestamp,
                    forwarded_by: currentRole.name,
                    received_by: null,
                    remarks: routingRemarks,
                },
            ],
            activity_logs: [
                {
                    id: Date.now(),
                    user: currentRole.name,
                    action: `Returned Document to ${targetDept}`,
                    details: routingRemarks,
                    timestamp,
                },
                ...prev.activity_logs,
            ],
        }));

        setRoutingRemarks("");
        setShowRoutingModal(false);
    };

    return (
        <SidebarModal
            isOpen={isOpen}
            onClose={onClose}
            title={`PR Tracker: ${currentPR.id}`}
            icon={<FileSpreadsheet className="w-5 h-5 text-white" />}
        >
            <div className="-m-6 flex flex-col h-[calc(100vh-4rem)] bg-white">
                {/* Header Summary Sub-Bar */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-black text-slate-800">
                                {currentPR.id}
                            </h2>
                            <RouteStatusBadge status={currentPR.route_status} />
                        </div>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">
                            {currentPR.project_title}
                        </p>
                    </div>
                </div>

                {/* Stepper Header Bar */}
                <div className="px-6 py-3 bg-slate-50/80 border-b border-slate-100 overflow-x-auto">
                    <div className="flex items-center justify-between min-w-[500px]">
                        {STAGES.map((s) => {
                            const isDone =
                                s.id < currentPR.stage ||
                                currentPR.status === "completed";
                            const isCurrent =
                                s.id === currentPR.stage &&
                                currentPR.status !== "completed";

                            return (
                                <div
                                    key={s.id}
                                    className="flex items-center flex-1"
                                >
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`
                      w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs transition-all shadow-sm
                      ${
                          isDone
                              ? "bg-emerald-500 text-white"
                              : isCurrent
                                ? "bg-blue-600 text-white ring-4 ring-blue-100"
                                : "bg-slate-200 text-slate-500"
                      }
                    `}
                                        >
                                            {isDone ? (
                                                <Check className="w-3.5 h-3.5" />
                                            ) : (
                                                s.id
                                            )}
                                        </div>
                                        <span
                                            className={`text-[10px] font-bold mt-1 max-w-[65px] text-center truncate ${
                                                isCurrent
                                                    ? "text-blue-700"
                                                    : "text-slate-500"
                                            }`}
                                        >
                                            {s.name}
                                        </span>
                                    </div>
                                    {s.id !== 6 && (
                                        <div
                                            className={`h-0.5 flex-1 mx-1 ${
                                                s.id < currentPR.stage
                                                    ? "bg-emerald-500"
                                                    : "bg-slate-200"
                                            }`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Drawer Sub-Navigation Tabs */}
                <div className="px-6 border-b border-slate-100 flex gap-6 bg-white text-xs font-bold shrink-0">
                    <TabButton
                        label="Active Stage Form & Data"
                        icon={<FileText className="w-3.5 h-3.5" />}
                        active={activeDrawerTab === "stage_form"}
                        onClick={() => setActiveDrawerTab("stage_form")}
                    />
                    <TabButton
                        label={`Routing History (${currentPR.routes.length})`}
                        icon={<History className="w-3.5 h-3.5" />}
                        active={activeDrawerTab === "routing_history"}
                        onClick={() => setActiveDrawerTab("routing_history")}
                    />
                    <TabButton
                        label={`Documents Vault (${currentPR.documents.length})`}
                        icon={<Paperclip className="w-3.5 h-3.5" />}
                        active={activeDrawerTab === "documents"}
                        onClick={() => setActiveDrawerTab("documents")}
                    />
                </div>

                {/* Scrollable Drawer Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* TAB 1: STAGE FORMS */}
                    {activeDrawerTab === "stage_form" && (
                        <div className="space-y-6">
                            {/* Action Banner if Document Needs to be Received */}
                            {currentPR.route_status === "in_transit" &&
                                currentPR.current_department
                                    .toLowerCase()
                                    .includes(
                                        currentRole.dept.toLowerCase(),
                                    ) && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs font-bold text-amber-900">
                                                    Document Dispatched to Your
                                                    Office
                                                </p>
                                                <p className="text-[11px] text-amber-700">
                                                    Please confirm receipt
                                                    before updating stage
                                                    records or forwarding.
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() =>
                                                handleReceivePR(currentPR.id)
                                            }
                                            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                                        >
                                            <FileCheck className="w-4 h-4" />
                                            <span>Acknowledge Receipt</span>
                                        </button>
                                    </div>
                                )}

                            {/* Stage Forms Accordion List */}
                            {STAGES.map((stg) => {
                                const isCurrentStage =
                                    currentPR.stage === stg.id;
                                const isPassedStage =
                                    currentPR.stage > stg.id ||
                                    currentPR.status === "completed";

                                return (
                                    <div
                                        key={stg.id}
                                        className={`
                      rounded-2xl border transition-all overflow-hidden
                      ${
                          isCurrentStage
                              ? "border-blue-300 bg-white shadow-md ring-1 ring-blue-100"
                              : isPassedStage
                                ? "border-slate-200 bg-slate-50/50 opacity-90"
                                : "border-slate-100 bg-slate-50/30 opacity-60"
                      }
                    `}
                                    >
                                        {/* Section Header */}
                                        <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <span
                                                    className={`
                          w-6 h-6 rounded-lg text-white font-bold text-xs flex items-center justify-center
                          bg-gradient-to-tr ${stg.color}
                        `}
                                                >
                                                    {stg.id}
                                                </span>
                                                <span className="font-bold text-xs text-slate-800">
                                                    Stage {stg.id}: {stg.name}
                                                </span>
                                            </div>
                                            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-200/70 text-slate-600">
                                                Actor: {stg.actor}
                                            </span>
                                        </div>

                                        {/* Section Body Fields */}
                                        <div className="p-5">
                                            {/* Stage 1: PR */}
                                            {stg.id === 1 && (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <InputField
                                                        label="PR No."
                                                        value={
                                                            currentPR.stage_data
                                                                .pr.pr_no ||
                                                            currentPR.id
                                                        }
                                                        disabled
                                                    />
                                                    <InputField
                                                        label="Project Title"
                                                        value={
                                                            currentPR.stage_data
                                                                .pr
                                                                .project_title
                                                        }
                                                        onChange={(val) =>
                                                            handleStageDataChange(
                                                                currentPR.id,
                                                                "pr",
                                                                "project_title",
                                                                val,
                                                            )
                                                        }
                                                        disabled={
                                                            !isCurrentStage
                                                        }
                                                    />
                                                    <InputField
                                                        label="Purpose"
                                                        value={
                                                            currentPR.stage_data
                                                                .pr.purpose
                                                        }
                                                        onChange={(val) =>
                                                            handleStageDataChange(
                                                                currentPR.id,
                                                                "pr",
                                                                "purpose",
                                                                val,
                                                            )
                                                        }
                                                        disabled={
                                                            !isCurrentStage
                                                        }
                                                        fullWidth
                                                    />
                                                    <InputField
                                                        label="End User Department"
                                                        value={
                                                            currentPR.stage_data
                                                                .pr.end_user
                                                        }
                                                        onChange={(val) =>
                                                            handleStageDataChange(
                                                                currentPR.id,
                                                                "pr",
                                                                "end_user",
                                                                val,
                                                            )
                                                        }
                                                        disabled={
                                                            !isCurrentStage
                                                        }
                                                    />
                                                    <InputField
                                                        label="ABC (Approved Budget)"
                                                        type="number"
                                                        value={
                                                            currentPR.stage_data
                                                                .pr.abc
                                                        }
                                                        onChange={(val) =>
                                                            handleStageDataChange(
                                                                currentPR.id,
                                                                "pr",
                                                                "abc",
                                                                val,
                                                            )
                                                        }
                                                        disabled={
                                                            !isCurrentStage
                                                        }
                                                    />
                                                    <InputField
                                                        label="Mode of Procurement"
                                                        value={
                                                            currentPR.stage_data
                                                                .pr
                                                                .mode_of_procurement
                                                        }
                                                        onChange={(val) =>
                                                            handleStageDataChange(
                                                                currentPR.id,
                                                                "pr",
                                                                "mode_of_procurement",
                                                                val,
                                                            )
                                                        }
                                                        disabled={
                                                            !isCurrentStage
                                                        }
                                                    />
                                                </div>
                                            )}

                                            {/* Stage 2: RFQ */}
                                            {stg.id === 2 && (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <InputField
                                                        label="Tax Identification No. (TIN)"
                                                        placeholder="000-000-000-000"
                                                        value={
                                                            currentPR.stage_data
                                                                .rfq.tin
                                                        }
                                                        onChange={(val) =>
                                                            handleStageDataChange(
                                                                currentPR.id,
                                                                "rfq",
                                                                "tin",
                                                                val,
                                                            )
                                                        }
                                                        disabled={
                                                            !isCurrentStage
                                                        }
                                                    />
                                                    <InputField
                                                        label="Winning Bidder / Vendor"
                                                        placeholder="Enter winning supplier..."
                                                        value={
                                                            currentPR.stage_data
                                                                .rfq
                                                                .winner_bidder
                                                        }
                                                        onChange={(val) =>
                                                            handleStageDataChange(
                                                                currentPR.id,
                                                                "rfq",
                                                                "winner_bidder",
                                                                val,
                                                            )
                                                        }
                                                        disabled={
                                                            !isCurrentStage
                                                        }
                                                    />
                                                    <InputField
                                                        label="Address Contract"
                                                        placeholder="Supplier business address"
                                                        value={
                                                            currentPR.stage_data
                                                                .rfq
                                                                .address_contract
                                                        }
                                                        onChange={(val) =>
                                                            handleStageDataChange(
                                                                currentPR.id,
                                                                "rfq",
                                                                "address_contract",
                                                                val,
                                                            )
                                                        }
                                                        disabled={
                                                            !isCurrentStage
                                                        }
                                                        fullWidth
                                                    />
                                                    <InputField
                                                        label="Contact No."
                                                        placeholder="+63 9XX XXX XXXX"
                                                        value={
                                                            currentPR.stage_data
                                                                .rfq.contact_no
                                                        }
                                                        onChange={(val) =>
                                                            handleStageDataChange(
                                                                currentPR.id,
                                                                "rfq",
                                                                "contact_no",
                                                                val,
                                                            )
                                                        }
                                                        disabled={
                                                            !isCurrentStage
                                                        }
                                                    />
                                                    <InputField
                                                        label="Contract Amount (PHP)"
                                                        type="number"
                                                        placeholder="0.00"
                                                        value={
                                                            currentPR.stage_data
                                                                .rfq
                                                                .contract_amount
                                                        }
                                                        onChange={(val) =>
                                                            handleStageDataChange(
                                                                currentPR.id,
                                                                "rfq",
                                                                "contract_amount",
                                                                val,
                                                            )
                                                        }
                                                        disabled={
                                                            !isCurrentStage
                                                        }
                                                    />
                                                </div>
                                            )}

                                            {/* Stage 3: PO */}
                                            {stg.id === 3 && (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <InputField
                                                        label="P.O. Number"
                                                        placeholder="PO-2026-XXXX"
                                                        value={
                                                            currentPR.stage_data
                                                                .po.po_no
                                                        }
                                                        onChange={(val) =>
                                                            handleStageDataChange(
                                                                currentPR.id,
                                                                "po",
                                                                "po_no",
                                                                val,
                                                            )
                                                        }
                                                        disabled={
                                                            !isCurrentStage
                                                        }
                                                    />
                                                    <InputField
                                                        label="Date of P.O."
                                                        type="date"
                                                        value={
                                                            currentPR.stage_data
                                                                .po.po_date
                                                        }
                                                        onChange={(val) =>
                                                            handleStageDataChange(
                                                                currentPR.id,
                                                                "po",
                                                                "po_date",
                                                                val,
                                                            )
                                                        }
                                                        disabled={
                                                            !isCurrentStage
                                                        }
                                                    />
                                                    <InputField
                                                        label="Date of Contract"
                                                        type="date"
                                                        value={
                                                            currentPR.stage_data
                                                                .po
                                                                .contract_date
                                                        }
                                                        onChange={(val) =>
                                                            handleStageDataChange(
                                                                currentPR.id,
                                                                "po",
                                                                "contract_date",
                                                                val,
                                                            )
                                                        }
                                                        disabled={
                                                            !isCurrentStage
                                                        }
                                                    />
                                                    <InputField
                                                        label="Contract Amount"
                                                        type="number"
                                                        value={
                                                            currentPR.stage_data
                                                                .po.amount ||
                                                            currentPR.stage_data
                                                                .rfq
                                                                .contract_amount
                                                        }
                                                        onChange={(val) =>
                                                            handleStageDataChange(
                                                                currentPR.id,
                                                                "po",
                                                                "amount",
                                                                val,
                                                            )
                                                        }
                                                        disabled={
                                                            !isCurrentStage
                                                        }
                                                    />
                                                    <InputField
                                                        label="Allotment Class"
                                                        placeholder="e.g. MOOE / Capital Outlay"
                                                        value={
                                                            currentPR.stage_data
                                                                .po
                                                                .allotment_class
                                                        }
                                                        onChange={(val) =>
                                                            handleStageDataChange(
                                                                currentPR.id,
                                                                "po",
                                                                "allotment_class",
                                                                val,
                                                            )
                                                        }
                                                        disabled={
                                                            !isCurrentStage
                                                        }
                                                        fullWidth
                                                    />
                                                </div>
                                            )}

                                            {/* Stage 4: Delivery */}
                                            {stg.id === 4 && (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <InputField
                                                        label="IAR No. (Inspection Report)"
                                                        placeholder="IAR-2026-XXXX"
                                                        value={
                                                            currentPR.stage_data
                                                                .delivery.iar_no
                                                        }
                                                        onChange={(val) =>
                                                            handleStageDataChange(
                                                                currentPR.id,
                                                                "delivery",
                                                                "iar_no",
                                                                val,
                                                            )
                                                        }
                                                        disabled={
                                                            !isCurrentStage
                                                        }
                                                    />
                                                    <InputField
                                                        label="Date of Delivery"
                                                        type="date"
                                                        value={
                                                            currentPR.stage_data
                                                                .delivery
                                                                .delivery_date
                                                        }
                                                        onChange={(val) =>
                                                            handleStageDataChange(
                                                                currentPR.id,
                                                                "delivery",
                                                                "delivery_date",
                                                                val,
                                                            )
                                                        }
                                                        disabled={
                                                            !isCurrentStage
                                                        }
                                                    />
                                                    <InputField
                                                        label="Date of Inspection"
                                                        type="date"
                                                        value={
                                                            currentPR.stage_data
                                                                .delivery
                                                                .inspection_date
                                                        }
                                                        onChange={(val) =>
                                                            handleStageDataChange(
                                                                currentPR.id,
                                                                "delivery",
                                                                "inspection_date",
                                                                val,
                                                            )
                                                        }
                                                        disabled={
                                                            !isCurrentStage
                                                        }
                                                    />
                                                    <div>
                                                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                                            Delivery Status
                                                        </label>
                                                        <select
                                                            value={
                                                                currentPR
                                                                    .stage_data
                                                                    .delivery
                                                                    .delivery_status
                                                            }
                                                            onChange={(e) =>
                                                                handleStageDataChange(
                                                                    currentPR.id,
                                                                    "delivery",
                                                                    "delivery_status",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            disabled={
                                                                !isCurrentStage
                                                            }
                                                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-slate-100"
                                                        >
                                                            <option value="Complete">
                                                                Complete
                                                                Delivery
                                                            </option>
                                                            <option value="Partial">
                                                                Partial Delivery
                                                            </option>
                                                        </select>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Stage 5: Implementation */}
                                            {stg.id === 5 && (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <InputField
                                                        label="Implementation Date"
                                                        type="date"
                                                        value={
                                                            currentPR.stage_data
                                                                .implementation
                                                                .implementation_date
                                                        }
                                                        onChange={(val) =>
                                                            handleStageDataChange(
                                                                currentPR.id,
                                                                "implementation",
                                                                "implementation_date",
                                                                val,
                                                            )
                                                        }
                                                        disabled={
                                                            !isCurrentStage
                                                        }
                                                    />
                                                    <InputField
                                                        label="Attendance Sheet Doc Reference"
                                                        placeholder="e.g. Att_Sheet_Signed.pdf"
                                                        value={
                                                            currentPR.stage_data
                                                                .implementation
                                                                .attendance_sheet_name
                                                        }
                                                        onChange={(val) =>
                                                            handleStageDataChange(
                                                                currentPR.id,
                                                                "implementation",
                                                                "attendance_sheet_name",
                                                                val,
                                                            )
                                                        }
                                                        disabled={
                                                            !isCurrentStage
                                                        }
                                                    />
                                                    <InputField
                                                        label="Terminal Report Reference"
                                                        placeholder="e.g. Final_Terminal_Report.pdf"
                                                        value={
                                                            currentPR.stage_data
                                                                .implementation
                                                                .terminal_report_name
                                                        }
                                                        onChange={(val) =>
                                                            handleStageDataChange(
                                                                currentPR.id,
                                                                "implementation",
                                                                "terminal_report_name",
                                                                val,
                                                            )
                                                        }
                                                        disabled={
                                                            !isCurrentStage
                                                        }
                                                        fullWidth
                                                    />
                                                </div>
                                            )}

                                            {/* Stage 6: Payment */}
                                            {stg.id === 6 && (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <InputField
                                                        label="O.R.S. No."
                                                        placeholder="ORS-2026-XXXX"
                                                        value={
                                                            currentPR.stage_data
                                                                .payment.ors_no
                                                        }
                                                        onChange={(val) =>
                                                            handleStageDataChange(
                                                                currentPR.id,
                                                                "payment",
                                                                "ors_no",
                                                                val,
                                                            )
                                                        }
                                                        disabled={
                                                            !isCurrentStage
                                                        }
                                                    />
                                                    <InputField
                                                        label="ORS Date"
                                                        type="date"
                                                        value={
                                                            currentPR.stage_data
                                                                .payment
                                                                .ors_date
                                                        }
                                                        onChange={(val) =>
                                                            handleStageDataChange(
                                                                currentPR.id,
                                                                "payment",
                                                                "ors_date",
                                                                val,
                                                            )
                                                        }
                                                        disabled={
                                                            !isCurrentStage
                                                        }
                                                    />
                                                    <InputField
                                                        label="Date Prepared"
                                                        type="date"
                                                        value={
                                                            currentPR.stage_data
                                                                .payment
                                                                .date_prepared
                                                        }
                                                        onChange={(val) =>
                                                            handleStageDataChange(
                                                                currentPR.id,
                                                                "payment",
                                                                "date_prepared",
                                                                val,
                                                            )
                                                        }
                                                        disabled={
                                                            !isCurrentStage
                                                        }
                                                    />
                                                    <InputField
                                                        label="Date Crediting"
                                                        type="date"
                                                        value={
                                                            currentPR.stage_data
                                                                .payment
                                                                .date_crediting
                                                        }
                                                        onChange={(val) =>
                                                            handleStageDataChange(
                                                                currentPR.id,
                                                                "payment",
                                                                "date_crediting",
                                                                val,
                                                            )
                                                        }
                                                        disabled={
                                                            !isCurrentStage
                                                        }
                                                    />
                                                    <InputField
                                                        label="CAPA: Calendar of Activities"
                                                        type="date"
                                                        value={
                                                            currentPR.stage_data
                                                                .capa
                                                                .calendar_of_activities
                                                        }
                                                        onChange={(val) =>
                                                            handleStageDataChange(
                                                                currentPR.id,
                                                                "capa",
                                                                "calendar_of_activities",
                                                                val,
                                                            )
                                                        }
                                                        disabled={
                                                            !isCurrentStage
                                                        }
                                                        fullWidth
                                                    />
                                                </div>
                                            )}

                                            {/* Stage Documents Footer */}
                                            <div className="mt-4 pt-3 border-t border-slate-100">
                                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                                                    Required Stage Uploads:{" "}
                                                    {stg.docs.join(", ")}
                                                </span>
                                                {isCurrentStage && (
                                                    <FileUploadField
                                                        label={`Attach File for Stage ${stg.id}`}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* TAB 2: ROUTING HISTORY */}
                    {activeDrawerTab === "routing_history" && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Send className="w-4 h-4 text-blue-600" />
                                    <span>Procurement Routing Trail</span>
                                </h3>
                                <div className="relative border-l-2 border-blue-100 pl-4 space-y-6 ml-2">
                                    {currentPR.routes.map((rt) => (
                                        <div
                                            key={rt.id}
                                            className="relative group"
                                        >
                                            <div className="absolute -left-[21px] top-1 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-blue-50 border-2 border-white"></div>
                                            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:border-blue-300 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <span className="text-xs font-bold text-blue-700">
                                                            {rt.action}
                                                        </span>
                                                        <p className="text-[11px] font-semibold text-slate-800">
                                                            From: {rt.from_dept}{" "}
                                                            → To: {rt.to_dept}
                                                        </p>
                                                    </div>
                                                    <span className="text-[10px] text-slate-400 font-medium">
                                                        {rt.forwarded_at}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                                                    "
                                                    {rt.remarks ||
                                                        "No remarks added."}
                                                    "
                                                </p>
                                                <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                                                    <span>
                                                        Dispatched by:{" "}
                                                        <strong className="text-slate-600">
                                                            {rt.forwarded_by}
                                                        </strong>
                                                    </span>
                                                    {rt.received_by && (
                                                        <span>
                                                            Received by:{" "}
                                                            <strong className="text-emerald-700">
                                                                {rt.received_by}
                                                            </strong>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* System Audit Logs */}
                            <div className="pt-4 border-t border-slate-100">
                                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <History className="w-4 h-4 text-indigo-600" />
                                    <span>System Audit Trail</span>
                                </h3>
                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 space-y-3">
                                    {currentPR.activity_logs.map((log) => (
                                        <div
                                            key={log.id}
                                            className="text-xs flex items-start justify-between border-b border-slate-200/40 pb-2 last:border-0 last:pb-0"
                                        >
                                            <div>
                                                <span className="font-bold text-slate-800">
                                                    {log.user}
                                                </span>
                                                <span className="text-slate-500 mx-1.5">
                                                    •
                                                </span>
                                                <span className="font-semibold text-blue-600">
                                                    {log.action}
                                                </span>
                                                <p className="text-slate-500 text-[11px] mt-0.5">
                                                    {log.details || log.remarks}
                                                </p>
                                            </div>
                                            <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                                                {log.timestamp}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: DOCUMENTS */}
                    {activeDrawerTab === "documents" && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Attached File Artifacts
                                </h3>
                                <span className="text-xs text-slate-500">
                                    {currentPR.documents.length} Attachment(s)
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {currentPR.documents.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between shadow-sm hover:border-blue-300 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div className="truncate">
                                                <p className="text-xs font-bold text-slate-800 truncate">
                                                    {doc.name}
                                                </p>
                                                <p className="text-[10px] text-slate-400">
                                                    Stage {doc.stage} •{" "}
                                                    {doc.type} • {doc.size}
                                                </p>
                                            </div>
                                        </div>
                                        <button className="p-2 text-slate-400 hover:text-blue-600 rounded-xl hover:bg-slate-50">
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <FileUploadField label="Upload Additional Document" />
                        </div>
                    )}
                </div>

                {/* Drawer Bottom Action Bar */}
                <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
                    <div>
                        <span className="text-[11px] text-slate-400 font-semibold block">
                            Active Holder Department:
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                            {currentPR.current_department}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {currentPR.stage > 1 &&
                            currentPR.status !== "completed" && (
                                <button
                                    onClick={() => {
                                        setRoutingType("return");
                                        setTargetDept(
                                            STAGES[
                                                Math.max(0, currentPR.stage - 2)
                                            ].department,
                                        );
                                        setShowRoutingModal(true);
                                    }}
                                    className="px-4 py-2.5 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                                >
                                    <CornerUpLeft className="w-4 h-4" />
                                    <span>Return / Revise</span>
                                </button>
                            )}

                        {currentPR.status !== "completed" && (
                            <button
                                onClick={() => {
                                    setRoutingType("forward");
                                    setTargetDept(
                                        STAGES[Math.min(5, currentPR.stage)]
                                            .department,
                                    );
                                    setShowRoutingModal(true);
                                }}
                                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
                            >
                                <Send className="w-4 h-4" />
                                <span>
                                    {currentPR.stage === 6
                                        ? "Finalize & Close Payment"
                                        : "Dispatch / Forward Stage"}
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* INNER DISPATCH/RETURN CONFIRMATION MODAL */}
            {showRoutingModal && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={() => setShowRoutingModal(false)}
                    />
                    <div className="relative bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-white/80 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                            <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                                {routingType === "forward" ? (
                                    <Send className="w-5 h-5 text-blue-600" />
                                ) : (
                                    <RotateCcw className="w-5 h-5 text-red-600" />
                                )}
                                <span>
                                    {routingType === "forward"
                                        ? "Forward / Dispatch Procurement Document"
                                        : "Return Procurement to Previous Stage"}
                                </span>
                            </h3>
                            <button
                                onClick={() => setShowRoutingModal(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form
                            onSubmit={
                                routingType === "forward"
                                    ? handleForwardPR
                                    : handleReturnPR
                            }
                            className="mt-4 space-y-4"
                        >
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Target Department Destination
                                </label>
                                <select
                                    value={targetDept}
                                    onChange={(e) =>
                                        setTargetDept(e.target.value)
                                    }
                                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    {DEPARTMENTS.map((d) => (
                                        <option key={d} value={d}>
                                            {d}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Dispatch & Audit Remarks
                                </label>
                                <textarea
                                    rows={3}
                                    required
                                    value={routingRemarks}
                                    onChange={(e) =>
                                        setRoutingRemarks(e.target.value)
                                    }
                                    placeholder={
                                        routingType === "forward"
                                            ? "Enter notes regarding document validation, contents, or action needed..."
                                            : "Specify reasons for return and missing items..."
                                    }
                                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowRoutingModal(false)}
                                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-md ${
                                        routingType === "forward"
                                            ? "bg-blue-600 hover:bg-blue-700"
                                            : "bg-red-600 hover:bg-red-700"
                                    }`}
                                >
                                    Confirm Dispatch
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </SidebarModal>
    );
}
