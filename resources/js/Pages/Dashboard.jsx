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
import { toast } from "sonner";
import ProcurementDashboardHeader from "@/Components/Header";
import ProcurementRegistry from "@/Components/ProcurementRegistry";

export default function Dashboard({
    departments,
    procurements,
    stats,
    queryParams,
}) {
    const { auth, flash } = usePage().props;
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
    const [showCreateModal, setShowCreateModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        pr_no: "",
        project_title: "",
        end_user: user?.department_id ?? "",
        abc: "",
        mode_of_procurement: "Small Value Procurement (Sec. 53.9)",
        purpose: "",
        documents: [],
    });

    const handleCreatePR = (e) => {
        e.preventDefault();

        post(route("procurement.store"), {
            forceFormData: true,

            onSuccess: () => {
                toast.success("Procurement created successfully.");
                setShowCreateModal(false);
                reset();
            },

            onError: (errors) => {
                const firstError = Object.values(errors)[0];

                toast.error(
                    Array.isArray(firstError) ? firstError[0] : firstError,
                );
            },
        });
    };

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }

        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return (
        <MainLayout>
            <Head title="Dashboard" />

            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-7">
                <div className="w-full space-y-6">
                    <ProcurementDashboardHeader
                        stats={stats}
                        onCreate={() => setShowCreateModal(true)}
                    />

                    <ProcurementRegistry
                        queryParams={queryParams}
                        procurements={procurements}
                        departments={departments}
                    />
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
