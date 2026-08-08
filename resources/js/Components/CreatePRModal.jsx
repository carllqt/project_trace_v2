import React from "react";
import { X, FilePlus, UploadCloud } from "lucide-react";
import InputField from "./InputField";
import FileUploadField from "./FileUploadField";

export default function CreatePRModal({
    isOpen,
    onClose,
    onSubmit,
    data,
    setData,
    errors,
    processing,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Centered Modal Card */}
            <div className="relative bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl border border-white/80 max-h-[90vh] overflow-y-auto z-10">
                {/* Header */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                        <FilePlus className="w-5 h-5 text-blue-600" />
                        <span>Create Stage 1 Purchase Request (PR)</span>
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 rounded-full p-1 hover:bg-slate-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={onSubmit} className="mt-4 space-y-5">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Project Title */}
                        <InputField
                            label="Project Title"
                            name="project_title"
                            placeholder="e.g. Server Maintenance Contract"
                            value={data.project_title}
                            onChange={(e) =>
                                setData("project_title", e.target.value)
                            }
                            required
                        />

                        {/* End User Department */}
                        <InputField
                            label="End User Department"
                            name="end_user"
                            value={data.end_user}
                            onChange={(e) =>
                                setData("end_user", e.target.value)
                            }
                            required
                        />

                        {/* ABC */}
                        <InputField
                            label="Approved Budget for Contract (ABC)"
                            name="abc"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={data.abc}
                            onChange={(e) => setData("abc", e.target.value)}
                            required
                        />

                        {/* Mode of Procurement */}
                        <div>
                            <label
                                htmlFor="mode_of_procurement"
                                className="mb-1 block text-[11px] font-bold text-slate-600"
                            >
                                Mode of Procurement
                            </label>

                            <select
                                id="mode_of_procurement"
                                name="mode_of_procurement"
                                value={data.mode_of_procurement}
                                onChange={(e) =>
                                    setData(
                                        "mode_of_procurement",
                                        e.target.value,
                                    )
                                }
                                className="
                    w-full rounded-xl
                    border border-slate-200
                    bg-white px-3 py-2
                    text-xs font-medium text-slate-800
                    outline-none
                    transition
                    focus:border-blue-400
                    focus:ring-2 focus:ring-blue-400/20
                "
                            >
                                <option value="Small Value Procurement (Sec. 53.9)">
                                    Small Value Procurement (Sec. 53.9)
                                </option>

                                <option value="Competitive Bidding">
                                    Competitive Bidding
                                </option>

                                <option value="Direct Contracting">
                                    Direct Contracting
                                </option>

                                <option value="Repeat Order">
                                    Repeat Order
                                </option>
                            </select>

                            {errors?.mode_of_procurement && (
                                <p className="mt-1 text-[11px] font-medium text-red-500">
                                    {errors.mode_of_procurement}
                                </p>
                            )}
                        </div>

                        {/* Purpose */}
                        <div className="col-span-1 sm:col-span-2">
                            <InputField
                                label="Purpose & Justification"
                                name="purpose"
                                placeholder="Detailed purpose of the purchase request..."
                                value={data.purpose}
                                onChange={(e) =>
                                    setData("purpose", e.target.value)
                                }
                                required
                            />
                        </div>
                    </div>

                    {/* Documents */}
                    <FileUploadField
                        label="Upload Required PPMP, Market Scoping & PR Docs"
                        files={data.documents}
                        onChange={(files) => setData("documents", files)}
                        onError={(message) => console.error(message)}
                        accept={[".pdf", ".docx", ".xlsx"]}
                        multiple
                        maxSize={15}
                        maxFiles={5}
                        description="PDF, DOCX, XLSX up to 15MB each"
                    />

                    {/* Actions */}
                    <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={processing}
                            className="
                rounded-xl px-4 py-2
                text-xs font-bold text-slate-600
                transition-colors
                hover:bg-slate-100
                disabled:cursor-not-allowed
                disabled:opacity-50
            "
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="
                rounded-xl
                bg-blue-600
                px-5 py-2
                text-xs font-bold text-white
                shadow-md
                transition-all
                hover:bg-blue-700
                active:scale-95
                disabled:cursor-not-allowed
                disabled:opacity-50
            "
                        >
                            {processing
                                ? "Initializing..."
                                : "Initialize PR & Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
