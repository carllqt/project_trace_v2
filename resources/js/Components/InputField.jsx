import React from "react";

const InputField = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = "text",
    disabled = false,
    readOnly = false,
    isTextarea = false,
    rows = 3,
    step = 1,
    options = [],
    required = false,
}) => {
    const getDisplayValue = () => {
        if (options.length > 0) {
            const match = options.find((opt) =>
                typeof opt === "object" ? opt.value === value : opt === value,
            );

            return match
                ? typeof match === "object"
                    ? match.label
                    : match
                : value;
        }

        return value;
    };

    const baseClass =
        "w-full rounded-lg border px-3 py-2 text-xs font-medium outline-none transition";

    const stateClass =
        disabled || readOnly
            ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
            : "border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20";

    return (
        <div>
            {label && (
                <label
                    htmlFor={name}
                    className={`mb-1 block text-[11px] font-bold ${
                        disabled || readOnly
                            ? "text-slate-400"
                            : "text-slate-600"
                    }`}
                >
                    {label}

                    {required && <span className="ml-0.5 text-red-500">*</span>}
                </label>
            )}

            {readOnly ? (
                <div
                    className={`${baseClass} ${stateClass} flex min-h-[38px] items-center`}
                >
                    {getDisplayValue()}
                </div>
            ) : isTextarea ? (
                <textarea
                    id={name}
                    name={name}
                    value={value ?? ""}
                    onChange={onChange}
                    disabled={disabled}
                    placeholder={placeholder}
                    rows={rows}
                    required={required}
                    className={`${baseClass} ${stateClass} resize-none`}
                />
            ) : (
                <input
                    id={name}
                    type={type}
                    name={name}
                    value={value ?? ""}
                    onChange={onChange}
                    disabled={disabled}
                    placeholder={placeholder}
                    required={required}
                    step={step}
                    className={`${baseClass} ${stateClass}`}
                />
            )}
        </div>
    );
};

export default InputField;
