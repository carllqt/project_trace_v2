import React from "react";

const SelectField = ({
    label,
    name,
    value,
    onChange,
    placeholder = "Select an option",
    disabled = false,
    options = [],
    required = false,
}) => {
    const normalizedOptions = options.map((option) =>
        typeof option === "object"
            ? option
            : {
                  value: option,
                  label: option,
              },
    );

    const baseClass =
        "w-full rounded-lg border px-3 py-2 text-xs font-medium outline-none transition";

    const stateClass = disabled
        ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
        : "border-slate-200 bg-white text-slate-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20";

    return (
        <div>
            {label && (
                <label
                    htmlFor={name}
                    className={`mb-1 block text-[11px] font-bold ${
                        disabled ? "text-slate-400" : "text-slate-600"
                    }`}
                >
                    {label}

                    {required && <span className="ml-0.5 text-red-500">*</span>}
                </label>
            )}

            <select
                id={name}
                name={name}
                value={value ?? ""}
                onChange={onChange}
                disabled={disabled}
                required={required}
                className={`${baseClass} ${stateClass}`}
            >
                <option value="" disabled>
                    {placeholder}
                </option>

                {normalizedOptions.map((option, index) => (
                    <option
                        key={`${option.value}-${index}`}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectField;
