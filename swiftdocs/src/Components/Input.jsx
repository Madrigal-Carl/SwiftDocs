function Input({ icon, type = "text", placeholder, right, ...props }) {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>
      )}

      <input
        type={type}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-[#d1d9ff] text-sm 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        {...props} // ✅ forward name, value, onChange, etc.
      />

      {right && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2">
          {right}
        </span>
      )}
    </div>
  );
}

export default Input;