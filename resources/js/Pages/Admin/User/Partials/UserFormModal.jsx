import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import {
    AtSign,
    BriefcaseBusiness,
    Building2,
    CheckCircle2,
    KeyRound,
    ShieldCheck,
    UserPlus,
    UserRoundPen,
    X,
} from "lucide-react";

import { Button } from "@/Components/ui/button";
import InputField from "@/Components/InputField";

export default function UserFormModal({
    open,
    onClose,
    user = null,
    departments = [],
}) {
    const isEdit = Boolean(user?.id);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: user?.name ?? "",
        email: user?.email ?? "",
        department_id: user?.department_id ?? "",
        position: user?.position ?? "",
        role: user?.roles?.[0]?.name ?? user?.role ?? "user",
        is_head: Boolean(user?.is_head),
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        if (open) {
            setData({
                name: user?.name ?? "",
                email: user?.email ?? "",
                department_id: user?.department_id ?? "",
                position: user?.position ?? "",
                role: user?.roles?.[0]?.name ?? user?.role ?? "user",
                is_head: Boolean(user?.is_head),
                password: "",
                password_confirmation: "",
            });
        }
    }, [open, user]);

    if (!open) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEdit) {
            put(route("users.update", user.id), {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });

            return;
        }

        post(route("user.store"), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const handleClose = () => {
        if (!processing) {
            reset();
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/45 p-4 backdrop-blur-sm">
            {/* Modal */}
            <div className="relative my-6 w-full max-w-2xl overflow-hidden rounded-[26px] border border-white/80 bg-white/90 shadow-[0_25px_80px_rgba(15,23,42,0.18)] backdrop-blur-2xl">
                {/* Subtle accent */}
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500" />

                {/* Header */}
                <div className="border-b border-slate-200/80 bg-slate-50/50 px-6 pb-5 pt-7 sm:px-7">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 shadow-sm">
                                {isEdit ? (
                                    <UserRoundPen className="h-5 w-5 text-emerald-600" />
                                ) : (
                                    <UserPlus className="h-5 w-5 text-emerald-600" />
                                )}
                            </div>

                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-xl font-bold tracking-tight text-slate-900">
                                        {isEdit ? "Edit User" : "Add New User"}
                                    </h2>

                                    <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                        {isEdit ? "Account" : "New Account"}
                                    </span>
                                </div>

                                <p className="mt-1 max-w-md text-sm leading-relaxed text-slate-500">
                                    {isEdit
                                        ? "Update account details, department assignment, and system access."
                                        : "Create a user account and configure their department, role, and access."}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={processing}
                            className="rounded-xl p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="max-h-[68vh] overflow-y-auto px-6 py-6 sm:px-7">
                        {/* Personal Information */}
                        <div className="mb-7">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                                    <UserRoundPen className="h-4 w-4 text-slate-600" />
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-slate-800">
                                        Personal Information
                                    </h3>

                                    <p className="text-xs text-slate-400">
                                        Basic information associated with the
                                        account.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <InputField
                                    label="Full Name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    error={errors.name}
                                    placeholder="Enter full name"
                                    required
                                />

                                <InputField
                                    label="Email Address"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    error={errors.email}
                                    placeholder="name@example.com"
                                    required
                                />

                                <InputField
                                    label="Position"
                                    value={data.position}
                                    onChange={(e) =>
                                        setData("position", e.target.value)
                                    }
                                    error={errors.position}
                                    placeholder="e.g. Administrative Officer"
                                />
                            </div>
                        </div>

                        {/* Organization & Access */}
                        <div className="mb-7 rounded-2xl border border-slate-200/80 bg-slate-50/40 p-4 sm:p-5">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                                    <Building2 className="h-4 w-4 text-emerald-600" />
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-slate-800">
                                        Organization & Access
                                    </h3>

                                    <p className="text-xs text-slate-400">
                                        Define the user's organizational
                                        assignment and system role.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                {/* Department */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">
                                        Department
                                        <span className="ml-1 text-emerald-600">
                                            *
                                        </span>
                                    </label>

                                    <select
                                        value={data.department_id}
                                        onChange={(e) =>
                                            setData(
                                                "department_id",
                                                e.target.value,
                                            )
                                        }
                                        className={`h-10 w-full rounded-xl border bg-white px-3 text-sm text-slate-700 shadow-sm outline-none transition-all focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 ${
                                            errors.department_id
                                                ? "border-red-300"
                                                : "border-slate-200"
                                        }`}
                                    >
                                        <option value="">
                                            Select Department
                                        </option>

                                        {Object.entries(departments ?? {}).map(
                                            ([id, name]) => (
                                                <option key={id} value={id}>
                                                    {name}
                                                </option>
                                            ),
                                        )}
                                    </select>

                                    {errors.department_id && (
                                        <p className="text-xs font-medium text-red-500">
                                            {errors.department_id}
                                        </p>
                                    )}
                                </div>

                                {/* Role */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">
                                        System Role
                                        <span className="ml-1 text-emerald-600">
                                            *
                                        </span>
                                    </label>

                                    <select
                                        value={data.role}
                                        onChange={(e) =>
                                            setData("role", e.target.value)
                                        }
                                        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm outline-none transition-all focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
                                    >
                                        <option value="user">User</option>

                                        <option value="admin">
                                            Administrator
                                        </option>
                                    </select>

                                    {errors.role && (
                                        <p className="text-xs font-medium text-red-500">
                                            {errors.role}
                                        </p>
                                    )}
                                </div>

                                {/* Department Head */}
                                <div className="sm:col-span-2">
                                    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white p-3.5 transition hover:border-emerald-200 hover:bg-emerald-50/20">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                                                <CheckCircle2 className="h-4 w-4 text-slate-600" />
                                            </div>

                                            <div>
                                                <p className="text-sm font-semibold text-slate-700">
                                                    Department Head
                                                </p>

                                                <p className="mt-0.5 text-xs text-slate-400">
                                                    Assign this user as a head
                                                    of their department.
                                                </p>
                                            </div>
                                        </div>

                                        <input
                                            type="checkbox"
                                            checked={data.is_head}
                                            onChange={(e) =>
                                                setData(
                                                    "is_head",
                                                    e.target.checked,
                                                )
                                            }
                                            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Account Security */}
                        {!isEdit && (
                            <div>
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                                        <KeyRound className="h-4 w-4 text-slate-600" />
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-slate-800">
                                            Account Security
                                        </h3>

                                        <p className="text-xs text-slate-400">
                                            Set the initial password for this
                                            account.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <InputField
                                        label="Password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        error={errors.password}
                                        placeholder="Enter password"
                                        required
                                    />

                                    <InputField
                                        label="Confirm Password"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value,
                                            )
                                        }
                                        error={errors.password_confirmation}
                                        placeholder="Confirm password"
                                        required
                                    />
                                </div>

                                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <div className="flex items-start gap-2.5">
                                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                                        <p className="text-xs leading-relaxed text-slate-500">
                                            Use a strong password containing
                                            uppercase and lowercase letters,
                                            numbers, and symbols.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col-reverse gap-3 border-t border-slate-200/80 bg-slate-50/70 px-6 py-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:px-7">
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                            <AtSign className="h-3.5 w-3.5" />

                            <span>
                                {isEdit
                                    ? "Changes will be saved to this account."
                                    : "Required fields must be completed."}
                            </span>
                        </div>

                        <div className="flex flex-col-reverse gap-2 sm:flex-row">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={processing}
                                className="h-10 rounded-xl border-slate-200 bg-white px-5 text-slate-600 hover:bg-slate-100"
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="h-10 rounded-xl bg-slate-900 px-5 font-semibold text-white shadow-sm transition-all hover:bg-slate-800 disabled:opacity-60"
                            >
                                {processing
                                    ? "Saving..."
                                    : isEdit
                                      ? "Save Changes"
                                      : "Create User"}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
