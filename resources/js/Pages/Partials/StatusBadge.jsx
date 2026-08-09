export default function StatusBadge({ completed }) {
    return (
        <span
            className={`inline-flex rounded-md px-2 py-1 text-[10px] font-semibold ${
                completed
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-blue-50 text-blue-700"
            }`}
        >
            {completed ? "Completed" : "In Progress"}
        </span>
    );
}
