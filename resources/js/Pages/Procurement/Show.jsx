import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import { PROCUREMENT_STAGES } from "@/constants";

import {
    ArrowLeft,
    ArrowRight,
    Building2,
    CalendarDays,
    Check,
    CheckCircle2,
    ChevronRight,
    Clock3,
    CreditCard,
    FileCheck2,
    FileText,
    History,
    Loader2,
    PackageCheck,
    Send,
    ShieldCheck,
    Truck,
    User,
    X,
} from "lucide-react";

const STAGE_DATA_KEYS = {
    1: "pr",
    2: "rfq",
    3: "po",
    4: "delivery",
    5: "implementation",
    6: "payment",
};

const formatFieldValue = (value, field) => {
    if (value === null || value === undefined || value === "") {
        return "—";
    }

    if (field.type === "number") {
        return `₱${Number(value).toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    }

    if (field.type === "select") {
        const option = field.options?.find((option) => option.value === value);

        return option?.label || value;
    }

    return value;
};

const getStageData = (procurement, stageId) => {
    const key = STAGE_DATA_KEYS[stageId];

    if (!key) {
        return {};
    }

    return procurement?.stage_data?.[key] || {};
};

function StatusBadge({ status }) {
    const styles = {
        in_progress: "bg-blue-50 text-blue-700 border-blue-200",
        completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
        pending: "bg-amber-50 text-amber-700 border-amber-200",
        cancelled: "bg-red-50 text-red-700 border-red-200",
        in_route: "bg-indigo-50 text-indigo-700 border-indigo-200",
    };

    const labels = {
        in_progress: "In Progress",
        completed: "Completed",
        pending: "Pending",
        cancelled: "Cancelled",
        in_route: "In Route",
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                styles[status] || "border-slate-200 bg-slate-50 text-slate-600"
            }`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {labels[status] || status?.replaceAll("_", " ")}
        </span>
    );
}

function DetailItem({ label, value, icon: Icon }) {
    return (
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {label}
            </div>

            <div className="text-sm font-semibold text-slate-800">
                {value ?? "—"}
            </div>
        </div>
    );
}

