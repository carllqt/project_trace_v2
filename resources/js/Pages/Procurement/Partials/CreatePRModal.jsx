import React from "react";
import { X, FilePlus, Paperclip, ClipboardList } from "lucide-react";
import InputField from "../../../Components/InputField";
import FileUploadField from "../../../Components/FileUploadField";
import SelectField from "../../../Components/SelectField";
import InputError from "../../../Components/InputError";
export default function CreatePRModal({
    departments,
    isOpen,
    onClose,
    onSubmit,
    data,
    setData,
    errors,
    processing,
}) {
    if (!isOpen) return null;
    const departmentOptions = Object.entries(departments ?? {}).map(
        ([id, name]) => ({
            value: id,
            label: name,
        }),
    );
    const procurementOptions = [
        {
            value: "Small Value Procurement (Sec. 53.9)",
            label: "Small Value Procurement (Sec. 53.9)",
        },
        {
            value: "Competitive Bidding",
            label: "Competitive Bidding",
        },
        {
            value: "Direct Contracting",
            label: "Direct Contracting",
        },
        {
            value: "Repeat Order",
            label: "Repeat Order",
        },
    ];
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/50 backdrop-blur-[3px]"
                onClick={processing ? undefined : onClose}
            />
            {/* Modal */}
            <div className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <FilePlus className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900">
                                Create Purchase Request
                            </h2>
                            <p className="mt-0.5 text-[11px] font-medium text-slate-500">
                                Stage 1 · Initialize a new procurement request
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
                {/* Content */}
                <form
                    onSubmit={onSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="overflow-y-auto px-6 py-5">
                        {/* Section: Request Information */}
                        <div className="mb-5">
                            <div className="mb-3 flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                    <ClipboardList className="h-3.5 w-3.5" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-800">
                                        Request Information
                                    </h3>
                                    <p className="text-[10px] font-medium text-slate-400">
                                        Basic details of the purchase request
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                                {" "}
                                {/* PR Number */}{" "}
                                <div>
                                    {" "}
                                    <InputField
                                        label="PR Number"
                                        name="pr_no"
                                        placeholder="e.g. PR-2026-001"
                                        value={data.pr_no}
                                        onChange={(e) =>
                                            setData("pr_no", e.target.value)
                                        }
                                        required
                                    />
                                    <InputError message={errors.pr_no} />
                                </div>
                                {/* Project Title */}
                                <div>
                                    <InputField
                                        label="Project Title"
                                        name="project_title"
                                        placeholder="e.g. Server Maintenance Contract"
                                        value={data.project_title}
                                        onChange={(e) =>
                                            setData(
                                                "project_title",
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.project_title}
                                    />
                                </div>
                                {/* End User Department */}
                                <div>
                                    <SelectField
                                        label="End User Department"
                                        name="end_user"
                                        value={data.end_user}
                                        onChange={(e) =>
                                            setData("end_user", e.target.value)
                                        }
                                        options={departmentOptions}
                                        placeholder="Select department"
                                        required
                                    />
                                    <InputError message={errors.end_user} />
                                </div>
                                {/* ABC */}
                                <div>
                                    <InputField
                                        label="Approved Budget for Contract (ABC)"
                                        name="abc"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        value={data.abc}
                                        onChange={(e) =>
                                            setData("abc", e.target.value)
                                        }
                                        required
                                    />
                                    <InputError message={errors.abc} />
                                </div>
                                {/* Date of Implementation */}
                                <div className="sm:col-span-2">
                                    <InputField
                                        label="Date of Implementation"
                                        name="date_of_implementation"
                                        type="date"
                                        value={data.date_of_implementation}
                                        onChange={(e) =>
                                            setData(
                                                "date_of_implementation",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errors.date_of_implementation}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Divider */}
                        <div className="my-5 border-t border-slate-100" />
                        {/* Section: Procurement Details */}
                        <div className="mb-5">
                            <div className="mb-3">
                                <h3 className="text-xs font-bold text-slate-800">
                                    Procurement Details
                                </h3>
                                <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                                    Specify how and why the procurement is being
                                    requested
                                </p>
                            </div>
                            <div className="space-y-4">
                                {/* Mode of Procurement */}
                                <div>
                                    <SelectField
                                        label="Mode of Procurement"
                                        name="mode_of_procurement"
                                        value={data.mode_of_procurement}
                                        onChange={(e) =>
                                            setData(
                                                "mode_of_procurement",
                                                e.target.value,
                                            )
                                        }
                                        options={procurementOptions}
                                        placeholder="Select procurement mode"
                                        required
                                    />
                                    <InputError
                                        message={errors.mode_of_procurement}
                                    />
                                </div>
                                {/* Purpose */}
                                <div>
                                    <InputField
                                        label="Purpose & Justification"
                                        name="purpose"
                                        placeholder="Describe the purpose and justification for this purchase request..."
                                        value={data.purpose}
                                        onChange={(e) =>
                                            setData("purpose", e.target.value)
                                        }
                                    />
                                    <InputError message={errors.purpose} />
                                </div>
                            </div>
                        </div>
                        {/* Divider */}
                        <div className="my-5 border-t border-slate-100" />
                        {/* Section: Documents */}
                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                                    <Paperclip className="h-3.5 w-3.5" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-800">
                                        Supporting Documents
                                    </h3>
                                    <p className="text-[10px] font-medium text-slate-400">
                                        Attach the required procurement
                                        documents
                                    </p>
                                </div>
                            </div>
                            <FileUploadField
                                label="PPMP, Market Scoping & PR Documents"
                                files={data.documents}
                                onChange={(files) =>
                                    setData("documents", files)
                                }
                                onError={(message) => console.error(message)}
                                accept={[".pdf", ".docx", ".xlsx"]}
                                multiple
                                maxSize={15}
                                maxFiles={5}
                                description="PDF, DOCX, or XLSX · Maximum 15 MB per file · Up to 5 files"
                            />
                        </div>
                    </div>
                    {/* Footer */}
                    <div className="flex shrink-0 items-center justify-between border-t border-slate-100 bg-slate-50/70 px-6 py-4">
                        <p className="hidden text-[10px] font-medium text-slate-400 sm:block">
                            Fields marked with{" "}
                            <span className="text-red-500">*</span> are
                            required.
                        </p>
                        <div className="ml-auto flex items-center gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={processing}
                                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-[11px] font-bold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-[11px] font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? (
                                    <>
                                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        Initializing...
                                    </>
                                ) : (
                                    <>
                                        <FilePlus className="h-3.5 w-3.5" />
                                        Initialize PR
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
