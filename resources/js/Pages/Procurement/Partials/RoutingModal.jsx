import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Send, RotateCcw, X } from "lucide-react";

export default function RoutingModal({
    show,
    onClose,
    purchaseRequest,
    routingType,
    departments = [],
    defaultTargetDept = "",
    stageFiles = {},
    setStageFiles,
    onSuccess,
}) {
    const isForward = routingType === "forward";

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        clearErrors,
        transform,
    } = useForm({
        target_department: "",
        remarks: "",
        action: "",
        current_stage: null,
        stage_data: {},
        stage_files: [],
    });

    // ---------------------------------------------------------
    // INITIALIZE FORM WHEN MODAL OPENS
    // ---------------------------------------------------------

    useEffect(() => {
        if (!show || !purchaseRequest) {
            return;
        }

        clearErrors();

        setData({
            target_department: defaultTargetDept ?? "",
            remarks: "",
        });
    }, [show, purchaseRequest?.id, routingType, defaultTargetDept]);

    // ---------------------------------------------------------
    // CLOSE MODAL
    // ---------------------------------------------------------

    const handleClose = () => {
        if (processing) {
            return;
        }

        reset();
        clearErrors();

        onClose?.();
    };

    // ---------------------------------------------------------
    // SUBMIT ROUTING
    // ---------------------------------------------------------

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!purchaseRequest?.id) {
            return;
        }

        const currentStage = Number(purchaseRequest.stage);

        transform((formData) => ({
            ...formData,

            action: routingType,

            current_stage: currentStage,

            stage_data: purchaseRequest.stage_data ?? {},

            stage_files: stageFiles[currentStage] ?? [],
        }));

        post(
            route("procurement.route", {
                procurement: purchaseRequest.id,
            }),
            {
                preserveScroll: true,
                forceFormData: true,

                onSuccess: () => {
                    reset();
                    clearErrors();
                    setStageFiles?.({});

                    // Close modal
                    onSuccess?.();
                },
            },
        );
    };

    // ---------------------------------------------------------
    // DON'T RENDER WHEN CLOSED
    // ---------------------------------------------------------

    if (!show || !purchaseRequest) {
        return null;
    }

    // ---------------------------------------------------------
    // RENDER
    // ---------------------------------------------------------

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            {/* BACKDROP */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* MODAL */}
            <div className="relative w-full max-w-lg animate-in zoom-in-95 fade-in rounded-3xl border border-white/80 bg-white p-6 shadow-2xl duration-200">
                {/* HEADER */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h3 className="flex items-center gap-2 text-base font-bold text-slate-800">
                        {isForward ? (
                            <Send className="h-5 w-5 text-blue-600" />
                        ) : (
                            <RotateCcw className="h-5 w-5 text-red-600" />
                        )}

                        <span>
                            {isForward
                                ? "Forward / Dispatch Procurement Document"
                                : "Return Procurement to Previous Stage"}
                        </span>
                    </h3>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={processing}
                        className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    {/* CURRENT STAGE */}
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                            Current Stage
                        </span>

                        <p className="mt-1 text-xs font-bold text-slate-700">
                            Stage {purchaseRequest.stage}
                        </p>

                        {purchaseRequest.current_department && (
                            <p className="mt-0.5 text-[11px] text-slate-500">
                                Current Department:{" "}
                                {purchaseRequest.current_department}
                            </p>
                        )}
                    </div>

                    {/* TARGET DEPARTMENT */}
                    <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700">
                            Target Department Destination
                        </label>

                        <select
                            value={data.target_department}
                            onChange={(e) =>
                                setData("target_department", e.target.value)
                            }
                            disabled={processing}
                            required
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 disabled:cursor-not-allowed disabled:bg-slate-50"
                        >
                            <option value="">Select department</option>

                            {departments.map((department, index) => {
                                const value =
                                    typeof department === "string"
                                        ? department
                                        : department.name;

                                if (!value) {
                                    return null;
                                }

                                return (
                                    <option
                                        key={
                                            department.id ?? `${value}-${index}`
                                        }
                                        value={value}
                                    >
                                        {value}
                                    </option>
                                );
                            })}
                        </select>

                        {errors.target_department && (
                            <p className="mt-1 text-[11px] text-red-500">
                                {errors.target_department}
                            </p>
                        )}
                    </div>

                    {/* REMARKS */}
                    <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700">
                            Dispatch & Audit Remarks
                        </label>

                        <textarea
                            rows={4}
                            required
                            value={data.remarks}
                            onChange={(e) => setData("remarks", e.target.value)}
                            disabled={processing}
                            placeholder={
                                isForward
                                    ? "Enter notes regarding document validation, contents, or action needed..."
                                    : "Specify reasons for return and missing items..."
                            }
                            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 disabled:cursor-not-allowed disabled:bg-slate-50"
                        />

                        {errors.remarks && (
                            <p className="mt-1 text-[11px] text-red-500">
                                {errors.remarks}
                            </p>
                        )}
                    </div>

                    {/* SERVER ERROR SUMMARY */}
                    {Object.keys(errors).length > 0 && (
                        <div className="rounded-xl border border-red-100 bg-red-50 p-3">
                            <p className="text-[11px] font-semibold text-red-600">
                                Please correct the errors above before
                                continuing.
                            </p>
                        </div>
                    )}

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={processing}
                            className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={
                                processing ||
                                !data.target_department ||
                                !data.remarks.trim()
                            }
                            className={`rounded-xl px-5 py-2 text-xs font-bold text-white shadow-md transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                isForward
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : "bg-red-600 hover:bg-red-700"
                            }`}
                        >
                            {processing
                                ? "Processing..."
                                : isForward
                                  ? "Confirm Dispatch"
                                  : "Confirm Return"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
