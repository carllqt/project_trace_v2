import { FileText, History, Paperclip } from "lucide-react";

function TabButton({ label, icon, active, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                py-3 flex items-center gap-2 border-b-2
                font-bold transition-all
                ${
                    active
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                }
            `}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}

export default function ProcurementDrawerTabs({
    activeTab,
    onTabChange,
    routesCount = 0,
    documentsCount = 0,
}) {
    return (
        <div className="px-6 border-b border-slate-100 flex gap-6 bg-white text-xs font-bold shrink-0">
            <TabButton
                label="Active Stage Form & Data"
                icon={<FileText className="w-3.5 h-3.5" />}
                active={activeTab === "stage_form"}
                onClick={() => onTabChange("stage_form")}
            />

            <TabButton
                label={`Routing History (${routesCount})`}
                icon={<History className="w-3.5 h-3.5" />}
                active={activeTab === "routing_history"}
                onClick={() => onTabChange("routing_history")}
            />

            <TabButton
                label={`Documents Vault (${documentsCount})`}
                icon={<Paperclip className="w-3.5 h-3.5" />}
                active={activeTab === "documents"}
                onClick={() => onTabChange("documents")}
            />
        </div>
    );
}
