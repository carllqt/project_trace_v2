import { FileText } from "lucide-react";
import Pagination from "@/Components/Pagination";

export default function DynamicTable({
    data = [],
    allColumns = [],
    columnRenderers = {},
    pagination = null,
    queryParams = {},
    onRowClick,
    emptyMessage = "No records found.",
    emptyDescription = "Try adjusting your filters or search criteria.",
    rowKey = "id",
}) {
    return (
        <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/70 shadow-[0_8px_30px_rgba(0,0,0,0.03)] backdrop-blur-xl">
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            {allColumns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`px-6 py-3.5 ${
                                        column.className || ""
                                    }`}
                                >
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100/60 text-xs">
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={allColumns.length}
                                    className="px-6 py-12 text-center text-slate-400"
                                >
                                    <FileText className="mx-auto mb-2 h-10 w-10 text-slate-300" />

                                    <p className="font-semibold text-slate-600">
                                        {emptyMessage}
                                    </p>

                                    <p className="text-[11px]">
                                        {emptyDescription}
                                    </p>
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIndex) => (
                                <tr
                                    key={row[rowKey] ?? rowIndex}
                                    onClick={() => onRowClick?.(row)}
                                    className={`group transition-colors hover:bg-blue-50/40 ${
                                        onRowClick ? "cursor-pointer" : ""
                                    }`}
                                >
                                    {allColumns.map((column) => {
                                        const renderer =
                                            columnRenderers[column.key];

                                        return (
                                            <td
                                                key={column.key}
                                                className={`px-6 py-4 ${
                                                    column.cellClassName || ""
                                                }`}
                                                onClick={
                                                    column.stopPropagation
                                                        ? (e) =>
                                                              e.stopPropagation()
                                                        : undefined
                                                }
                                            >
                                                {renderer
                                                    ? renderer(row, rowIndex)
                                                    : (row[column.key] ?? "-")}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}

            {pagination?.links?.length > 3 && (
                <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/50 px-5 py-3 sm:flex-row sm:px-6">
                    <div className="text-[11px] font-medium text-slate-400">
                        Showing{" "}
                        <span className="font-bold text-slate-600">
                            {pagination.from ?? 0}
                        </span>{" "}
                        to{" "}
                        <span className="font-bold text-slate-600">
                            {pagination.to ?? 0}
                        </span>{" "}
                        of{" "}
                        <span className="font-bold text-slate-600">
                            {pagination.total ?? 0}
                        </span>{" "}
                        records
                    </div>

                    <div className="flex justify-end">
                        <Pagination
                            links={pagination.links}
                            queryParams={queryParams}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
