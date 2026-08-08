import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function SidebarModal({
    isOpen,
    onClose,
    title = "Details",
    icon = null,
    children,
}) {
    if (typeof document === "undefined") {
        return null;
    }

    return createPortal(
        <>
            {/* Overlay */}
            <div
                className={`
                    fixed inset-0
                    z-[9998]
                    bg-black/50
                    backdrop-blur-[3px]
                    transition-opacity
                    duration-300
                    ${
                        isOpen
                            ? "pointer-events-auto opacity-100"
                            : "pointer-events-none opacity-0"
                    }
                `}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside
                className={`
                    fixed inset-y-0 right-0
                    z-[9999]
                    flex flex-col
                    w-full
                    sm:w-[400px]
                    md:w-[600px]
                    lg:w-[800px]
                    overflow-hidden
                    border-l
                    border-slate-200
                    bg-white
                    shadow-2xl
                    transition-transform
                    duration-300
                    ease-out
                    ${isOpen ? "translate-x-0" : "translate-x-full"}
                `}
            >
                {/* Header */}
                <div className="flex h-16 shrink-0 items-center justify-between bg-blue-600 px-6">
                    <div className="flex items-center gap-2">
                        {icon}

                        <h2 className="text-lg font-semibold text-white">
                            {title}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            rounded-full
                            p-2
                            text-white
                            transition
                            hover:bg-red-500
                            hover:scale-105
                            active:scale-95
                        "
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="min-h-0 flex-1 overflow-y-auto p-6">
                    {children}
                </div>
            </aside>
        </>,
        document.body,
    );
}
