import { UploadCloud, FileText, X } from "lucide-react";
import { useMemo, useRef } from "react";

export default function FileUploadField({
    label = "Upload Documents",
    files = [],
    onChange,
    onError,

    // File configuration
    accept = [".pdf", ".docx", ".xlsx"],
    multiple = true,
    maxSize = 15, // MB
    maxFiles = null,

    // UI configuration
    description = "PDF, DOCX, XLSX up to 15MB",
    disabled = false,
}) {
    const inputRef = useRef(null);

    const acceptString = useMemo(() => accept.join(","), [accept]);

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 KB";

        const kb = bytes / 1024;

        if (kb < 1024) {
            return `${kb.toFixed(0)} KB`;
        }

        return `${(kb / 1024).toFixed(1)} MB`;
    };

    const getExtension = (filename) => {
        return `.${filename.split(".").pop().toLowerCase()}`;
    };

    const handleFiles = (selectedFiles) => {
        let selected = Array.from(selectedFiles);

        // Limit number of files
        if (maxFiles && selected.length > maxFiles) {
            onError?.(`You can only upload a maximum of ${maxFiles} file(s).`);

            selected = selected.slice(0, maxFiles);
        }

        // Validate files
        const validFiles = [];

        for (const file of selected) {
            const extension = getExtension(file.name);

            // Validate extension
            if (!accept.includes(extension)) {
                onError?.(`${file.name} is not an allowed file type.`);

                continue;
            }

            // Validate size
            if (file.size > maxSize * 1024 * 1024) {
                onError?.(
                    `${file.name} exceeds the ${maxSize}MB file size limit.`,
                );

                continue;
            }

            validFiles.push(file);
        }

        if (multiple) {
            onChange?.(validFiles);
        } else {
            onChange?.(validFiles[0] ?? null);
        }
    };

    const removeFile = (index) => {
        if (!multiple) {
            onChange?.(null);
            return;
        }

        const updatedFiles = files.filter(
            (_, fileIndex) => fileIndex !== index,
        );

        onChange?.(updatedFiles);
    };

    return (
        <div className="col-span-1 sm:col-span-2">
            {/* Label */}
            {label && (
                <label className="mb-1 block text-[11px] font-bold text-slate-600">
                    {label}
                </label>
            )}

            {/* Upload Area */}
            <label
                className={`
                    group mt-1 flex cursor-pointer
                    justify-center rounded-2xl
                    border-2 border-dashed
                    border-slate-200
                    bg-slate-50/50
                    px-4 py-5
                    transition-all

                    ${
                        disabled
                            ? "cursor-not-allowed opacity-50"
                            : "hover:border-blue-400 hover:bg-blue-50/30"
                    }
                `}
            >
                <div className="space-y-1 text-center">
                    <UploadCloud
                        className="
                            mx-auto h-7 w-7
                            text-slate-400
                            transition-colors
                            group-hover:text-blue-600
                        "
                    />

                    <div className="flex justify-center text-xs font-medium text-slate-600">
                        <span className="font-bold text-blue-600">
                            Click to upload
                        </span>

                        <span className="pl-1">
                            {multiple
                                ? "or drag files here"
                                : "or drag file here"}
                        </span>
                    </div>

                    <p className="text-[10px] text-slate-400">{description}</p>
                </div>

                <input
                    ref={inputRef}
                    type="file"
                    multiple={multiple}
                    disabled={disabled}
                    accept={acceptString}
                    className="hidden"
                    onChange={(e) => {
                        handleFiles(e.target.files);

                        // Allow selecting the same file again
                        e.target.value = "";
                    }}
                />
            </label>

            {/* Selected Files */}
            {files.length > 0 && (
                <div className="mt-3 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Selected Files ({files.length})
                    </p>

                    {files.map((file, index) => (
                        <div
                            key={`${file.name}-${index}`}
                            className="
                                flex items-center
                                justify-between
                                rounded-xl
                                border border-slate-100
                                bg-white
                                px-3 py-2
                                shadow-sm
                            "
                        >
                            <div className="flex min-w-0 items-center gap-2">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                                    <FileText className="size-4 text-blue-600" />
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate text-xs font-semibold text-slate-700">
                                        {file.name}
                                    </p>

                                    <p className="text-[10px] text-slate-400">
                                        {formatFileSize(file.size)}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="
                                    ml-2 shrink-0
                                    rounded-full
                                    p-1
                                    text-slate-400
                                    transition
                                    hover:bg-red-50
                                    hover:text-red-500
                                "
                            >
                                <X className="size-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
