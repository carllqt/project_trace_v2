import { CheckCircle2, Circle, Lock, Loader2, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { PROCUREMENT_STAGES } from "@/constants";
import { refreshResource } from "@/utils/refreshResource";

export default function RequiredDocumentsChecklist({
    currentPR,
    onDocumentsChanged = () => {},
}) {
    const [uploadingKey, setUploadingKey] = useState(null); // `${stage.id}:${label}`
    const fileInputRefs = useRef({});

    if (!currentPR) return null;

    const currentStageNumber = Number(currentPR.stage) || 1;
    const documents = currentPR.documents ?? [];

    // Every stage that actually requires documents (Stage 7 "Completed" is skipped).
    const stagesWithDocs = PROCUREMENT_STAGES.filter(
        (stage) => (stage.docs ?? []).length > 0,
    );

    if (stagesWithDocs.length === 0) return null;

    // A card is "checked" purely because a matching document exists for that
    // stage + label combo — never a manual toggle. Refreshing currentPR.documents
    // after a successful upload is what flips it green.
    const findUploadedDoc = (stage, label) => {
        const normalizedLabel = label.trim().toLowerCase();

        return documents.find((doc) => {
            const requiredLabel = (doc.required_label ?? "").toLowerCase();
            const docStage = String(doc.stage ?? "").toLowerCase();
            const stageMatches =
                docStage === String(stage.value).toLowerCase() ||
                docStage === String(stage.id).toLowerCase();

            if (requiredLabel && requiredLabel === normalizedLabel) {
                // Prefer an exact label match tied to the right stage, but
                // still count it if stage tagging is missing/legacy.
                return !docStage || stageMatches;
            }

            // Fallback for uploads made before required_label existed.
            const name = (doc.name ?? doc.original_name ?? "").toLowerCase();

            return stageMatches && name.includes(normalizedLabel);
        });
    };

    const triggerFileSelect = (key) => {
        fileInputRefs.current[key]?.click();
    };

    const handleFileSelected = (stage, label, key, e) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;

        if (file.size > 15 * 1024 * 1024) {
            toast.error("File exceeds the 15MB limit.");
            return;
        }

        const formData = new FormData();
        // Tag the upload with the stage it actually belongs to, not
        // necessarily the PR's current stage — this view spans all stages.
        formData.append("stage", stage.value);
        formData.append("documents[]", file);
        formData.append("required_label", label);

        setUploadingKey(key);

        router.post(
            route("procurements.documents.store", currentPR.id),
            formData,
            {
                forceFormData: true,
                preserveScroll: true,
                preserveState: true,

                onSuccess: async () => {
                    toast.success(`"${label}" uploaded.`);

                    await refreshResource({
                        routeName: "procurement.show",
                        id: currentPR.id,
                        label: "RequiredDocumentsChecklist",

                        onSuccess: (freshPR) => {
                            console.log(
                                "[refreshResource] Fresh procurement received:",
                                freshPR,
                            );

                            onDocumentsChanged?.(freshPR);
                        },

                        onError: () => {
                            toast.error(
                                "File uploaded, but the updated document list could not be loaded.",
                            );
                        },
                    });
                },

                onError: (errors) => {
                    console.error(errors);
                    toast.error(
                        errors.documents ?? `Failed to upload "${label}".`,
                    );
                },

                onFinish: () => {
                    setUploadingKey(null);
                },
            },
        );
    };

    // Overall progress across every stage, for the header summary.
    const totalRequired = stagesWithDocs.reduce(
        (sum, stage) => sum + stage.docs.length,
        0,
    );
    const totalUploaded = stagesWithDocs.reduce(
        (sum, stage) =>
            sum +
            stage.docs.filter((label) => findUploadedDoc(stage, label)).length,
        0,
    );
    const allComplete = totalRequired > 0 && totalUploaded === totalRequired;

    return (
        <div className="space-y-4">
            {/* Overall summary */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                            Required Documents — Full PR Checklist
                        </h3>
                        <p className="mt-0.5 text-[11px] text-slate-400">
                            Every document required across all stages of this
                            procurement.
                        </p>
                    </div>

                    <span
                        className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors ${
                            allComplete
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                        }`}
                    >
                        {allComplete && <CheckCircle2 className="h-3 w-3" />}
                        {totalUploaded}/{totalRequired} complete
                    </span>
                </div>

                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                        className="h-full rounded-full bg-emerald-500 transition-all duration-500 ease-out"
                        style={{
                            width: `${
                                totalRequired
                                    ? (totalUploaded / totalRequired) * 100
                                    : 0
                            }%`,
                        }}
                    />
                </div>
            </div>

            {/* Per-stage sections */}
            {stagesWithDocs.map((stage) => {
                const isCurrentStage = Number(stage.id) === currentStageNumber;
                const isPastStage = Number(stage.id) < currentStageNumber;
                const isFutureStage = Number(stage.id) > currentStageNumber;

                const stageUploadedCount = stage.docs.filter((label) =>
                    findUploadedDoc(stage, label),
                ).length;
                const stageComplete = stageUploadedCount === stage.docs.length;

                return (
                    <div
                        key={stage.id}
                        className={`rounded-2xl border p-4 shadow-sm transition-colors ${
                            isCurrentStage
                                ? "border-blue-200 bg-blue-50/30"
                                : "border-slate-200 bg-white"
                        }`}
                    >
                        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 items-center gap-2.5">
                                <span
                                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold ${
                                        isCurrentStage
                                            ? "bg-blue-600 text-white"
                                            : "bg-slate-100 text-slate-500"
                                    }`}
                                >
                                    {stage.id}
                                </span>
                                <div className="min-w-0">
                                    <p className="truncate text-xs font-bold text-slate-800">
                                        {stage.label}
                                    </p>
                                    {isCurrentStage && (
                                        <p className="text-[10px] font-semibold text-blue-600">
                                            Current stage
                                        </p>
                                    )}
                                </div>
                            </div>

                            <span
                                className={`inline-flex w-fit shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                    stageComplete
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-slate-100 text-slate-500"
                                }`}
                            >
                                {stageUploadedCount}/{stage.docs.length}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {stage.docs.map((label) => {
                                const key = `${stage.id}:${label}`;
                                const uploadedDoc = findUploadedDoc(
                                    stage,
                                    label,
                                );
                                const isUploaded = Boolean(uploadedDoc);
                                const isUploading = uploadingKey === key;
                                // Future stages are locked until the PR reaches them.
                                const isLocked = isFutureStage && !isUploaded;

                                return (
                                    <div key={label} className="relative">
                                        <input
                                            type="file"
                                            ref={(el) =>
                                                (fileInputRefs.current[key] =
                                                    el)
                                            }
                                            className="hidden"
                                            accept=".pdf,.doc,.docx,.xls,.xlsx"
                                            onChange={(e) =>
                                                handleFileSelected(
                                                    stage,
                                                    label,
                                                    key,
                                                    e,
                                                )
                                            }
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                !isLocked &&
                                                triggerFileSelect(key)
                                            }
                                            disabled={isUploading || isLocked}
                                            className={`group flex w-full flex-col items-start gap-2.5 rounded-xl border p-3.5 text-left transition-all duration-300 disabled:cursor-not-allowed ${
                                                isUploaded
                                                    ? "border-emerald-200 bg-emerald-50 hover:border-emerald-300 hover:shadow-sm"
                                                    : isLocked
                                                      ? "border-slate-100 bg-slate-50/40 opacity-60"
                                                      : "border-slate-200 bg-slate-50/60 hover:border-blue-300 hover:bg-blue-50/40 hover:shadow-sm"
                                            } ${
                                                isUploading
                                                    ? "opacity-70"
                                                    : !isLocked &&
                                                      "active:scale-[0.98]"
                                            }`}
                                        >
                                            <div className="flex w-full items-start justify-between gap-2">
                                                <div
                                                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${
                                                        isUploaded
                                                            ? "bg-emerald-500 text-white"
                                                            : isLocked
                                                              ? "bg-white text-slate-300 ring-1 ring-inset ring-slate-200"
                                                              : "bg-white text-slate-300 ring-1 ring-inset ring-slate-200 group-hover:text-blue-400 group-hover:ring-blue-200"
                                                    }`}
                                                >
                                                    {isUploading ? (
                                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                    ) : isUploaded ? (
                                                        <CheckCircle2 className="h-4 w-4" />
                                                    ) : isLocked ? (
                                                        <Lock className="h-3.5 w-3.5" />
                                                    ) : (
                                                        <Circle className="h-4 w-4" />
                                                    )}
                                                </div>

                                                {!isUploaded &&
                                                    !isUploading &&
                                                    !isLocked && (
                                                        <UploadCloud className="h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-blue-400" />
                                                    )}
                                            </div>

                                            <div className="min-w-0 w-full">
                                                <p
                                                    className={`truncate text-xs font-semibold transition-colors ${
                                                        isUploaded
                                                            ? "text-emerald-700"
                                                            : isLocked
                                                              ? "text-slate-400"
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
                                                          : isLocked
                                                            ? "Locked until this stage"
                                                            : "Tap to upload"}
                                                </p>
                                            </div>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
