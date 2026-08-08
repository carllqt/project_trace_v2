import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import MainLayout from "@/Layouts/MainLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import {
    CheckCircle2Icon,
    Clock3Icon,
    FileTextIcon,
    PlusIcon,
    TrendingUpIcon,
    FilePlus2,
} from "lucide-react";
import { useState, useEffect } from "react";
import SidebarModal from "@/components/SidebarModal";
import CreatePRModal from "@/Components/CreatePRModal";

export default function Dashboard({ departments }) {
    const { auth } = usePage().props;
    const breadcrumbs = [{ label: "Dashboard", showOnMobile: true }];
    const summaryCards = [
        {
            label: "Total PRs Registered",
            value: "3",
            note: "Across all stages",
            icon: FileTextIcon,
            iconClassName: "border-blue-200 bg-blue-50 text-blue-600",
        },
        {
            label: "Action Required (My Queue)",
            value: "0",
            note: "Assigned to IT / HR Dept",
            icon: Clock3Icon,
            iconClassName: "border-orange-200 bg-orange-50 text-orange-500",
        },
        {
            label: "In Progress Routing",
            value: "2",
            note: "Stages 1 - 5 active",
            icon: TrendingUpIcon,
            iconClassName: "border-purple-200 bg-purple-50 text-purple-600",
        },
        {
            label: "Completed & Paid",
            value: "1",
            note: "Finalized in Stage 6",
            icon: CheckCircle2Icon,
            iconClassName: "border-emerald-200 bg-emerald-50 text-emerald-600",
        },
    ];
    const user = auth?.user;
    const department = user?.department;

    const [showCreateModal, setShowCreateModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        pr_number: "",
        project_title: "",
        end_user: user?.department_id ?? "",
        abc: "",
        mode_of_procurement: "Small Value Procurement (Sec. 53.9)",
        purpose: "",
        documents: [],
    });
    const handleCreatePR = (e) => {
        e.preventDefault();

        console.log("Form Data:", data);

        post(route("procurement.store"), {
            forceFormData: true,
        });
    };

    return (
        <MainLayout>
            <Head title="Dashboard" />

            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-7">
                <div className="w-full space-y-6">
                    {/* Header */}
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="flex flex-wrap items-center gap-2 text-xl font-extrabold leading-none tracking-tight text-slate-900">
                                <span>Document Tracking System</span>

                                <span className="rounded-full border border-blue-200 bg-blue-100 px-2.5 py-1 text-[10px] font-semibold leading-none tracking-normal text-blue-700">
                                    ERD Workflow Enabled
                                </span>
                            </h1>

                            <p className="mt-2 text-sm font-medium text-slate-500">
                                Monitor procurement routing across 6 stages with
                                complete audit logs and document tracking.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowCreateModal(true)}
                            className="flex h-10 shrink-0 items-center justify-center gap-2 self-start rounded-2xl bg-blue-700 px-5 text-xs font-bold text-white shadow-lg shadow-blue-700/25 transition hover:bg-blue-800 sm:self-center"
                        >
                            <PlusIcon className="size-4" />
                            <span>Create New PR Request</span>
                        </button>
                    </div>

                    {/* Summary */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {summaryCards.map((card) => {
                            const Icon = card.icon;

                            return (
                                <article
                                    key={card.label}
                                    className="flex min-h-40 items-center justify-between rounded-3xl border border-slate-100 bg-white px-5 py-5 shadow-sm"
                                >
                                    <div className="flex min-w-0 flex-col">
                                        <p className="text-[10px] font-bold uppercase leading-snug tracking-wider text-slate-400">
                                            {card.label}
                                        </p>

                                        <p className="mt-2 text-3xl font-black tracking-tight text-slate-800">
                                            {card.value}
                                        </p>

                                        <p className="mt-auto text-[11px] font-semibold leading-4 text-slate-500">
                                            {card.note}
                                        </p>
                                    </div>

                                    <div
                                        className={`flex size-11 shrink-0 items-center justify-center rounded-2xl border shadow-sm ${card.iconClassName}`}
                                    >
                                        <Icon
                                            className="size-5"
                                            strokeWidth={2.5}
                                        />
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                    <CreatePRModal
                        departments={departments}
                        isOpen={showCreateModal}
                        onClose={() => setShowCreateModal(false)}
                        onSubmit={handleCreatePR}
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                    />
                </div>
            </div>
        </MainLayout>
    );
}
