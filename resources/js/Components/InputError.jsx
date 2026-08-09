export default function InputError({ message, className = "", ...props }) {
    return message ? (
        <p
            {...props}
            className={`mt-1 text-[10px] font-medium text-red-500 ${className}`}
        >
            {message}
        </p>
    ) : null;
}
