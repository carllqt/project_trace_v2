import { useEffect, useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import { Edit, KeyRound, Trash2, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";

import MainLayout from "@/Layouts/MainLayout";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import DynamicTable from "@/Components/DynamicTable";

import { Button } from "@/Components/ui/button";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";
import UserFormModal from "./Partials/UserFormModal";
import ResetPasswordModal from "./Partials/ResetPasswordModal";
import DeleteUserModal from "./Partials/resources/js/Pages/Admin/Users/DeleteUserModal";

export default function Dashboard({ users, departments, queryParams = {} }) {
    const { flash } = usePage().props;

    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }

        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const breadcrumbs = [
        {
            label: "User Management",
            showOnMobile: true,
        },
    ];

    /*
    |--------------------------------------------------------------------------
    | Actions
    |--------------------------------------------------------------------------
    */

    const handleEdit = (user) => {
        setSelectedUser(user);
        setShowUserModal(true);
    };

    const handleResetPassword = (user) => {
        setSelectedUser(user);
        setShowResetPasswordModal(true);
    };

    const handleDelete = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };
    /*
    |--------------------------------------------------------------------------
    | Table Columns
    |--------------------------------------------------------------------------
    */
    const allColumns = [
        {
            key: "name",
            label: "Name",
        },
        {
            key: "email",
            label: "Email",
        },
        {
            key: "department",
            label: "Department",
        },
        {
            key: "role",
            label: "Role",
        },
        {
            key: "position",
            label: "Position",
        },
        {
            key: "is_head",
            label: "Head",
        },
        {
            key: "actions",
            label: "Actions",
        },
    ];
    /*
    |--------------------------------------------------------------------------
    | Column Renderers
    |--------------------------------------------------------------------------
    */
    const columnRenderers = {
        department: (user) => (
            <span className="font-medium text-slate-700">
                {user.department?.name ?? "No Department"}
            </span>
        ),

        role: (user) => {
            const role = user.roles?.[0]?.name ?? user.role ?? "No Role";

            return (
                <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold capitalize text-blue-700">
                    {role}
                </span>
            );
        },

        position: (user) => (
            <span className="text-slate-600">{user.position ?? "—"}</span>
        ),

        is_head: (user) => (
            <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                    user.is_head
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                }`}
            >
                {user.is_head ? "Yes" : "No"}
            </span>
        ),

        actions: (user) => (
            <div
                className="flex items-center justify-end gap-1"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Edit */}
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                    title="Edit User"
                    onClick={() => handleEdit(user)}
                >
                    <Edit className="h-4 w-4" />
                </Button>

                {/* Reset Password */}
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                    title="Reset Password"
                    onClick={() => handleResetPassword(user)}
                >
                    <KeyRound className="h-4 w-4" />
                </Button>

                {/* Delete */}
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600"
                    title="Delete Account"
                    onClick={() => handleDelete(user)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        ),
    };

    return (
        <MainLayout>
            <Head title="User Management" />

            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-7">
                {/* Header */}
                <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    {/* Header Information */}
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50">
                            <Users className="h-5 w-5 text-blue-600" />
                        </div>

                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                    User Management
                                </h1>

                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                    Administration
                                </span>
                            </div>

                            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
                                Manage user accounts, roles, department
                                assignments, and access permissions across the
                                system.
                            </p>
                        </div>
                    </div>

                    {/* Add User */}
                    <Button
                        type="button"
                        variant="outline"
                        className="h-10 w-full rounded-xl border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 sm:w-auto"
                        onClick={() => {
                            setSelectedUser(null);
                            setShowUserModal(true);
                        }}
                    >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
                </div>

                {/* Filters */}
                <FilterToggle
                    queryParams={queryParams}
                    visibleFilters={["department", "role"]}
                    departments={departments}
                    clearRouteName="dashboard"
                />

                {/* User Registry */}
                <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/70 shadow-[0_8px_30px_rgba(0,0,0,0.03)] backdrop-blur-xl mt-4">
                    {/* Table Header */}
                    <div className="flex items-center justify-between border-b border-slate-100/80 bg-white/40 px-6 py-4">
                        <div>
                            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                                <Users className="h-4 w-4 text-blue-600" />
                                <span>User Registry</span>
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                Manage registered system accounts and their
                                assigned departments.
                            </p>
                        </div>

                        <div className="text-xs font-medium text-slate-500">
                            {users?.total ?? users?.data?.length ?? 0} users
                        </div>
                    </div>

                    <DynamicTable
                        data={users?.data ?? []}
                        allColumns={allColumns}
                        columnRenderers={columnRenderers}
                        pagination={users}
                        onRowClick={(user) => setSelectedUser(user)}
                    />
                </div>
                <UserFormModal
                    open={showUserModal}
                    onClose={() => {
                        setShowUserModal(false);
                        setSelectedUser(null);
                    }}
                    user={selectedUser}
                    departments={departments}
                />

                <ResetPasswordModal
                    open={showResetPasswordModal}
                    onClose={() => {
                        setShowResetPasswordModal(false);
                        setSelectedUser(null);
                    }}
                    user={selectedUser}
                />

                <DeleteUserModal
                    open={showDeleteModal}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setSelectedUser(null);
                    }}
                    user={selectedUser}
                />
            </div>
        </MainLayout>
    );
}
