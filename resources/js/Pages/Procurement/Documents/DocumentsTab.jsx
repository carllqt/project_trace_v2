import { Download, FileText, Loader2, Trash2, UploadCloud } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import FileUploadField from "@/Components/FileUploadField";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import RequiredDocumentsChecklist from "./RequiredDocumentsChecklist";

export default function DocumentsTab({
    currentPR,
    onDocumentsChanged = () => {},
}) {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    if (!currentPR) return null;

    const documents = currentPR.documents ?? [];

    const handleFilesChange = (selectedFiles) => {
        setError(null);
        setFiles(selectedFiles);
    };

    const handleUpload = () => {
        if (!files.length) {
            toast.error("Please select at least one document.");
            return;
        }

        const formData = new FormData();

        formData.append(
            "stage",
            currentPR.status ?? `stage_${currentPR.stage_number}`,
        );

        files.forEach((file) => {
            formData.append("documents[]", file);
        });

        setUploading(true);

        router.post(
            route("procurements.documents.store", currentPR.id),
            formData,
            {
                forceFormData: true,
                preserveScroll: true,
                preserveState: true,

                onSuccess: () => {
                    toast.success("Document(s) uploaded successfully.");
                    setFiles([]);
                    onDocumentsChanged?.();
                },

                onError: (errors) => {
                    console.error(errors);
                    toast.error(
                        errors.documents ?? "Failed to upload document(s).",
                    );
                },

                onFinish: () => {
                    setUploading(false);
                },
            },
        );
    };

    const handleDownload = (doc) => {
        window.open(
            route("documents.download", {
                document: doc.id,
            }),
            "_blank",
        );
    };

    const handleDelete = async (doc) => {
        if (deletingId) return;

        const confirmed = window.confirm(
            `Delete "${doc.name}"? This action cannot be undone.`,
        );
        if (!confirmed) return;

        setDeletingId(doc.id);

        try {
            await axios.delete(
                route("documents.destroy", { document: doc.id }),
            );

            toast.success(`"${doc.name}" was deleted.`);
            onDocumentsChanged?.();
        } catch (err) {
            console.error(err);
            toast.error(
                err?.response?.data?.message ?? "Failed to delete document.",
            );
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-4">
            {/* Required Documents Checklist */}
            <RequiredDocumentsChecklist
                currentPR={currentPR}
                onDocumentsChanged={onDocumentsChanged}
            />

            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Attached File Artifacts
                </h3>

                <span className="text-xs text-slate-500">
                    {documents.length} Attachment
                    {documents.length !== 1 ? "s" : ""}
                </span>
            </div>

            {/* Documents */}
            {documents.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {documents.map((doc) => {
                        const isDeleting = deletingId === doc.id;

                        return (
                            <div
                                key={doc.id}
                                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-colors hover:border-blue-300"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                                        <FileText className="h-5 w-5" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-xs font-bold text-slate-800">
                                            {doc.name}
                                        </p>

                                        <p className="text-[10px] text-slate-400">
                                            Stage {doc.stage} • {doc.type} •{" "}
                                            {doc.size}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex shrink-0 items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => handleDownload(doc)}
                                        disabled={isDeleting}
                                        className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                                        title={`Download ${doc.name}`}
                                    >
                                        <Download className="h-4 w-4" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDelete(doc)}
                                        disabled={isDeleting}
                                        className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                        title={`Delete ${doc.name}`}
                                    >
                                        {isDeleting ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                    <FileText className="mx-auto mb-2 h-8 w-8 text-slate-300" />

                    <p className="text-xs font-semibold text-slate-500">
                        No documents attached yet.
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                        Upload a document to add it to this procurement record.
                    </p>
                </div>
            )}

            {/* Upload */}
            <div className="space-y-3 border-t border-slate-100 pt-4">
                <FileUploadField
                    label="Upload Additional Document"
                    files={files}
                    onChange={handleFilesChange}
                    onError={setError}
                    accept={[".pdf", ".doc", ".docx", ".xls", ".xlsx"]}
                    multiple={true}
                    maxSize={15}
                    description="PDF, DOC, DOCX, XLS, XLSX up to 15MB"
                    disabled={uploading}
                />

                {error && (
                    <p className="text-[11px] font-medium text-red-500">
                        {error}
                    </p>
                )}

                {files.length > 0 && (
                    <button
                        type="button"
                        onClick={handleUpload}
                        disabled={uploading}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <UploadCloud className="h-4 w-4" />
                                Upload{" "}
                                {files.length > 1 ? "Documents" : "Document"}
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
