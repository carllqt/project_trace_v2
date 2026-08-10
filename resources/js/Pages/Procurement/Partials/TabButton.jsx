export default function TabButton({ label, icon, active, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center gap-2 border-b-2 py-3 font-bold transition-all ${
                active
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
        >
            {icon}
            {label}
        </button>
    );
}