function SectionHeader({ icon: Icon, title, description }) {
    return (
        <div className="mb-5 flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Icon className="h-4 w-4" />
            </div>

            <div>
                <h2 className="text-sm font-bold text-slate-900">{title}</h2>

                {description && (
                    <p className="mt-0.5 text-xs text-slate-500">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}

function StageValue({ label, value }) {
    return (
        <div>
            <p className="mb-1 text-xs text-slate-400">{label}</p>
            <p className="text-sm font-medium text-slate-700">{value ?? "—"}</p>
        </div>
    );
}

export default function Show({ procurement }) {
    const [showDispatchModal, setShowDispatchModal] = useState(false);
    const [dispatching, setDispatching] = useState(false);

    const breadcrumbs = [
        {
            label: "Dashboard",
            href: route("dashboard"),
        },
        {
            label: "Procurement",
            href: route("procurement.index"),
        },
        {
            label: procurement?.pr_no || "Procurement Details",
            showOnMobile: true,
        },
    ];

    const currentStage = procurement?.stage || 1;

    const currentStageInfo =
        PROCUREMENT_STAGES.find((stage) => stage.id === currentStage) ||
        PROCUREMENT_STAGES[0];

    const currentStageData = getStageData(procurement, currentStage);

    const CurrentStageIcon = FileText;

    const handleDispatch = () => {
        setDispatching(true);

        router.post(
            route("procurement.dispatch", procurement.id),
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    setDispatching(false);
                    setShowDispatchModal(false);
                },
            },
        );
    };

    return (
        <MainLayout>
            <Head title={`${procurement?.pr_no || "Procurement"} Details`} />

            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="relative flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/60">
                <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    {/* =====================================================
                        HEADER
                    ====================================================== */}
                    <div className="mb-6 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
                        <div className="relative px-5 py-6 sm:px-7">
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600" />

                            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex min-w-0 items-start gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                                        <FileText className="h-6 w-6" />
                                    </div>

                                    <div className="min-w-0">
                                        <div className="mb-1 flex flex-wrap items-center gap-2">
                                            <h1 className="text-xl font-bold tracking-tight text-slate-900">
                                                {procurement?.pr_no}
                                            </h1>

                                            <StatusBadge
                                                status={
                                                    procurement?.route_status
                                                }
                                            />
                                        </div>

                                        <p className="max-w-3xl text-sm text-slate-500">
                                            {procurement?.project_title}
                                        </p>

                                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                                            <span className="flex items-center gap-1.5">
                                                <Building2 className="h-3.5 w-3.5 text-blue-500" />
                                                {
                                                    procurement?.current_department
                                                }
                                            </span>

                                            <span className="hidden text-slate-300 sm:inline">
                                                •
                                            </span>

                                            <span className="flex items-center gap-1.5">
                                                <User className="h-3.5 w-3.5 text-blue-500" />
                                                {procurement?.end_user}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex shrink-0 items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => window.history.back()}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Back
                                    </button>

                                    {procurement?.requires_my_action && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowDispatchModal(true)
                                            }
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
                                        >
                                            <Send className="h-4 w-4" />
                                            Dispatch PR
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* =====================================================
                        STAGE PROGRESS
                    ====================================================== */}
                    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-bold text-slate-900">
                                    Procurement Progress
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    Current stage:{" "}
                                    <span className="font-semibold text-blue-600">
                                        {currentStageInfo.name}
                                    </span>
                                </p>
                            </div>

                            <div className="hidden rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 sm:block">
                                Stage {currentStage} of{" "}
                                {PROCUREMENT_STAGES.length}
                            </div>
                        </div>

                        <div className="relative">
                            {/* Progress line */}
                            <div className="absolute left-0 right-0 top-5 hidden h-0.5 bg-slate-100 md:block" />

                            <div
                                className="absolute left-0 top-5 hidden h-0.5 bg-blue-500 transition-all md:block"
                                style={{
                                    width: `${
                                        (Math.max(currentStage - 1, 0) /
                                            (PROCUREMENT_STAGES.length - 1)) *
                                        100
                                    }%`,
                                }}
                            />

                            <div className="relative grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-7 md:gap-2">
                                {PROCUREMENT_STAGES.map((stage) => {
                                    const completed = stage.id < currentStage;
                                    const active = stage.id === currentStage;

                                    return (
                                        <div
                                            key={stage.id}
                                            className="flex flex-col items-center text-center"
                                        >
                                            <div
                                                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white transition ${
                                                    completed
                                                        ? "border-blue-600 bg-blue-600 text-white"
                                                        : active
                                                          ? "border-blue-600 text-blue-600 shadow-[0_0_0_4px_rgba(37,99,235,0.08)]"
                                                          : "border-slate-200 text-slate-300"
                                                }`}
                                            >
                                                {completed ? (
                                                    <Check className="h-4 w-4" />
                                                ) : (
                                                    <span className="text-xs font-bold">
                                                        {stage.id}
                                                    </span>
                                                )}
                                            </div>

                                            <p
                                                className={`mt-2 text-xs font-semibold ${
                                                    active
                                                        ? "text-blue-700"
                                                        : completed
                                                          ? "text-slate-700"
                                                          : "text-slate-400"
                                                }`}
                                            >
                                                {stage.name}
                                            </p>

                                            <p className="mt-0.5 hidden text-[10px] text-slate-400 lg:block">
                                                {stage.department}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* =====================================================
                        MAIN GRID
                    ====================================================== */}
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                        {/* LEFT */}
                        <div className="space-y-6">
                            {/* PROCUREMENT INFORMATION */}
                            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                                <SectionHeader
                                    icon={FileText}
                                    title="Procurement Information"
                                    description="Basic information and procurement details"
                                />

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <DetailItem
                                        label="PR Number"
                                        value={procurement?.pr_no}
                                        icon={FileText}
                                    />

                                    <DetailItem
                                        label="End User"
                                        value={procurement?.end_user}
                                        icon={User}
                                    />

                                    <DetailItem
                                        label="ABC"
                                        value={
                                            procurement?.abc
                                                ? `₱${Number(
                                                      procurement.abc,
                                                  ).toLocaleString("en-PH", {
                                                      minimumFractionDigits: 2,
                                                  })}`
                                                : "—"
                                        }
                                        icon={CreditCard}
                                    />

                                    <DetailItem
                                        label="Mode of Procurement"
                                        value={procurement?.mode_of_procurement}
                                        icon={FileCheck2}
                                    />

                                    <DetailItem
                                        label="Current Department"
                                        value={procurement?.current_department}
                                        icon={Building2}
                                    />

                                    <DetailItem
                                        label="Status"
                                        value={
                                            <StatusBadge
                                                status={procurement?.status}
                                            />
                                        }
                                        icon={ShieldCheck}
                                    />
                                </div>

                                <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Project Title
                                    </p>

                                    <p className="text-sm font-semibold text-slate-800">
                                        {procurement?.project_title || "—"}
                                    </p>
                                </div>

                                <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Purpose
                                    </p>

                                    <p className="text-sm leading-6 text-slate-600">
                                        {procurement?.purpose || "—"}
                                    </p>
                                </div>
                            </section>

                            {/* CURRENT STAGE */}
                            <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
                                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                            <FileText className="h-5 w-5" />
                                        </div>

                                        <div>
                                            <h2 className="text-sm font-bold text-slate-900">
                                                {currentStageInfo.name}
                                            </h2>

                                            <p className="mt-1 text-xs text-slate-500">
                                                {currentStageInfo.label}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700">
                                            Stage {currentStageInfo.id}
                                        </span>

                                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-500">
                                            {currentStageInfo.actor}
                                        </span>
                                    </div>
                                </div>

                                {/* Department */}
                                <div className="mb-5 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                                        <Building2 className="h-4 w-4" />
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-400">
                                            Responsible Department
                                        </p>

                                        <p className="mt-0.5 text-sm font-semibold text-blue-900">
                                            {currentStageInfo.department}
                                        </p>
                                    </div>
                                </div>

                                {/* Fields */}
                                {currentStageInfo.fields.length > 0 ? (
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {currentStageInfo.fields.map(
                                            (field) => {
                                                const value =
                                                    currentStageData[
                                                        field.name
                                                    ];

                                                return (
                                                    <div
                                                        key={field.name}
                                                        className={`rounded-xl border border-slate-100 bg-slate-50/70 p-4 ${
                                                            field.fullWidth
                                                                ? "sm:col-span-2"
                                                                : ""
                                                        }`}
                                                    >
                                                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                                            {field.label}
                                                        </p>

                                                        <p
                                                            className={`text-sm font-semibold ${
                                                                value
                                                                    ? "text-slate-800"
                                                                    : "text-slate-400"
                                                            }`}
                                                        >
                                                            {formatFieldValue(
                                                                value,
                                                                field,
                                                            )}
                                                        </p>
                                                    </div>
                                                );
                                            },
                                        )}
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                                        <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />

                                        <p className="mt-3 text-sm font-semibold text-slate-700">
                                            Procurement Completed
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            All procurement stages have been
                                            completed.
                                        </p>
                                    </div>
                                )}

                                {/* Required Documents */}
                                {currentStageInfo.docs?.length > 0 && (
                                    <div className="mt-6 border-t border-slate-100 pt-5">
                                        <div className="mb-3 flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-bold text-slate-700">
                                                    Stage Documents
                                                </p>

                                                <p className="mt-0.5 text-[11px] text-slate-400">
                                                    Documents associated with
                                                    this stage
                                                </p>
                                            </div>

                                            <FileText className="h-4 w-4 text-slate-300" />
                                        </div>

                                        <div className="grid gap-2 sm:grid-cols-2">
                                            {currentStageInfo.docs.map(
                                                (document) => (
                                                    <div
                                                        key={document}
                                                        className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3"
                                                    >
                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                                            <FileText className="h-4 w-4" />
                                                        </div>

                                                        <span className="text-xs font-medium text-slate-600">
                                                            {document}
                                                        </span>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* ROUTING HISTORY */}
                            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                                <SectionHeader
                                    icon={History}
                                    title="Routing History"
                                    description="Movement of this purchase request between departments"
                                />

                                {procurement?.routes?.length > 0 ? (
                                    <div className="relative">
                                        <div className="absolute bottom-4 left-[15px] top-4 w-px bg-slate-200" />

                                        <div className="space-y-6">
                                            {procurement.routes.map(
                                                (routeItem, index) => (
                                                    <div
                                                        key={routeItem.id}
                                                        className="relative flex gap-4"
                                                    >
                                                        <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-white shadow-sm">
                                                            <ArrowRight className="h-3.5 w-3.5" />
                                                        </div>

                                                        <div className="min-w-0 flex-1 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                                <div>
                                                                    <div className="flex flex-wrap items-center gap-2">
                                                                        <span className="text-sm font-bold text-slate-800">
                                                                            {
                                                                                routeItem.from_dept
                                                                            }
                                                                        </span>

                                                                        <ChevronRight className="h-3.5 w-3.5 text-slate-300" />

                                                                        <span className="text-sm font-bold text-blue-700">
                                                                            {
                                                                                routeItem.to_dept
                                                                            }
                                                                        </span>
                                                                    </div>

                                                                    <p className="mt-1 text-xs font-medium text-slate-400">
                                                                        {
                                                                            routeItem.action
                                                                        }
                                                                    </p>
                                                                </div>

                                                                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                                                                    <Clock3 className="h-3.5 w-3.5" />
                                                                    {
                                                                        routeItem.forwarded_at
                                                                    }
                                                                </span>
                                                            </div>

                                                            <div className="mt-3 grid gap-3 border-t border-slate-200/70 pt-3 sm:grid-cols-2">
                                                                <div>
                                                                    <p className="text-[11px] uppercase tracking-wide text-slate-400">
                                                                        Forwarded
                                                                        By
                                                                    </p>

                                                                    <p className="mt-1 text-xs font-medium text-slate-600">
                                                                        {
                                                                            routeItem.forwarded_by
                                                                        }
                                                                    </p>
                                                                </div>

                                                                <div>
                                                                    <p className="text-[11px] uppercase tracking-wide text-slate-400">
                                                                        Received
                                                                        By
                                                                    </p>

                                                                    <p className="mt-1 text-xs font-medium text-slate-600">
                                                                        {routeItem.received_by ||
                                                                            "Not yet received"}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {routeItem.remarks && (
                                                                <div className="mt-3 rounded-lg bg-white p-3">
                                                                    <p className="text-[11px] uppercase tracking-wide text-slate-400">
                                                                        Remarks
                                                                    </p>

                                                                    <p className="mt-1 text-xs leading-5 text-slate-600">
                                                                        {
                                                                            routeItem.remarks
                                                                        }
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                                        <History className="mx-auto h-8 w-8 text-slate-300" />

                                        <p className="mt-3 text-sm font-medium text-slate-600">
                                            No routing history yet.
                                        </p>
                                    </div>
                                )}
                            </section>
                        </div>

                        {/* RIGHT SIDEBAR */}
                        <aside className="space-y-6">
                            {/* CURRENT STATUS */}
                            <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
                                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-5 text-white">
                                    <div className="flex items-center justify-between">
                                        <div className="min-w-0">
                                            <p className="text-xs font-medium text-blue-100">
                                                Current Stage
                                            </p>

                                            <h3 className="mt-1 truncate text-lg font-bold">
                                                {currentStageInfo.name}
                                            </h3>

                                            <p className="mt-1 text-xs text-blue-100">
                                                {currentStageInfo.label}
                                            </p>
                                        </div>

                                        <div className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                    </div>

                                    {/* Progress */}
                                    <div className="mt-5">
                                        <div className="mb-2 flex items-center justify-between text-xs">
                                            <span className="text-blue-100">
                                                Procurement Progress
                                            </span>

                                            <span className="font-bold">
                                                {Math.round(
                                                    (currentStage /
                                                        PROCUREMENT_STAGES.length) *
                                                        100,
                                                )}
                                                %
                                            </span>
                                        </div>

                                        <div className="h-1.5 overflow-hidden rounded-full bg-white/20">
                                            <div
                                                className="h-full rounded-full bg-white transition-all duration-500"
                                                style={{
                                                    width: `${
                                                        (currentStage /
                                                            PROCUREMENT_STAGES.length) *
                                                        100
                                                    }%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="space-y-4">
                                        {/* Status */}
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-xs text-slate-400">
                                                Status
                                            </span>

                                            <StatusBadge
                                                status={procurement?.status}
                                            />
                                        </div>

                                        {/* Route Status */}
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-xs text-slate-400">
                                                Route Status
                                            </span>

                                            <StatusBadge
                                                status={
                                                    procurement?.route_status
                                                }
                                            />
                                        </div>

                                        {/* Current Department */}
                                        <div className="flex items-start justify-between gap-4">
                                            <span className="shrink-0 text-xs text-slate-400">
                                                Department
                                            </span>

                                            <span className="text-right text-xs font-semibold text-slate-700">
                                                {procurement?.current_department ||
                                                    "—"}
                                            </span>
                                        </div>

                                        {/* Stage Actor */}
                                        <div className="flex items-start justify-between gap-4">
                                            <span className="shrink-0 text-xs text-slate-400">
                                                Responsible
                                            </span>

                                            <span className="text-right text-xs font-semibold text-slate-700">
                                                {currentStageInfo.actor || "—"}
                                            </span>
                                        </div>

                                        {/* Stage Department */}
                                        <div className="flex items-start justify-between gap-4">
                                            <span className="shrink-0 text-xs text-slate-400">
                                                Stage Department
                                            </span>

                                            <span className="text-right text-xs font-semibold text-slate-700">
                                                {currentStageInfo.department ||
                                                    "—"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Dispatch */}
                                    {procurement?.requires_my_action && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowDispatchModal(true)
                                            }
                                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
                                        >
                                            <Send className="h-4 w-4" />
                                            Dispatch Purchase Request
                                        </button>
                                    )}
                                </div>
                            </section>

                            {/* STAGE SUMMARY */}
                            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="mb-4 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900">
                                            Stage Overview
                                        </h3>

                                        <p className="mt-1 text-[11px] text-slate-400">
                                            Procurement workflow
                                        </p>
                                    </div>

                                    <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                                        {currentStage}/
                                        {PROCUREMENT_STAGES.length}
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    {PROCUREMENT_STAGES.map((stage) => {
                                        const completed =
                                            stage.id < currentStage;
                                        const active =
                                            stage.id === currentStage;

                                        return (
                                            <div
                                                key={stage.id}
                                                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
                                                    active
                                                        ? "bg-blue-50"
                                                        : "hover:bg-slate-50"
                                                }`}
                                            >
                                                <div
                                                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${
                                                        completed
                                                            ? "bg-blue-600 text-white"
                                                            : active
                                                              ? "bg-blue-100 text-blue-700"
                                                              : "bg-slate-100 text-slate-400"
                                                    }`}
                                                >
                                                    {completed ? (
                                                        <Check className="h-3.5 w-3.5" />
                                                    ) : (
                                                        stage.id
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p
                                                        className={`truncate text-xs font-semibold ${
                                                            active
                                                                ? "text-blue-700"
                                                                : completed
                                                                  ? "text-slate-700"
                                                                  : "text-slate-400"
                                                        }`}
                                                    >
                                                        {stage.name}
                                                    </p>

                                                    <p className="truncate text-[10px] text-slate-400">
                                                        {stage.department}
                                                    </p>
                                                </div>

                                                {active && (
                                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* DOCUMENTS */}
                            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <SectionHeader
                                    icon={FileText}
                                    title="Documents"
                                    description="Attached procurement files"
                                />

                                {procurement?.documents?.length > 0 ? (
                                    <div className="space-y-2">
                                        {procurement.documents.map(
                                            (document) => (
                                                <div
                                                    key={document.id}
                                                    className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-blue-100 hover:bg-blue-50/40"
                                                >
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                                        <FileText className="h-4 w-4" />
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-xs font-semibold text-slate-700">
                                                            {document.file_name ||
                                                                document.name}
                                                        </p>

                                                        <p className="mt-0.5 text-[11px] text-slate-400">
                                                            Procurement document
                                                        </p>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                                        <FileText className="mx-auto h-7 w-7 text-slate-300" />

                                        <p className="mt-2 text-xs font-medium text-slate-500">
                                            No documents attached
                                        </p>
                                    </div>
                                )}
                            </section>

                            {/* ACTIVITY */}
                            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <SectionHeader
                                    icon={CalendarDays}
                                    title="Activity"
                                    description="Recent procurement activity"
                                />

                                {procurement?.activity_logs?.length > 0 ? (
                                    <div className="space-y-4">
                                        {procurement.activity_logs.map(
                                            (activity, index) => (
                                                <div
                                                    key={activity.id || index}
                                                    className="relative flex gap-3"
                                                >
                                                    <div className="relative flex shrink-0 flex-col items-center">
                                                        <div className="mt-1.5 h-2.5 w-2.5 rounded-full bg-blue-600 ring-4 ring-blue-50" />

                                                        {index !==
                                                            procurement
                                                                .activity_logs
                                                                .length -
                                                                1 && (
                                                            <div className="mt-1 h-full w-px bg-slate-200" />
                                                        )}
                                                    </div>

                                                    <div className="min-w-0 flex-1 pb-3">
                                                        <p className="text-xs font-semibold text-slate-700">
                                                            {activity.action ||
                                                                activity.description ||
                                                                "Activity recorded"}
                                                        </p>

                                                        {activity.description &&
                                                            activity.action && (
                                                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                                                    {
                                                                        activity.description
                                                                    }
                                                                </p>
                                                            )}

                                                        <div className="mt-1.5 flex items-center gap-2 text-[11px] text-slate-400">
                                                            <Clock3 className="h-3 w-3" />

                                                            <span>
                                                                {activity.created_at ||
                                                                    "Date unavailable"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                ) : procurement?.routes?.length > 0 ? (
                                    <div className="space-y-4">
                                        {procurement.routes
                                            .slice(0, 5)
                                            .map((routeItem, index) => (
                                                <div
                                                    key={routeItem.id || index}
                                                    className="relative flex gap-3"
                                                >
                                                    <div className="relative flex shrink-0 flex-col items-center">
                                                        <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-4 ring-white">
                                                            <Send className="h-3.5 w-3.5" />
                                                        </div>

                                                        {index !==
                                                            Math.min(
                                                                procurement
                                                                    .routes
                                                                    .length,
                                                                5,
                                                            ) -
                                                                1 && (
                                                            <div className="mt-1 h-full w-px bg-slate-200" />
                                                        )}
                                                    </div>

                                                    <div className="min-w-0 flex-1 pb-3">
                                                        <p className="text-xs font-semibold text-slate-700">
                                                            {routeItem.action ||
                                                                "PR Routed"}
                                                        </p>

                                                        <div className="mt-1 flex items-center gap-1 text-xs">
                                                            <span className="font-medium text-slate-600">
                                                                {
                                                                    routeItem.from_dept
                                                                }
                                                            </span>

                                                            <ChevronRight className="h-3 w-3 text-slate-300" />

                                                            <span className="font-semibold text-blue-600">
                                                                {
                                                                    routeItem.to_dept
                                                                }
                                                            </span>
                                                        </div>

                                                        {routeItem.remarks && (
                                                            <p className="mt-1.5 line-clamp-2 text-[11px] leading-5 text-slate-400">
                                                                {
                                                                    routeItem.remarks
                                                                }
                                                            </p>
                                                        )}

                                                        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-400">
                                                            <span>
                                                                {routeItem.forwarded_at ||
                                                                    "Date unavailable"}
                                                            </span>

                                                            {routeItem.forwarded_by && (
                                                                <>
                                                                    <span>
                                                                        •
                                                                    </span>

                                                                    <span>
                                                                        {
                                                                            routeItem.forwarded_by
                                                                        }
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                ) : (
                                    <div className="py-4 text-center">
                                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-50">
                                            <History className="h-4 w-4 text-slate-300" />
                                        </div>

                                        <p className="mt-3 text-xs font-medium text-slate-500">
                                            No recent activity
                                        </p>

                                        <p className="mt-1 text-[11px] text-slate-400">
                                            Activity will appear here as the
                                            procurement is processed.
                                        </p>
                                    </div>
                                )}
                            </section>
                        </aside>
                    </div>
                </div>
            </div>

            {/* =============================================================
                DISPATCH MODAL
            ============================================================= */}
            {showDispatchModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <Send className="h-5 w-5" />
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">
                                        Dispatch Purchase Request
                                    </h3>

                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Confirm that you want to dispatch this
                                        PR.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    !dispatching && setShowDispatchModal(false)
                                }
                                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="p-5">
                            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                                <div className="flex items-start gap-3">
                                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                                    <div>
                                        <p className="text-sm font-semibold text-blue-900">
                                            Ready for dispatch
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-blue-700">
                                            This will forward{" "}
                                            <strong>
                                                {procurement?.pr_no}
                                            </strong>{" "}
                                            from{" "}
                                            <strong>
                                                {
                                                    procurement?.current_department
                                                }
                                            </strong>{" "}
                                            to the next processing stage.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-400">
                                        Current Stage
                                    </span>

                                    <span className="text-xs font-semibold text-slate-700">
                                        {currentStageInfo.name}
                                    </span>
                                </div>

                                <div className="my-3 h-px bg-slate-200" />

                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-400">
                                        Current Department
                                    </span>

                                    <span className="text-right text-xs font-semibold text-slate-700">
                                        {procurement?.current_department}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-4">
                            <button
                                type="button"
                                disabled={dispatching}
                                onClick={() => setShowDispatchModal(false)}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={dispatching}
                                onClick={handleDispatch}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {dispatching ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Dispatching...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4" />
                                        Confirm Dispatch
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
