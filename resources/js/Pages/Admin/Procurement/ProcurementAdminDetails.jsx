import React from "react";
import {
    Activity,
    ArrowRight,
    Banknote,
    Building2,
    CalendarDays,
    CheckCircle2,
    CircleDot,
    ClipboardCheck,
    Clock3,
    FileText,
    FolderOpen,
    History,
    Info,
    MapPin,
    Package,
    Receipt,
    Route,
    ShieldCheck,
    User,
    Wallet,
} from "lucide-react";

import { PROCUREMENT_STAGES } from "@/Constants/procurement";

const formatDateTime = (date) => {
    if (!date) return "—";

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date));
};

const formatDate = (date) => {
    if (!date) return "—";

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    }).format(new Date(date));
};

const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || amount === "") {
        return "—";
    }

    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
    }).format(Number(amount));
};

const getStage = (stage) => {
    const stageValue = typeof stage === "number" ? `stage_${stage}` : stage;

    return PROCUREMENT_STAGES.find((item) => item.value === stageValue);
};

const getStageLabel = (stage) => {
    const config = getStage(stage);

    return config?.label ?? "Unknown Stage";
};

const getStageName = (stage) => {
    const config = getStage(stage);

    return config?.name ?? "Unknown";
};

const getStatusConfig = (status) => {
    switch (status) {
        case "completed":
            return {
                label: "Completed",
                className: "border-emerald-200 bg-emerald-50 text-emerald-700",
                icon: CheckCircle2,
            };

        case "in_progress":
            return {
                label: "In Progress",
                className: "border-blue-200 bg-blue-50 text-blue-700",
                icon: Activity,
            };

        case "pending":
            return {
                label: "Pending",
                className: "border-amber-200 bg-amber-50 text-amber-700",
                icon: Clock3,
            };

        default:
            return {
                label: status ?? "Unknown",
                className: "border-slate-200 bg-slate-50 text-slate-600",
                icon: CircleDot,
            };
    }
};

const DetailItem = ({ label, value, icon: Icon, className = "" }) => (
    <div className={`min-w-0 ${className}`}>
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            {Icon && <Icon className="h-3 w-3" />}
            {label}
        </div>

        <p className="mt-1 break-words text-sm font-medium text-slate-700">
            {value ?? "—"}
        </p>
    </div>
);

