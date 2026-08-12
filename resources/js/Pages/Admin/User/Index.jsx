import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import MainLayout from "@/Layouts/MainLayout";
import { Head, useForm, usePage } from "@inertiajs/react";

import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function Dashboard({ users, departments, queryParams }) {
    const { auth, flash } = usePage().props;
    const breadcrumbs = [{ label: "User Management", showOnMobile: true }];

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
            <Head title="Users" />

            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-7">
                <pre>{JSON.stringify(users, undefined, 2)}</pre>
            </div>
        </MainLayout>
    );
}
