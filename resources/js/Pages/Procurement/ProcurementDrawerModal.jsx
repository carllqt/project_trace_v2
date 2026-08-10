import React, { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import { FileSpreadsheet } from "lucide-react";
import SidebarModal from "@/Components/SidebarModal";
import { DEPARTMENTS } from "@/constants";
import RoutingModal from "./Partials/RoutingModal";
import StageFormsTab from "./Partials/StageFormsTab";
import RoutingHistoryTab from "./Routing/RoutingHistoryTab";
import DocumentsTab from "./Documents/DocumentsTab";
import ProcurementStageStepper from "./Partials/ProcurementStageStepper";
import ProcurementDrawerTabs from "./Partials/ProcurementDrawerTabs";
import ProcurementDrawerHeader from "./Partials/ProcurementDrawerHeader";
import ProcurementDrawerActionBar from "./Partials/ProcurementDrawerActionBar";
import { normalizePR } from "@/utils/utils";
// ---------------------------------------------------------
// PROCUREMENT STAGES
// ---------------------------------------------------------
const STAGES = [
    {
        id: 1,
        name: "PR Preparation",
        actor: "End-User Dept",
        color: "from-blue-500 to-indigo-600",
        department: "End User Department",
    },
    {
        id: 2,
        name: "RFQ Preparation",
        actor: "BAC Secretariat",
        color: "from-indigo-500 to-purple-600",
        department: "BAC Secretariat",
    },
    {
        id: 3,
        name: "Purchase Order",
        actor: "Procurement / Finance",
        color: "from-purple-500 to-pink-600",
        department: "Budget & Accounting",
    },
    {
        id: 4,
        name: "Delivery",
        actor: "Supply & Property",
        color: "from-amber-500 to-orange-600",
        department: "Supply & Property Office",
    },
    {
        id: 5,
        name: "Implementation",
        actor: "End-User / Project Lead",
        color: "from-teal-500 to-emerald-600",
        department: "End User Department",
    },
    {
        id: 6,
        name: "Payment Processing",
        actor: "Accounting & Cashier",
        color: "from-emerald-500 to-green-600",
        department: "Accounting Office",
    },
    {
        id: 7,
        name: "Completed",
        actor: "Completed",
        color: "from-green-500 to-emerald-600",
        department: "Completed",
        docs: [],
    },
];
// ---------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------
export default function ProcurementDrawerModal({
    isOpen,
    onClose,
    initialData,
    currentRole,
}) {
    const [currentPR, setCurrentPR] = useState(() => normalizePR(initialData));
    const [activeDrawerTab, setActiveDrawerTab] = useState("stage_form");
    const [showRoutingModal, setShowRoutingModal] = useState(false);
    const [routingType, setRoutingType] = useState("forward");
    const [defaultTargetDept, setDefaultTargetDept] = useState("");
    const [targetDept, setTargetDept] = useState("");
    const [stageFiles, setStageFiles] = useState({});
    // ---------------------------------------------------------
    // ROLE / DEPARTMENT ACCESS
    // ---------------------------------------------------------
    const userDepartment = (currentRole?.dept ?? "").trim().toLowerCase();
    const assignedDepartment = (currentPR?.current_department ?? "")
        .trim()
        .toLowerCase();
    /**
     * IMPORTANT ACCESS RULE:
     *
     * Only the department currently assigned to the PR
     * can edit the stage form, upload documents,
     * receive, forward, or return the PR.
     */
    const canAccessCurrentStage =
        currentPR?.status !== "completed" &&
        userDepartment !== "" &&
        assignedDepartment !== "" &&
        userDepartment === assignedDepartment;
    const canEditStageForm = canAccessCurrentStage;
    const canUploadDocuments = canAccessCurrentStage;
    const canRoute = canAccessCurrentStage;
    // ---------------------------------------------------------
    // UPDATE WHEN INITIAL DATA CHANGES
    // ---------------------------------------------------------
    useEffect(() => {
        if (!initialData) {
            setCurrentPR(null);
            return;
        }
        const normalized = normalizePR(initialData);
        setCurrentPR(normalized);
        setDefaultTargetDept(normalized?.current_department ?? "");
        setTargetDept(normalized?.current_department ?? "");
    }, [initialData]);
    // ---------------------------------------------------------
    // STAGE DATA CHANGE
    // ---------------------------------------------------------
    const handleStageDataChange = (prId, stageKey, field, value) => {
        // Prevent unauthorized users from modifying data
        if (!canEditStageForm) {
            return;
        }
        setCurrentPR((prev) => {
            if (!prev) {
                return prev;
            }
            return {
                ...prev,
                stage_data: {
                    ...(prev.stage_data ?? {}),
                    [stageKey]: {
                        ...(prev.stage_data?.[stageKey] ?? {}),
                        [field]: value,
                    },
                },
            };
        });
    };
    // ---------------------------------------------------------
    // RECEIVE PR
    // ---------------------------------------------------------
    const handleReceivePR = (prId) => {
        if (!currentPR || !canAccessCurrentStage) {
            return;
        }
        const timestamp = new Date().toLocaleString();
        const roleName = currentRole?.name ?? "Current User";
        const roleDept =
            currentRole?.dept ?? currentPR.current_department ?? "";
        setCurrentPR((prev) => {
            if (!prev) {
                return prev;
            }
            const routes = [...(prev.routes ?? [])];
            if (routes.length > 0) {
                const lastIndex = routes.length - 1;
                routes[lastIndex] = {
                    ...routes[lastIndex],
                    received_by: roleName,
                    received_at: timestamp,
                };
            }
            return {
                ...prev,
                route_status: "received",
                routes,
                activity_logs: [
                    {
                        id: Date.now(),
                        user: roleName,
                        action: "Acknowledged Document",
                        remarks: `Received document package at ${roleDept}`,
                        timestamp,
                    },
                    ...(prev.activity_logs ?? []),
                ],
            };
        });
    };
    // ---------------------------------------------------------
    // FORWARD
    // ---------------------------------------------------------
    const handleForwardPR = (e) => {
        e?.preventDefault();
        if (!currentPR || !canAccessCurrentStage) {
            return;
        }
        const currentStage = Number(currentPR.stage) || 1;
        const currentStageIndex = STAGES.findIndex(
            (stage) => Number(stage.id) === currentStage,
        );
        const nextStage = STAGES[currentStageIndex + 1];
        const isFinalStage =
            !nextStage || currentStageIndex === STAGES.length - 1;
        const nextStageNumber = isFinalStage
            ? currentStage
            : Number(nextStage.id);
        const timestamp = new Date().toLocaleString();
        const roleName = currentRole?.name ?? "Current User";
        const destination =
            targetDept ||
            defaultTargetDept ||
            nextStage?.department ||
            currentPR.current_department ||
            "";
        setCurrentPR((prev) => {
            if (!prev) {
                return prev;
            }
            return {
                ...prev,
                stage: nextStageNumber,
                status: isFinalStage ? "completed" : "in_progress",
                route_status: isFinalStage ? "completed" : "in_transit",
                // THIS IS WHAT TRANSFERS ACCESS
                current_department: destination,
                routes: [
                    ...(prev.routes ?? []),
                    {
                        id: Date.now(),
                        action: isFinalStage
                            ? "Finalized & Closed"
                            : `Forwarded to Stage ${nextStageNumber}`,
                        from_dept: prev.current_department,
                        to_dept: destination,
                        forwarded_at: timestamp,
                        forwarded_by: roleName,
                        received_by: null,
                        remarks: "",
                    },
                ],
                activity_logs: [
                    {
                        id: Date.now(),
                        user: roleName,
                        action: isFinalStage
                            ? "Completed Procurement"
                            : `Forwarded to ${destination}`,
                        timestamp,
                    },
                    ...(prev.activity_logs ?? []),
                ],
            };
        });
        setShowRoutingModal(false);
    };
    // ---------------------------------------------------------
    // RETURN
    // ---------------------------------------------------------
    const handleReturnPR = (e) => {
        e?.preventDefault();
        if (!currentPR || !canAccessCurrentStage) {
            return;
        }
        const currentStage = Number(currentPR.stage) || 1;
        const currentStageIndex = STAGES.findIndex(
            (stage) => Number(stage.id) === currentStage,
        );
        const previousStage = STAGES[currentStageIndex - 1];
        // Cannot return before Stage 1
        if (!previousStage) {
            return;
        }
        const timestamp = new Date().toLocaleString();
        const roleName = currentRole?.name ?? "Current User";
        // IMPORTANT:
        // Always return to the PREVIOUS stage department.
        // Do not use the current department as fallback.
        const destination = previousStage.department ?? "";
        if (!destination) {
            return;
        }
        setCurrentPR((prev) => {
            if (!prev) {
                return prev;
            }
            return {
                ...prev,
                // Move back one stage
                stage: Number(previousStage.id),
                status: "in_progress",
                route_status: "returned",
                // Transfer ownership to previous office
                current_department: destination,
                routes: [
                    ...(prev.routes ?? []),
                    {
                        id: Date.now(),
                        action: `Returned to Stage ${previousStage.id}`,
                        from_dept: prev.current_department,
                        to_dept: destination,
                        forwarded_at: timestamp,
                        forwarded_by: roleName,
                        received_by: null,
                        remarks: `Returned to ${destination}`,
                    },
                ],
                activity_logs: [
                    {
                        id: Date.now(),
                        user: roleName,
                        action: `Returned to ${destination}`,
                        details: `Procurement returned from Stage ${currentStage} to Stage ${previousStage.id}`,
                        timestamp,
                    },
                    ...(prev.activity_logs ?? []),
                ],
            };
        });
        setDefaultTargetDept("");
        setTargetDept("");
        setShowRoutingModal(false);
    };
    // ---------------------------------------------------------
    // OPEN FORWARD MODAL
    // ---------------------------------------------------------
    const handleForwardClick = () => {
        if (!currentPR || !canAccessCurrentStage) {
            return;
        }
        const currentStageIndex = STAGES.findIndex(
            (stage) => Number(stage.id) === Number(currentPR.stage),
        );
        const nextStage = STAGES[currentStageIndex + 1];
        if (!nextStage) {
            return;
        }
        setRoutingType("forward");
        setDefaultTargetDept(nextStage.department ?? "");
        setTargetDept(nextStage.department ?? "");
        setShowRoutingModal(true);
    };
    // ---------------------------------------------------------
    // OPEN RETURN MODAL
    // ---------------------------------------------------------
    const handleReturnClick = () => {
        if (!currentPR || !canAccessCurrentStage) {
            return;
        }
        const currentStageIndex = STAGES.findIndex(
            (stage) => Number(stage.id) === Number(currentPR.stage),
        );
        const previousStage = STAGES[currentStageIndex - 1];
        if (!previousStage) {
            return;
        }
        setRoutingType("return");
        // Select the PREVIOUS stage's department
        const previousDepartment = previousStage.department ?? "";
        setDefaultTargetDept(previousDepartment);
        setTargetDept(previousDepartment);
        setShowRoutingModal(true);
    };
    // ---------------------------------------------------------
    // NO DATA
    // ---------------------------------------------------------
    if (!currentPR) {
        return null;
    }
    // ---------------------------------------------------------
    // RENDER
    // ---------------------------------------------------------
    return (
        <SidebarModal
            isOpen={isOpen}
            onClose={onClose}
            title={`PR Tracker: ${currentPR.id ?? currentPR.pr_no ?? ""}`}
            icon={<FileSpreadsheet className="h-5 w-5 text-white" />}
        >
            <div className="-m-6 flex h-[calc(100vh-4rem)] flex-col bg-white">
                {/* HEADER */}
                <ProcurementDrawerHeader currentPR={currentPR} />
                {/* STAGE STEPPER */}
                <ProcurementStageStepper
                    stages={STAGES}
                    currentPR={currentPR}
                />
                {/* TABS */}
                <ProcurementDrawerTabs
                    activeTab={activeDrawerTab}
                    onTabChange={setActiveDrawerTab}
                    routesCount={currentPR.routes?.length ?? 0}
                    documentsCount={currentPR.documents?.length ?? 0}
                />
                {/* BODY */}
                <div className="flex-1 space-y-6 overflow-y-auto p-6">
                    {/* STAGE FORMS */}
                    {activeDrawerTab === "stage_form" && (
                        <StageFormsTab
                            currentPR={currentPR}
                            currentRole={currentRole}
                            onReceive={handleReceivePR}
                            handleStageDataChange={handleStageDataChange}
                            stageFiles={stageFiles}
                            setStageFiles={setStageFiles}
                            canEdit={canEditStageForm}
                            canUpload={canUploadDocuments}
                            canAccessCurrentStage={canAccessCurrentStage}
                        />
                    )}
                    {/* ROUTING HISTORY */}
                    {activeDrawerTab === "routing_history" && (
                        <RoutingHistoryTab currentPR={currentPR} />
                    )}
                    {/* DOCUMENTS */}
                    {activeDrawerTab === "documents" && (
                        <DocumentsTab
                            currentPR={currentPR}
                            canUpload={canUploadDocuments}
                            canAccessCurrentStage={canAccessCurrentStage}
                        />
                    )}
                </div>
                {/* ACTION BAR */}
                <ProcurementDrawerActionBar
                    currentPR={currentPR}
                    stages={STAGES}
                    onReturn={handleReturnClick}
                    onForward={handleForwardClick}
                    canRoute={canRoute}
                />
            </div>
            {/* ROUTING MODAL */}
            <RoutingModal
                show={showRoutingModal}
                onClose={() => setShowRoutingModal(false)}
                purchaseRequest={currentPR}
                routingType={routingType}
                currentRole={currentRole}
                stageFiles={stageFiles}
                departments={DEPARTMENTS}
                setStageFiles={setStageFiles}
                defaultTargetDept={defaultTargetDept}
                onForward={handleForwardPR}
                onReturn={handleReturnPR}
                onSuccess={() => {
                    setShowRoutingModal(false);
                    onClose?.();
                    router.reload({
                        preserveScroll: true,
                    });
                }}
            />
        </SidebarModal>
    );
}
