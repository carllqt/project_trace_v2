import { useForm } from "@inertiajs/react";
import { AlertTriangle, Trash2, UserRound, X } from "lucide-react";

import { Button } from "@/Components/ui/button";

export default function DeleteUserModal({ open, onClose, user = null }) {
    const { delete: destroy, processing } = useForm();

    if (!open || !user) return null;

    const handleDelete = () => {
        destroy(route("user.destroy", user.id), {
            preserveScroll: true,

            onSuccess: () => {
                onClose();
            },
        });
    };

    const handleClose = () => {
        if (!processing) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/45 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-md overflow-hidden rounded-[26px] border border-white/80 bg-white/90 shadow-[0_25px_80px_rgba(15,23,42,0.20)] backdrop-blur-2xl">
                {/* Accent */}
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-red-500 via-rose-500 to-red-500" />

                {/* Header */}
                <div className="border-b border-slate-200/80 bg-slate-50/50 px-6 pb-5 pt-7">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-100 bg-red-50">
                                <Trash2 className="h-5 w-5 text-red-600" />
                            </div>

                            <div>
                                <h2 className="text-lg font-bold tracking-tight text-slate-900">
                                    Delete Account
                                </h2>

                                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                                    Permanently remove this user account.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={processing}
                            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                    {/* User */}
                    <div className="mb-5 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                            <UserRound className="h-4 w-4 text-slate-500" />
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-800">
                                {user.name}
                            </p>

                            <p className="truncate text-xs text-slate-500">
                                {user.email}
                            </p>

                            {user.department?.name && (
                                <p className="mt-0.5 truncate text-xs text-slate-400">
                                    {user.department.name}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Warning */}
                    <div className="rounded-xl border border-red-200 bg-red-50/70 p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                            <div>
                                <p className="text-sm font-semibold text-red-800">
                                    This action cannot be undone.
                                </p>

                                <p className="mt-1 text-xs leading-relaxed text-red-700/80">
                                    Deleting this account will permanently
                                    remove the user's access to the system.
                                    Please make sure you have selected the
                                    correct account.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col-reverse gap-2 border-t border-slate-200/80 bg-slate-50/70 px-6 py-4 sm:flex-row sm:justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={processing}
                        className="rounded-xl border-slate-200 bg-white"
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        onClick={handleDelete}
                        disabled={processing}
                        className="rounded-xl bg-red-600 px-5 text-white shadow-sm hover:bg-red-700"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />

                        {processing ? "Deleting..." : "Delete Account"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
