import FileUploadField from "@/Components/FileUploadField";

export default function StageFormCard({
    stage,
    isCurrentStage,
    isPassedStage,
    children,
    files = [],
    onFilesChange,
    onFileError,
}) {
    const docs = stage?.docs ?? [];

    return (
        <div
            className={`
                rounded-2xl border transition-all overflow-hidden
                ${
                    isCurrentStage
                        ? "border-blue-300 bg-white shadow-md ring-1 ring-blue-100"
                        : isPassedStage
                          ? "border-slate-200 bg-slate-50/50 opacity-90"
                          : "border-slate-100 bg-slate-50/30 opacity-60"
                }
            `}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <span
                        className={`
                            w-6 h-6 rounded-lg text-white font-bold text-xs
                            flex items-center justify-center
                            bg-gradient-to-tr ${
                                stage?.color ?? "from-slate-500 to-slate-600"
                            }
                        `}
                    >
                        {stage?.id}
                    </span>

                    <span className="font-bold text-xs text-slate-800">
                        Stage {stage?.id}: {stage?.name}
                    </span>
                </div>

                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-200/70 text-slate-600">
                    Actor: {stage?.actor ?? "N/A"}
                </span>
            </div>

            {/* Form */}
            <div className="p-5">{children}</div>

            {/* Required Uploads */}
            <div className="px-5 pb-5">
                <div className="pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                        Required Stage Uploads:{" "}
                        {docs.length > 0 ? docs.join(", ") : "None"}
                    </span>

                    {isCurrentStage && docs.length > 0 && (
                        <FileUploadField
                            label={`Attach File for Stage ${stage.id}`}
                            files={files}
                            onChange={onFilesChange}
                            onError={onFileError}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
