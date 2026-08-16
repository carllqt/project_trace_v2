import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import {
    AlertCircle,
    KeyRound,
    LockKeyhole,
    ShieldCheck,
    X,
} from "lucide-react";

import { Button } from "@/Components/ui/button";
import InputField from "@/Components/InputField";

export default function ResetPasswordModal({ open, onClose, user = null }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        if (open) {
            reset();
        }
    }, [open, user]);

    if (!open || !user) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        put(route("admin.users.reset-password", user.id), {
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/45 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-md overflow-hidden rounded-[26px] border border-white/80 bg-white/90 shadow-[0_25px_80px_rgba(15,23,42,0.20)] backdrop-blur-2xl">
                {/* Accent */}
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400" />

                {/* Header */}
                <div className="border-b border-slate-200/80 bg-slate-50/50 px-6 pb-5 pt-7">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-100 bg-amber-50">
                                <KeyRound className="h-5 w-5 text-amber-600" />
                            </div>

                            <div>
                                <h2 className="text-lg font-bold tracking-tight text-slate-900">
                                    Reset Password
                                </h2>

                                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                                    Set a new password for this user's account.
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

                <form onSubmit={handleSubmit}>
                    <div className="px-6 py-6">
                        {/* User Information */}
                        <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Account
                            </p>

                            <div className="mt-2">
                                <p className="text-sm font-semibold text-slate-800">
                                    {user.name}
                                </p>

                                <p className="mt-0.5 text-xs text-slate-500">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        {/* Warning */}
                        <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5">
                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

                            <p className="text-xs leading-relaxed text-amber-800">
                                The current password will no longer work after
                                this change. The user will need to use the new
                                password when signing in.
                            </p>
                        </div>

                        {/* Password Fields */}
                        <div className="space-y-5">
                            <InputField
                                label="New Password"
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                error={errors.password}
                                placeholder="Enter new password"
                                required
                            />

                            <InputField
                                label="Confirm New Password"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value,
                                    )
                                }
                                error={errors.password_confirmation}
                                placeholder="Confirm new password"
                                required
                            />
                        </div>

                        {/* Password Hint */}
                        <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-3">
                            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                            <p className="text-xs leading-relaxed text-slate-500">
                                Use at least 8 characters with a combination of
                                uppercase letters, lowercase letters, numbers,
                                and symbols.
                            </p>
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
                            type="submit"
                            disabled={processing}
                            className="rounded-xl bg-slate-900 px-5 text-white hover:bg-slate-800"
                        >
                            <LockKeyhole className="mr-2 h-4 w-4" />

                            {processing ? "Updating..." : "Reset Password"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
