import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

export default function FormInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  disabled = false,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 block">{label}</label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full rounded-lg border border-(--border-light) bg-white px-4 py-2.5 text-sm text-(--text-dark) placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-(--primary-300) focus:border-(--primary-500) transition-all duration-200 ${
            Icon ? "pl-11" : ""
          } ${disabled ? "bg-gray-50 cursor-not-allowed" : ""}`}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            {showPassword ? (
              <Eye className="w-5 h-5" />
            ) : (
              <EyeClosed className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