const Section = ({ icon: Icon, title, description, children }) => (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 shadow-sm backdrop-blur-xl">
        <div className="border-b border-slate-100 bg-white/50 px-5 py-4">
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <Icon className="h-4 w-4" />
                </div>

                <div>
                    <h3 className="text-sm font-bold text-slate-800">
                        {title}
                    </h3>

                    {description && (
                        <p className="mt-0.5 text-xs text-slate-400">
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </div>

        <div className="p-5">{children}</div>
    </section>
);

export default function ProcurementAdminDetails({ procurement }) {
    if (!procurement) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                <Info className="mx-auto h-8 w-8 text-slate-300" />

                <p className="mt-3 text-sm font-medium text-slate-500">
                    No procurement record selected.
                </p>
            </div>
        );
    }

    const stage = getStage(procurement.stage);
    const status = getStatusConfig(procurement.status);
    const StatusIcon = status.icon;

    const stageData = procurement.stage_data ?? {};
    const routes = procurement.routes ?? [];
    const activityLogs = procurement.activity_logs ?? [];
    const documents = procurement.documents ?? [];

    return (
        <div className="space-y-5">
            {/* =====================================================
                HEADER / SUMMARY
            ====================================================== */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-xl">
                {/* Accent */}
                <div
                    className={`h-1.5 w-full bg-gradient-to-r ${
                        stage?.color ?? "from-slate-500 to-slate-700"
                    }`}
                />

                <div className="p-5 sm:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-bold text-white">
                                    {procurement.pr_no}
                                </span>

                                <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
                                    Procurement #{procurement.id}
                                </span>
                            </div>

                            <h2 className="mt-3 break-words text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                                {procurement.project_title}
                            </h2>

                            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">
                                {procurement.purpose ||
                                    "No procurement purpose provided."}
                            </p>
                        </div>

                        {/* Status */}
                        <div className="flex shrink-0 flex-wrap gap-2">
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${status.className}`}
                            >
                                <StatusIcon className="h-3.5 w-3.5" />
                                {status.label}
                            </span>

                            {procurement.route_status && (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                                    <Route className="h-3.5 w-3.5" />
                                    {procurement.route_status
                                        .replaceAll("_", " ")
                                        .replace(/\b\w/g, (char) =>
                                            char.toUpperCase(),
                                        )}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Summary cards */}
                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                            <DetailItem
                                icon={Building2}
                                label="End User"
                                value={procurement.end_user}
                            />
                        </div>

                        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                            <DetailItem
                                icon={Banknote}
                                label="Approved Budget"
                                value={formatCurrency(procurement.abc)}
                            />
                        </div>

                        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                            <DetailItem
                                icon={ClipboardCheck}
                                label="Procurement Mode"
                                value={procurement.mode_of_procurement}
                            />
                        </div>

                        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                            <DetailItem
                                icon={MapPin}
                                label="Current Department"
                                value={procurement.current_department}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* =====================================================
                CURRENT STAGE
            ====================================================== */}
            <Section
                icon={CircleDot}
                title="Current Procurement Stage"
                description="Current position in the procurement workflow."
            >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${
                            stage?.color ?? "from-slate-500 to-slate-700"
                        } text-lg font-bold text-white shadow-lg`}
                    >
                        {procurement.stage}
                    </div>

                    <div className="min-w-0">
                        <p className="text-lg font-bold text-slate-800">
                            {getStageName(procurement.stage)}
                        </p>

                        <p className="mt-0.5 text-sm text-slate-500">
                            {getStageLabel(procurement.stage)}
                        </p>

                        {stage && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                                <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500">
                                    Actor: {stage.actor}
                                </span>

                                <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500">
                                    Office: {stage.department}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </Section>

            {/* =====================================================
                STAGE DATA
            ====================================================== */}
            <Section
                icon={FileText}
                title="Procurement Stage Information"
                description="Recorded information for each procurement stage."
            >
                <div className="space-y-4">
                    {/* PR */}
                    <StageDataCard
                        title="Purchase Request"
                        icon={FileText}
                        data={stageData.pr}
                        fields={[
                            ["PR No.", "pr_no"],
                            ["Project Title", "project_title"],
                            ["Purpose", "purpose"],
                            ["End User", "end_user"],
                            ["ABC", "abc", formatCurrency],
                            ["Mode of Procurement", "mode_of_procurement"],
                            [
                                "Date of Implementation",
                                "date_of_implementation",
                                formatDate,
                            ],
                        ]}
                    />

                    {/* RFQ */}
                    <StageDataCard
                        title="Request for Quotation"
                        icon={Receipt}
                        data={stageData.rfq}
                        fields={[
                            ["TIN", "tin"],
                            ["Winning Bidder", "winner_bidder"],
                            ["Address / Contract", "address_contract"],
                            ["Contact No.", "contact_no"],
                            [
                                "Contract Amount",
                                "contract_amount",
                                formatCurrency,
                            ],
                        ]}
                    />

                    {/* PO */}
                    <StageDataCard
                        title="Purchase Order"
                        icon={ClipboardCheck}
                        data={stageData.po}
                        fields={[
                            ["PO No.", "po_no"],
                            ["PO Date", "po_date", formatDate],
                            ["Contract Date", "contract_date", formatDate],
                            ["Amount", "amount", formatCurrency],
                            ["Allotment Class", "allotment_class"],
                        ]}
                    />

                    {/* Delivery */}
                    <StageDataCard
                        title="Delivery & Inspection"
                        icon={Package}
                        data={stageData.delivery}
                        fields={[
                            ["IAR No.", "iar_no"],
                            ["Delivery Date", "delivery_date", formatDate],
                            ["Inspection Date", "inspection_date", formatDate],
                            ["Delivery Status", "delivery_status"],
                        ]}
                    />

                    {/* Implementation */}
                    <StageDataCard
                        title="Project Implementation"
                        icon={Activity}
                        data={stageData.implementation}
                        fields={[
                            [
                                "Implementation Date",
                                "implementation_date",
                                formatDate,
                            ],
                            ["Attendance Sheet", "attendance_sheet_name"],
                            ["Terminal Report", "terminal_report_name"],
                        ]}
                    />

                    {/* Payment */}
                    <StageDataCard
                        title="Payment Processing"
                        icon={Wallet}
                        data={stageData.payment}
                        fields={[
                            ["ORS No.", "ors_no"],
                            ["ORS Date", "ors_date", formatDate],
                            ["Date Prepared", "date_prepared", formatDate],
                            ["Date Crediting", "date_crediting", formatDate],
                        ]}
                    />

                    {/* CAPA */}
                    <StageDataCard
                        title="CAPA"
                        icon={ShieldCheck}
                        data={stageData.capa}
                        fields={[
                            [
                                "Calendar of Activities",
                                "calendar_of_activities",
                            ],
                        ]}
                    />
                </div>
            </Section>

            {/* =====================================================
                ROUTING HISTORY
            ====================================================== */}
            <Section
                icon={History}
                title="Routing History"
                description="Complete movement history of this procurement."
            >
                {routes.length === 0 ? (
                    <EmptyState
                        icon={Route}
                        message="No routing history available."
                    />
                ) : (
                    <div className="relative">
                        {/* Timeline */}
                        <div className="absolute bottom-4 left-[15px] top-4 w-px bg-slate-200" />

                        <div className="space-y-5">
                            {routes.map((route, index) => (
                                <div
                                    key={route.id}
                                    className="relative flex gap-4"
                                >
                                    <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-4 border-white bg-blue-600 shadow-sm">
                                        <ArrowRight className="h-3.5 w-3.5 text-white" />
                                    </div>

                                    <div className="min-w-0 flex-1 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="rounded-md bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-600">
                                                        Route #{route.id}
                                                    </span>

                                                    <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-600">
                                                        {route.action}
                                                    </span>
                                                </div>

                                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                                    <span className="text-sm font-semibold text-slate-700">
                                                        {route.from_dept}
                                                    </span>

                                                    <ArrowRight className="h-4 w-4 text-slate-300" />

                                                    <span className="text-sm font-semibold text-slate-700">
                                                        {route.to_dept}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex shrink-0 items-center gap-1.5 text-xs text-slate-400">
                                                <CalendarDays className="h-3.5 w-3.5" />
                                                {formatDateTime(
                                                    route.forwarded_at,
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-4 grid gap-3 border-t border-slate-200/70 pt-3 sm:grid-cols-2">
                                            <DetailItem
                                                icon={User}
                                                label="Forwarded By"
                                                value={route.forwarded_by}
                                            />

                                            <DetailItem
                                                icon={User}
                                                label="Received By"
                                                value={route.received_by}
                                            />
                                        </div>

                                        {route.remarks && (
                                            <div className="mt-3 rounded-xl border border-slate-200/70 bg-white/70 p-3">
                                                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                                    Remarks
                                                </p>

                                                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                                                    {route.remarks}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Section>

            {/* =====================================================
                ACTIVITY LOGS
            ====================================================== */}
            <Section
                icon={Activity}
                title="Activity Logs"
                description="System activity associated with this procurement."
            >
                {activityLogs.length === 0 ? (
                    <EmptyState
                        icon={Activity}
                        message="No activity logs recorded."
                    />
                ) : (
                    <div className="space-y-3">
                        {activityLogs.map((log, index) => (
                            <div
                                key={log.id ?? index}
                                className="rounded-xl border border-slate-100 bg-slate-50/70 p-4"
                            >
                                <pre className="whitespace-pre-wrap break-words text-xs text-slate-600">
                                    {JSON.stringify(log, null, 2)}
                                </pre>
                            </div>
                        ))}
                    </div>
                )}
            </Section>

            {/* =====================================================
                DOCUMENTS
            ====================================================== */}
            <Section
                icon={FolderOpen}
                title="Procurement Documents"
                description="Documents associated with this procurement."
            >
                {documents.length === 0 ? (
                    <EmptyState
                        icon={FolderOpen}
                        message="No documents uploaded."
                    />
                ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {documents.map((document, index) => (
                            <div
                                key={document.id ?? index}
                                className="rounded-xl border border-slate-100 bg-slate-50/70 p-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
                                        <FileText className="h-4 w-4" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-xs font-semibold text-slate-700">
                                            {document.name ??
                                                document.filename ??
                                                `Document #${
                                                    document.id ?? index + 1
                                                }`}
                                        </p>

                                        {document.type && (
                                            <p className="mt-0.5 text-[10px] uppercase text-slate-400">
                                                {document.type}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Section>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Stage Data Card
|--------------------------------------------------------------------------
*/

function StageDataCard({ title, icon: Icon, data, fields }) {
    const hasData =
        data &&
        Object.values(data).some(
            (value) => value !== null && value !== undefined && value !== "",
        );

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/60">
            <div className="flex items-center gap-2 border-b border-slate-100 bg-white/60 px-4 py-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <Icon className="h-3.5 w-3.5" />
                </div>

                <h4 className="text-xs font-bold text-slate-700">{title}</h4>
            </div>

            <div className="grid gap-x-5 gap-y-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
                {fields.map(([label, key, formatter]) => {
                    const rawValue = data?.[key];

                    const value =
                        formatter && rawValue ? formatter(rawValue) : rawValue;

                    return (
                        <DetailItem
                            key={key}
                            label={label}
                            value={value || "—"}
                        />
                    );
                })}
            </div>

            {!hasData && (
                <div className="border-t border-slate-100 px-4 py-3 text-[11px] text-slate-400">
                    No information recorded for this stage yet.
                </div>
            )}
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Empty State
|--------------------------------------------------------------------------
*/

function EmptyState({ icon: Icon, message }) {
    return (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-5 py-8 text-center">
            <Icon className="mx-auto h-7 w-7 text-slate-300" />

            <p className="mt-2 text-xs font-medium text-slate-400">{message}</p>
        </div>
    );
}
