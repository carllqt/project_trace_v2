import { Download, FileText } from "lucide-react";
import FileUploadField from "@/Components/FileUploadField";
export default function DocumentsTab({ currentPR }) {
    if (!currentPR) return null;
    const documents = currentPR.documents ?? [];
    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Attached File Artifacts
                </h3>
                <span className="text-xs text-slate-500">
                    {documents.length} Attachment
                    {documents.length !== 1 ? "s" : ""}
                </span>
            </div>
            {/* Documents List */}
            {documents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between shadow-sm hover:border-blue-300 transition-colors"
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div className="truncate">
                                    <p className="text-xs font-bold text-slate-800 truncate">
                                        {doc.name}
                                    </p>
                                    <p className="text-[10px] text-slate-400">
                                        Stage {doc.stage} • {doc.type} •{" "}
                                        {doc.size}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="p-2 text-slate-400 hover:text-blue-600 rounded-xl hover:bg-slate-50 transition-colors"
                                title={`Download ${doc.name}`}
                            >
                                <Download className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-500">
                        No documents attached yet.
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                        Upload a document to add it to this procurement record.
                    </p>
                </div>
            )}
            {/* Additional Upload */}
            <div className="pt-2">
                <FileUploadField label="Upload Additional Document" />
            </div>
        </div>
    );
}
