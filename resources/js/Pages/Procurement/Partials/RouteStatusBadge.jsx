export default function RouteStatusBadge({ status }) {
    const normalizedStatus = status ?? "pending";
    const styles = {
        pending: "bg-slate-100 text-slate-700 border-slate-300",
        in_transit: "bg-amber-100 text-amber-800 border-amber-300",
        received: "bg-emerald-100 text-emerald-800 border-emerald-300",
        returned: "bg-red-100 text-red-800 border-red-300",
        completed: "bg-blue-100 text-blue-800 border-blue-300",
    };
    const labels = {
        pending: "Pending",
        in_transit: "In Transit",
        received: "Received",
        returned: "Returned",
        completed: "Completed",
    };
    return (
        <span
            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${styles[normalizedStatus] ?? "border-slate-300 bg-slate-100 text-slate-700"}`}
        >
            {" "}
            {labels[normalizedStatus] ?? normalizedStatus}{" "}
        </span>
    );
}
