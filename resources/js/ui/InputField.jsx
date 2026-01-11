import React from "react";

export default function InputField({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  rightIcon: RightIcon = null,
  isPassword = false,
  showPassword,
  togglePassword,
}) {
  return (
    <div className="group relative bg-[#2a3f5f]/70 border border-white/10 rounded-2xl px-8 py-3 transition-all duration-300 ease-out hover:border-white/25 hover:bg-[#2a3f5f]/90 focus-within:border-blue-400/60 focus-within:shadow-[0_0_0_1px_rgba(96,165,250,0.4),0_8px_30px_rgba(37,99,235,0.25)]">
      <label className="block text-xs text-gray-400 tracking-wide mb-1">{label}</label>

      <input
        type={isPassword ? (showPassword ? "text" : "password") : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent border-none pr-10 text-white placeholder-gray-500 focus:outline-none focus:ring-0"
      />

      {isPassword && togglePassword ? (
        <button
          type="button"
          onClick={togglePassword}
          className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition group-focus-within:text-blue-300"
        >
          {showPassword ? <RightIcon size={18} /> : <RightIcon size={18} />}
        </button>
      ) : (
        RightIcon && (
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-blue-300 transition">
            <RightIcon size={18} />
          </div>
        )
      )}
    </div>
  );
}
