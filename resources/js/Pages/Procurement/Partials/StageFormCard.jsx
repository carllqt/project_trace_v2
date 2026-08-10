import FileUploadField from "@/Components/FileUploadField";

export default function StageFormCard({
    stage,
    isCurrentStage,
    isPassedStage,
    canEditStage,
    children,
    files = [],
    onFilesChange,
    onFileError,
}) {
    const docs = stage?.docs ?? [];

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
            <div className="px-5 pb-5">
                <div className="border-t border-slate-100 pt-3">
                    <span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Required Stage Uploads:{" "}
                        {docs.length > 0 ? docs.join(", ") : "None"}
                    </span>

                    {/* ONLY ASSIGNED DEPARTMENT */}
                    {canEditStage && docs.length > 0 && (
                        <FileUploadField
                            label={`Attach File for Stage ${stage.id}`}
                            files={files}
                            onChange={onFilesChange}
                            onError={onFileError}
                        />
                    )}

                    {/* READ ONLY */}
                    {isCurrentStage && !canEditStage && docs.length > 0 && (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                            <p className="text-[11px] font-medium text-slate-500">
                                Document uploads are restricted to the currently
                                assigned department.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
