import { CheckCircle2, Circle, Loader2, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";

export default function StageFormCard({
    stage,
    isCurrentStage,
    isPassedStage,
    canEditStage,
    children,
    currentPR,
    onDocumentsChanged = () => {},
}) {
    const docs = stage?.docs ?? [];
    const documents = currentPR?.documents ?? [];

    const [uploadingLabel, setUploadingLabel] = useState(null);
    const fileInputRefs = useRef({});

    // A card is "checked" purely because a matching document exists for
    // this stage + label — never a manual toggle. It turns green once
    // onDocumentsChanged() refreshes currentPR.documents after upload.
    const findUploadedDoc = (label) => {
        const normalizedLabel = label.trim().toLowerCase();

        return documents.find((doc) => {
            const requiredLabel = (doc.required_label ?? "").toLowerCase();
            const docStage = String(doc.stage ?? "").toLowerCase();
            const stageMatches =
                docStage === String(stage?.value ?? "").toLowerCase() ||
                docStage === String(stage?.id ?? "").toLowerCase();

            if (requiredLabel && requiredLabel === normalizedLabel) {
                return !docStage || stageMatches;
            }

            const name = (doc.name ?? doc.original_name ?? "").toLowerCase();

            return stageMatches && name.includes(normalizedLabel);
        });
    };

    const triggerFileSelect = (label) => {
        fileInputRefs.current[label]?.click();
    };

    const handleFileSelected = (label, e) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file || !currentPR?.id) return;

        if (file.size > 15 * 1024 * 1024) {
            toast.error("File exceeds the 15MB limit.");
            return;
        }

        const formData = new FormData();
        formData.append("stage", stage.value);
        formData.append("documents[]", file);
        formData.append("required_label", label);

        setUploadingLabel(label);

        router.post(
            route("procurements.documents.store", currentPR.id),
            formData,
            {
                forceFormData: true,
                preserveScroll: true,
                preserveState: true,

                onSuccess: () => {
                    toast.success(`"${label}" uploaded.`);
                    onDocumentsChanged?.();
                },

                onError: (errors) => {
                    console.error(errors);
                    toast.error(
                        errors.documents ?? `Failed to upload "${label}".`,
                    );
                },

                onFinish: () => {
                    setUploadingLabel(null);
                },
            },
        );
    };

    const uploadedCount = docs.filter((label) => findUploadedDoc(label)).length;

    return (
        <div
            className={`
                overflow-hidden rounded-2xl border transition-all
                ${
                    canEditStage
                        ? "border-blue-300 bg-white shadow-md ring-1 ring-blue-100"
                        : isPassedStage
                          ? "border-slate-200 bg-slate-50/50 opacity-90"
                          : "border-slate-100 bg-slate-50/30 opacity-60"
                }
            `}
        >
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-3">
                    <span
                        className={`
                            flex h-6 w-6 items-center justify-center
                            rounded-lg bg-gradient-to-tr text-xs font-bold text-white
                            ${stage?.color ?? "from-slate-500 to-slate-600"}
                        `}
                    >
                        {stage?.id}
                    </span>

                    <span className="text-xs font-bold text-slate-800">
                        Stage {stage?.id}: {stage?.name}
                    </span>
                </div>

                <span className="rounded-full bg-slate-200/70 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                    Actor: {stage?.actor ?? "N/A"}
                </span>
            </div>

            {/* ACCESS WARNING */}
            {isCurrentStage && !canEditStage && (
                <div className="mx-5 mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                    <p className="text-xs font-bold text-amber-700">
                        This stage is assigned to another department.
                    </p>

                    <p className="mt-1 text-[11px] text-amber-600">
                        You can view this stage, but only the assigned
                        department can edit the form or upload documents.
                    </p>
                </div>
            )}

            {/* FORM */}
            <div
                className={
                    canEditStage ? "p-5" : "pointer-events-none p-5 opacity-60"
                }
            >
                {children}
            </div>

            {/* DOCUMENTS */}
            {docs.length > 0 && (
                <div className="px-5 pb-5">
                    <div className="border-t border-slate-100 pt-3">
                        <div className="mb-2.5 flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                Required Stage Uploads
                            </span>

                            <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                    uploadedCount === docs.length
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-slate-100 text-slate-500"
                                }`}
                            >
                                {uploadedCount}/{docs.length}
                            </span>
                        </div>

                        {/* ONLY ASSIGNED DEPARTMENT CAN UPLOAD */}
                        {canEditStage ? (
                            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                {docs.map((label) => {
                                    const uploadedDoc = findUploadedDoc(label);
                                    const isUploaded = Boolean(uploadedDoc);
                                    const isUploading =
                                        uploadingLabel === label;

                                    return (
                                        <div key={label} className="relative">
                                            <input
                                                type="file"
                                                ref={(el) =>
                                                    (fileInputRefs.current[
                                                        label
                                                    ] = el)
                                                }
                                                className="hidden"
                                                accept=".pdf,.doc,.docx,.xls,.xlsx"
                                                onChange={(e) =>
                                                    handleFileSelected(label, e)
                                                }
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    triggerFileSelect(label)
                                                }
                                                disabled={isUploading}
                                                className={`group flex w-full flex-col items-start gap-2 rounded-xl border p-3 text-left transition-all duration-300 disabled:cursor-not-allowed ${
                                                    isUploaded
                                                        ? "border-emerald-200 bg-emerald-50 hover:border-emerald-300 hover:shadow-sm"
                                                        : "border-slate-200 bg-slate-50/60 hover:border-blue-300 hover:bg-blue-50/40 hover:shadow-sm"
                                                } ${
                                                    isUploading
                                                        ? "opacity-70"
                                                        : "active:scale-[0.98]"
                                                }`}
                                            >
                                                <div className="flex w-full items-start justify-between gap-2">
                                                    <div
                                                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors ${
                                                            isUploaded
                                                                ? "bg-emerald-500 text-white"
                                                                : "bg-white text-slate-300 ring-1 ring-inset ring-slate-200 group-hover:text-blue-400 group-hover:ring-blue-200"
                                                        }`}
                                                    >
                                                        {isUploading ? (
                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                        ) : isUploaded ? (
                                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                                        ) : (
                                                            <Circle className="h-3.5 w-3.5" />
                                                        )}
                                                    </div>

                                                    {!isUploaded &&
                                                        !isUploading && (
                                                            <UploadCloud className="h-3.5 w-3.5 shrink-0 text-slate-300 transition-colors group-hover:text-blue-400" />
                                                        )}
                                                </div>

                                                <div className="min-w-0 w-full">
                                                    <p
                                                        className={`truncate text-[11px] font-semibold transition-colors ${
                                                            isUploaded
                                                                ? "text-emerald-700"
                                                                : "text-slate-700"
                                                        }`}
                                                    >
                                                        {label}
                                                    </p>

                                                    <p
                                                        className={`mt-0.5 truncate text-[10px] transition-colors ${
                                                            isUploaded
                                                                ? "text-emerald-600/80"
                                                                : "text-slate-400"
                                                        }`}
                                                    >
                                                        {isUploading
                                                            ? "Uploading..."
                                                            : isUploaded
                                                              ? (uploadedDoc.name ??
                                                                uploadedDoc.original_name)
                                                              : "Tap to upload"}
                                                    </p>
                                                </div>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            /* READ ONLY — still shows checklist status, just not clickable */
                            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                {docs.map((label) => {
                                    const uploadedDoc = findUploadedDoc(label);
                                    const isUploaded = Boolean(uploadedDoc);

                                    return (
                                        <div
                                            key={label}
                                            className={`flex items-center gap-2.5 rounded-xl border p-3 ${
                                                isUploaded
                                                    ? "border-emerald-200 bg-emerald-50"
                                                    : "border-slate-200 bg-slate-50/60"
                                            }`}
                                        >
                                            <div
                                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                                                    isUploaded
                                                        ? "bg-emerald-500 text-white"
                                                        : "bg-white text-slate-300 ring-1 ring-inset ring-slate-200"
                                                }`}
                                            >
                                                {isUploaded ? (
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                ) : (
                                                    <Circle className="h-3.5 w-3.5" />
                                                )}
                                            </div>

                                            <div className="min-w-0">
                                                <p
                                                    className={`truncate text-[11px] font-semibold ${
                                                        isUploaded
                                                            ? "text-emerald-700"
                                                            : "text-slate-700"
                                                    }`}
                                                >
                                                    {label}
                                                </p>
                                                <p className="truncate text-[10px] text-slate-400">
                                                    {isUploaded
                                                        ? (uploadedDoc.name ??
                                                          uploadedDoc.original_name)
                                                        : "Not yet uploaded"}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}

                                <p className="col-span-full text-[11px] font-medium text-slate-500">
                                    Document uploads are restricted to the
                                    currently assigned department.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
